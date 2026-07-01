from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.session_rep import SessionRepCreate

from app.services.session_rep_service import create_rep

router = APIRouter(
    prefix="/api/session-reps",
    tags=["Session Reps"]
)

@router.post("/")
def add_rep(
    rep: SessionRepCreate,
    db: Session = Depends(get_db)
):
    return create_rep(db, rep)