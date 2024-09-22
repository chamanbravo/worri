from pydantic import BaseModel


class WorkspaceBase(BaseModel):
    name: str


class WorkspaceListOut(BaseModel):
    workspaces: list[str]
