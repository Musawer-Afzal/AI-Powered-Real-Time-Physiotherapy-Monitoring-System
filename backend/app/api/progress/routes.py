from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User

from app.schemas.progress import (
    SessionHistoryResponse,
    ProgressSummaryResponse
)

from app.services.progress_service import (
    get_patient_sessions,
    get_progress_summary
)

from app.serializers.session_serializer import (
    serialize_session_list,
    serialize_progress_summary
)

router = APIRouter(
    prefix="/api/progress",
    tags=["Progress"]
)

@router.get(
    "/sessions",
    response_model=list[SessionHistoryResponse]
)
def session_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    sessions = get_patient_sessions(
        db,
        current_user.id
    )
    
    from app.serializers.session_serializer import (
    serialize_session_list
)
    return serialize_session_list(sessions)

@router.get(
    "/summary",
    response_model=ProgressSummaryResponse
)
def progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    summary = get_progress_summary(
        db,
        current_user.id
    )
    return serialize_progress_summary(
        summary
    )