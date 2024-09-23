from typing import Optional

from sqlalchemy.orm import Session

from models.workspace import Workspace

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


workspace_crud = WorkspaceCRUDRepository(model=Workspace)
