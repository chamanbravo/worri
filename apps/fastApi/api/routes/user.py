from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config import ENV
from crud import user_crud
from database.database import get_db
from schemas.user import NeedSetup

router = APIRouter(tags=["user"])


@router.get("/setup", response_model=NeedSetup)
def setup(db: Session = Depends(get_db)):
    need_setup = user_crud.admin_exists(db)
    return {"need_setup": need_setup}
