from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from models.user import RoleEnum


class UserBase(BaseModel):
    username: str
    email: str
    role: str


class NeedSetup(BaseModel):
    need_setup: bool


class UserRegister(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=8)


class UserOut(UserBase):
    first_name: str
    last_name: str


class UserCreate(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=8)
    role: RoleEnum


class UserPatch(BaseModel):
    role: Optional[RoleEnum] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None
