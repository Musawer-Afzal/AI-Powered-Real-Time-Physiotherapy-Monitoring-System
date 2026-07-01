from app.models.session import Session


def create_session(
    db,
    patient_id,
    exercise_id
):
    session = Session(
        patient_id=patient_id,
        exercise_id=exercise_id,
        total_reps=0,
        good_reps=0,
        average_form_score=0,
        duration_seconds=0
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session

def finish_session(
    db,
    session,
    data
):
    session.total_reps = data.total_reps
    session.good_reps = data.good_reps
    session.average_form_score = data.average_form_score
    session.duration_seconds = data.duration_seconds

    db.commit()
    db.refresh(session)

    return session