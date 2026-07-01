from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.patient import Patient
from app.models.session import Session
from app.models.exercise import Exercise

from app.schemas.session import (
    SessionCreate,
    SessionResponse,
    SessionFinish
)

from app.services.session_service import (
    create_session,
    finish_session
)

router = APIRouter(
    prefix="/api/sessions",
    tags=["Sessions"]
)

@router.post(
    "/start",
    response_model=SessionResponse
)
def start_session(
    data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.user_id == current_user.id
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    exercise = (db.query(Exercise).filter(Exercise.code == data.exercise_code).first()
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )
    session = create_session(
        db,
        patient.id,
        exercise.id
    )

    return session

@router.put(
    "/{session_id}/finish",
    response_model=SessionResponse
)
def complete_session(
    session_id: str,
    data: SessionFinish,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):
    session = (
        db.query(Session)
        .filter(Session.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return finish_session(
        db,
        session,
        data
    )

@router.get("/me")
def my_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient).filter(Patient.user_id == current_user.id).first()
    )

    if not patient:
        return []
    sessions = (
        db.query(Session).filter(Session.patient_id == patient.id).order_by(Session.created_at.desc()).all()
    )

    results = []
    for session in sessions:
        exercise = (
            db.query(Exercise).filter(Exercise.id == session.exercise_id).first()
        )

        results.append({
            "id": str(session.id),
            "exercise_name": exercise.name,
            "total_reps": session.total_reps,
            "good_reps": session.good_reps,
            "average_form_score": session.average_form_score,
            "duration_seconds": session.duration_seconds,
            "created_at": session.created_at
        })

    return results