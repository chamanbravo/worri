from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.user import User
from schemas.user import UserPatch
from utils.security import verify_password

from .base import BaseCRUDRepository


class UserCRUDRepository(BaseCRUDRepository):
    def get_user_by_username(
        self, db: Session, username: str
    ) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create_user(self, db: Session, user_data: User) -> User:
        db.add(user_data)
        db.commit()
        db.refresh(user_data)
        return user_data

    def authenticate_user(
        self, db: Session, username: str, password: str
    ) -> Optional[User]:
        user = self.get_user_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, str(user.hashed_password)):
            return None
        return user

    def admin_exists(self, db: Session) -> bool:
        return db.query(User).filter(User.role == "ADMIN").count() == 0

    def get_user_workspaces(self, db: Session, username: str) -> list[str]:
        user = db.query(User).filter(User.username == username).first()
        if user:
            return user.workspaces
        return []

    def delete_user(self, db: Session, username: str):
        user = db.query(User).filter(User.username == username).first()

        if user:
            db.delete(user)
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User doesn't exist.",
            )

    def patch(
        self, db: Session, username: str, user_data: UserPatch
    ) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()

        if user:
            for key, value in user_data.dict(exclude_unset=True).items():
                setattr(user, key, value)

            db.commit()
            return user
        else:
            return None


user_crud = UserCRUDRepository(model=User)
