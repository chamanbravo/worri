from typing import Optional

from pydantic import BaseModel
from pydantic import Field


class WebsiteIn(BaseModel):
    name: str = Field(min_length=2)
    domain: str = Field(min_length=2)
    workspace: str


class WebsiteOut(BaseModel):
    id: int
    name: str = Field(min_length=2)
    domain: str = Field(min_length=2)


class WebsitePatch(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
