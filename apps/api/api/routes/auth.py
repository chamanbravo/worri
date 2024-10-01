from datetime import timedelta

from config import ENV
from crud import user_crud
from database.database import get_db
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import OAuth2PasswordRequestForm
from models.user import User
from schemas.auth import Token
from schemas.user import UserRegister
from sqlalchemy.orm import Session
from utils import security
from utils.security import get_password_hash

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post(
    "/register", response_model=Token, status_code=status.HTTP_201_CREATED
)
def register(user_register: UserRegister, db: Session = Depends(get_db)):
    users = user_crud.get_admins(db)
    if len(users) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not allowed. Admin already exists.",
        )

    user_data = User(
        username=user_register.username,
        hashed_password=get_password_hash(user_register.password),
        role="ADMIN",
    )
    new_user = user_crud.create_user(db, user_data=user_data)

    access_token_expires = timedelta(minutes=ENV.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=new_user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = user_crud.authenticate_user(
        db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )

    access_token_expires = timedelta(minutes=ENV.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
