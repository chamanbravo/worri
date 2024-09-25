from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.workspace import Workspace
from schemas.workspace import WorkspacePatch

from .base import BaseCRUDRepository


class WorkspaceCRUDRepository(BaseCRUDRepository):
    def create_workspace(
        self, db: Session, workspace_data: Workspace
    ) -> Workspace:
        db.add(workspace_data)
        db.commit()
        db.refresh(workspace_data)
        return workspace_data

    def get_workspace_by_name(
        self, db: Session, workspace_name: str
    ) -> Optional[Workspace]:
        workspace = (
            db.query(Workspace)
            .filter(Workspace.name == workspace_name)
            .first()
        )
        return workspace

    def delete_workspace(self, db: Session, workspace_name: str):
        workspace = (
            db.query(Workspace)
            .filter(Workspace.name == workspace_name)
            .first()
        )

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
            for key, value in user_data.dict(exclude_unset=True).items():
                setattr(workspace, key, value)

            db.commit()
            return workspace
        else:
            return None


workspace_crud = WorkspaceCRUDRepository(model=Workspace)
