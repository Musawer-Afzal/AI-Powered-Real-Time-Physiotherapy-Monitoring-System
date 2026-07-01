from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.exercise_service import (
    get_all_exercises,
    get_exercise_by_id
)

router = APIRouter(
    prefix="/api/exercises",
    tags=["Exercises"]
)


@router.get("")
def list_exercises(
    db: Session = Depends(get_db)
):
    return get_all_exercises(db)


@router.get("/{exercise_id}")
def get_exercise(
    exercise_id: str,
    db: Session = Depends(get_db)
):
    exercise = get_exercise_by_id(
        db,
        exercise_id
    )

    if not exercise:
        raise HTTPException(
            status_code=404,
            detail="Exercise not found"
        )

    return exercise