from api.dependencies import get_current_admin
from api.dependencies import get_current_user  # type: ignore
from crud import user_crud
from database.database import get_db
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from models.user import User
from schemas.base import GenericOut
from schemas.user import NeedSetup
from schemas.user import UserCreate
from schemas.user import UserOut
from schemas.user import UserPatch
from schemas.workspace import WorkspaceListOut
from sqlalchemy.orm import Session
from utils.security import get_password_hash

router = APIRouter(tags=["user"], prefix="/users")


@router.get("/need-setup", response_model=NeedSetup)
def setup(db: Session = Depends(get_db)):
    need_setup = user_crud.admin_exists(db)
    return {"need_setup": need_setup}


@router.get("/me", response_model=UserOut)
def get_current_user(user: User = Depends(get_current_user)):
    return user


@router.post(
    "", response_model=GenericOut, status_code=status.HTTP_201_CREATED
)
def create_user(
    user_data: UserCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = user_crud.get_user_by_username(db, username=user_data.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The user with this username already exists in the system",
        )

    new_user = User(
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        role=user_data.role,
        created_by_id=admin_user.id,
    )
    user_crud.create_user(db, user_data=new_user)

    return {"detail": "User created successfully."}


@router.get(
    "/me/workspaces",
    response_model=WorkspaceListOut,
    dependencies=[Depends(get_current_user)],
)
def get_user_workspaces(  # type: ignore
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    workspaces = user_crud.get_user_workspaces(db, username=str(user.username))
    if len(workspaces):
        workspace_names = [workspace.name for workspace in workspaces]  # type: ignore
        return {"workspaces": workspace_names}
    return {"workspaces": []}


@router.get(
    "/{username}",
    response_model=UserOut,
    dependencies=[Depends(get_current_user)],
)
def get_user(username: str, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_username(db, username=username)
    return user


@router.delete(
    "/{username}",
    response_model=GenericOut,
    dependencies=[Depends(get_current_admin)],
)
def delete_user(username: str, db: Session = Depends(get_db)):
    user_crud.delete_user(db, username=username)
    return {"detail": "User deleted successfully."}


@router.patch(
    "/{username}",
    response_model=UserOut,
    dependencies=[Depends(get_current_admin)],
)
def patch_user(
    username: str, user_data: UserPatch, db: Session = Depends(get_db)
):
    updated_user = user_crud.patch(db, username=username, user_data=user_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return updated_user
