from sqlalchemy.orm import Session

from app.models.exercise import Exercise


def get_all_exercises(db: Session):
    return db.query(Exercise).all()

def get_exercise_by_id(
    db: Session,
    exercise_id
):
    return (
        db.query(Exercise).filter(Exercise.id == exercise_id).first()
    )