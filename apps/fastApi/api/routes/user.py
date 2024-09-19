from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.user import create_user, get_users
from database.database import get_db
from schemas.user import UserRegister

router = APIRouter(tags=["users"])


@router.post("/register")
def register(user_register: UserRegister, db: Session = Depends(get_db)):
    return {"detail": "under construction"}


@router.get("/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users
