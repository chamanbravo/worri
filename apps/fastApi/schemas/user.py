from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    username: str = Field(min_lenght=3)
    email: EmailStr
    password: str = Field(min_length=8)


class NeedSetup(BaseModel):
    need_setup: bool
