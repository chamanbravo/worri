from typing import Optional

from pydantic import BaseModel


class WorkspaceBase(BaseModel):
    name: str


class WorkspaceOut(WorkspaceBase):
    id: int
    access_code: str


class WorkspaceListOut(BaseModel):
    workspaces: list[str]


class WorkspacePatch(BaseModel):
    name: Optional[str] = None
    access_code: Optional[str] = None


class JoinWorkspace(BaseModel):
    access_code: str
