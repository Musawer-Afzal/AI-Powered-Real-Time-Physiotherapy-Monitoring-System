from pydantic import BaseModel


class ExerciseResponse(BaseModel):
    id: str
    name: str
    body_region: str | None
    difficulty: str | None
    movement_type: str | None

    class Config:
        from_attributes = True