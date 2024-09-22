from typing import Tuple

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from config import ENV
from crud import user_crud
from database.database import get_db
from exceptions import _get_credential_exception
from models.user import User
from schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_pagination_params(
    skip: int = Query(0, ge=0), limit: int = Query(10, gt=0)
) -> Tuple[int, int]:
    return skip, limit


def get_token(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    try:
        payload = jwt.decode(token, ENV.SECRET_KEY, algorithms=["HS256"])
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError) as e:
        raise _get_credential_exception(
            status_code=status.HTTP_403_FORBIDDEN
        ) from e
    return token_data


def get_current_user(
    db: Session = Depends(get_db), token: TokenPayload = Depends(get_token)
) -> User:
    user = user_crud.get_one(db, User.id == token.sub)
    if user is None:
        raise _get_credential_exception(
            status_code=status.HTTP_404_NOT_FOUND, details="User not found"
        )
    return user


def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user
