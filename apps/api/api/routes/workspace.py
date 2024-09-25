from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from api.dependencies import get_current_admin, get_current_user
from crud import workspace_crud
from database.database import get_db
from models.workspace import Workspace
from schemas.base import GenericOut
from schemas.workspace import WorkspaceBase, WorkspaceOut, WorkspacePatch

router = APIRouter(tags=["workspace"], prefix="/workspaces")


@router.post(
    "",
    response_model=WorkspaceOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
)
def create(workspace_data: WorkspaceBase, db: Session = Depends(get_db)):
    new_workspace = Workspace(name=workspace_data.name)
    workspace = workspace_crud.create_workspace(db, new_workspace)
    return workspace


@router.get(
    "/{name}",
    response_model=WorkspaceOut,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
def retrieve(name: str, db: Session = Depends(get_db)):
    workspace = workspace_crud.get_workspace_by_name(db, name)
    return workspace


@router.delete(
    "/{name}",
    response_model=GenericOut,
    dependencies=[Depends(get_current_admin)],
)
def delete_workspace(name: str, db: Session = Depends(get_db)):
    workspace = workspace_crud.delete_workspace(db, name)
    return workspace


@router.patch(
    "/{name}",
    response_model=WorkspaceOut,
    dependencies=[Depends(get_current_admin)],
)
def patch_workspace(
    workspace_name: str,
    workspace_data: WorkspacePatch,
    db: Session = Depends(get_db),
):
    workspace = workspace_crud.patch_workspace(
        db, workspace_name, workspace_data
    )
    return workspace
