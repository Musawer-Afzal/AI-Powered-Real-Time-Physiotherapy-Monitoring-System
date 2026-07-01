from pydantic import BaseModel
from uuid import UUID


class SessionCreate(BaseModel):
    exercise_code: str


class SessionResponse(BaseModel):
    id: UUID
    patient_id: UUID
    exercise_id: UUID

    total_reps: int
    good_reps: int
    average_form_score: float
    duration_seconds: int

    class Config:
        from_attributes = True


class SessionFinish(BaseModel):
    total_reps: int
    good_reps: int
    average_form_score: float
    duration_seconds: int