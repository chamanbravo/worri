from typing import Optional

from fastapi import HTTPException
from fastapi import status
from models.user import User
from models.user import user_workspace
from models.workspace import Workspace
from schemas.workspace import WorkspacePatch
from sqlalchemy import select
from sqlalchemy.orm import Session

from .base import BaseCRUDRepository


class WorkspaceCRUDRepository(BaseCRUDRepository):
    def create_workspace(
        self, db: Session, workspace_data: Workspace
    ) -> Workspace:
        db.add(workspace_data)
        db.commit()
        db.refresh(workspace_data)
        return workspace_data

    def add_user_to_workspace(
        self, db: Session, workspace: Workspace, user: User
    ):
        user.workspaces.append(workspace)
        db.commit()

    def get_workspace_by_name(
        self, db: Session, workspace_name: str
    ) -> Optional[Workspace]:
        workspace = (
            db.query(Workspace)
            .filter(Workspace.name == workspace_name)
            .first()
        )
        return workspace

    def delete_workspace(
        self,
        db: Session,
        workspace_name: str,
    ):
        workspace = self.get_workspace_by_name(db, workspace_name)

        if workspace:
            db.delete(workspace)
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace doesn't exist.",
            )

    def patch_workspace(
        self, db: Session, workspace_name: str, user_data: WorkspacePatch
    ) -> Optional[Workspace]:
        workspace = (
            db.query(Workspace)
            .filter(Workspace.name == workspace_name)
            .first()
        )

        if workspace:
            for key, value in user_data.model_dump(exclude_unset=True).items():
                setattr(workspace, key, value)

            db.commit()
            return workspace
        else:
            return None

    def get_users_in_workspace(self, db: Session, workspace_id: int):
        query = (
            select(User)
            .join(user_workspace)
            .where(user_workspace.c.workspace_id == workspace_id)
        )

        users = db.execute(query).scalars().all()
        return users


workspace_crud = WorkspaceCRUDRepository(model=Workspace)
