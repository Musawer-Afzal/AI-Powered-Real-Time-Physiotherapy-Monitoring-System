from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SessionHistoryResponse(BaseModel):
    id: UUID

    exercise_name: str

    total_reps: int

    good_reps: int

    average_form_score: float

    duration_seconds: int

    created_at: datetime

    class Config:
        from_attributes = True

class ProgressSummaryResponse(BaseModel):
    total_sessions: int

    total_reps: int

    good_reps: int

    average_form_score: float

    total_duration_seconds: int