from api.dependencies import get_current_admin
from api.dependencies import get_current_user
from crud import website_crud
from crud import workspace_crud
from database.database import get_db
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from models.user import User
from models.workspace import Workspace
from schemas.base import GenericOut
from schemas.user import UserOut
from schemas.website import WebsiteOut
from schemas.workspace import WorkspaceBase
from schemas.workspace import WorkspaceOut
from schemas.workspace import WorkspacePatch
from sqlalchemy import select
from sqlalchemy.orm import Session
from utils.security import gen_workspace_access_code

router = APIRouter(tags=["workspace"], prefix="/workspaces")


@router.post(
    "",
    response_model=WorkspaceOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
)
def create(
    workspace_data: WorkspaceBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    workspace = workspace_crud.get_workspace_by_name(db, workspace_data.name)
    if workspace:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workspace already exists.",
        )
    access_code = gen_workspace_access_code()
    new_workspace = Workspace(
        name=workspace_data.name,
        access_code=access_code,
        created_by_id=current_user.id,
    )
    workspace = workspace_crud.create_workspace(db, new_workspace)

    if workspace:
        workspace_crud.add_user_to_workspace(db, workspace, current_user)

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


@router.get(
    "/{name}/websites",
    response_model=list[WebsiteOut],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
def workspace_websites(name: str, db: Session = Depends(get_db)):
    workspace = workspace_crud.get_workspace_by_name(db, workspace_name=name)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workspace doesn't exist.",
        )
    workspace_id = db.scalar(select(workspace.id))
    if workspace_id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Workspace ID is unexpectedly None.",
        )
    websites = website_crud.get_websites_by_workspace(db, workspace_id)
    return websites


@router.get(
    "/{name}/users",
    response_model=list[UserOut],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
def workspace_users(name: str, db: Session = Depends(get_db)):
    workspace = workspace_crud.get_workspace_by_name(db, workspace_name=name)
    if workspace is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workspace doesn't exist.",
        )
    workspace_id = db.scalar(select(workspace.id))
    if workspace_id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Workspace ID is unexpectedly None.",
        )
    users = workspace_crud.get_users_in_workspace(db, workspace_id)
    return users
