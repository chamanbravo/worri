from sqlalchemy.orm import Session

from models.user import User


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(
    db: Session, username: str, email: str, hashed_password: str, role: str
):
    db_user = User(
        username=username,
        email=email,
        role=role,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
