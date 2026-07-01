from app.models.patient import Patient
from app.models.session import Session


def get_patient_sessions(
    db,
    user_id
):
    patient = (
        db.query(Patient)
        .filter(Patient.user_id == user_id)
        .first()
    )

    if not patient:
        return []

    sessions = (
        db.query(Session)
        .filter(Session.patient_id == patient.id)
        .order_by(Session.created_at.desc())
        .all()
    )

    return sessions

def get_progress_summary(
    db,
    user_id
):
    sessions = get_patient_sessions(
        db,
        user_id
    )

    if not sessions:
        return {
            "total_sessions": 0,
            "total_reps": 0,
            "good_reps": 0,
            "average_form_score": 0,
            "total_duration_seconds": 0
        }

    total_sessions = len(sessions)

    total_reps = sum(
        session.total_reps
        for session in sessions
    )

    good_reps = sum(
        session.good_reps
        for session in sessions
    )

    total_duration = sum(
        session.duration_seconds
        for session in sessions
    )

    average_form = (
        sum(
            session.average_form_score
            for session in sessions
        ) / total_sessions
    )

    return {
        "total_sessions": total_sessions,
        "total_reps": total_reps,
        "good_reps": good_reps,
        "average_form_score": round(average_form, 2),
        "total_duration_seconds": total_duration
    }