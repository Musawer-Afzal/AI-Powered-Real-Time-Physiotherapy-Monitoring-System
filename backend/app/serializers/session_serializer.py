from app.schemas.progress import SessionHistoryResponse

from app.schemas.progress import (
    ProgressSummaryResponse
)

def serialize_session(session):
    return SessionHistoryResponse(
        id=session.id,
        exercise_name=session.exercise.name,
        total_reps=session.total_reps,
        good_reps=session.good_reps,
        average_form_score=session.average_form_score,
        duration_seconds=session.duration_seconds,
        created_at=session.created_at
    )

def serialize_session_list(sessions):
    return [
        serialize_session(session)
        for session in sessions
    ]

def serialize_progress_summary(summary):
    return ProgressSummaryResponse(
        **summary
    )