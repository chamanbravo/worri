from typing import Optional

from fastapi import HTTPException
from fastapi import status
from models.website import Website
from schemas.website import WebsitePatch
from sqlalchemy.orm import Session

from .base import BaseCRUDRepository


class WebsiteCRUDRepository(BaseCRUDRepository):
    def create_website(self, db: Session, website_data: Website) -> Website:
        db.add(website_data)
        db.commit()
        db.refresh(website_data)
        return website_data

    def get_website_by_id(
        self, db: Session, website_id: int
    ) -> Optional[Website]:
        return db.query(Website).filter(Website.id == website_id).first()

    def get_websites_by_workspace(
        self, db: Session, workspace_id: int
    ) -> list[Website]:
        return (
            db.query(Website)
            .filter(Website.workspace_id == workspace_id)
            .all()
        )

    def delete_website(self, db: Session, website_id: int):
        website = db.query(Website).filter(Website.id == website_id).first()

        if website:
            db.delete(website)
            db.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Website doesn't exist.",
            )

    def patch(
        self, db: Session, website_id: int, user_data: WebsitePatch
    ) -> Optional[Website]:
        website = db.query(Website).filter(Website.id == website_id).first()

        if website:
            for key, value in user_data.model_dump(exclude_unset=True).items():
                setattr(website, key, value)

            db.commit()
            return website
        else:
            return None


website_crud = WebsiteCRUDRepository(model=Website)
