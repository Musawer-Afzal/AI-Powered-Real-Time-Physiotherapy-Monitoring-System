from pydantic import BaseModel, Field
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
    total_reps: int = Field(ge=0)
    good_reps: int = Field(ge=0)
    average_form_score: float = Field(
        ge=0,
        le=100
    )
    duration_seconds: int = Field(ge=0)