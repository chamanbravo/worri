from datetime import datetime

from pydantic import BaseModel


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str


class TokenPayload(BaseModel):
    sub: str
    exp: datetime
