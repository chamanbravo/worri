from pydantic import BaseModel


class GenericOut(BaseModel):
    detail: str
