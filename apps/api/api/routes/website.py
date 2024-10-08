from api.dependencies import get_current_admin
from api.dependencies import get_token
from crud import website_crud
from crud import workspace_crud
from database.database import get_db
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from models.website import Website
from schemas.base import GenericOut
from schemas.website import WebsiteIn
from schemas.website import WebsiteOut
from schemas.website import WebsitePatch
from sqlalchemy.orm import Session

router = APIRouter(tags=["website"], prefix="/websites")


@router.post(
    "", response_model=WebsiteOut, dependencies=[Depends(get_current_admin)]
)
def create_website(website_data: WebsiteIn, db: Session = Depends(get_db)):
    workspace = workspace_crud.get_workspace_by_name(
        db, website_data.workspace
    )
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workspace not found.",
        )

    new_website = Website(
        name=website_data.name,
        domain=website_data.domain,
        workspace_id=workspace.id,
    )
    website_created = website_crud.create_website(db, website_data=new_website)
    return website_created


@router.get(
    "/{website_id}",
    response_model=WebsiteOut,
    dependencies=[Depends(get_token)],
)
def get_website(website_id: int, db: Session = Depends(get_db)):
    website = website_crud.get_website_by_id(db, website_id)
    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webiste not found.",
        )

    return website


@router.patch(
    "/{website_id}",
    response_model=WebsiteOut,
    dependencies=[Depends(get_token)],
)
def update_website(
    website_id: int, website_data: WebsitePatch, db: Session = Depends(get_db)
):
    website = website_crud.patch(db, website_id, website_data)
    if not website:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webiste not found.",
        )

    return website


@router.delete(
    "/{website_id}",
    response_model=GenericOut,
    dependencies=[Depends(get_current_admin)],
)
def delete_website(website_id: int, db: Session = Depends(get_db)):
    website_crud.delete_website(db, website_id)
    return {"detail": "Website deleted successfully."}
