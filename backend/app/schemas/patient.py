from datetime import date
from pydantic import BaseModel


class PatientCreate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = None
    diagnosis: str | None = None
    therapist_notes: str | None = None


class PatientUpdate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = None
    diagnosis: str | None = None
    therapist_notes: str | None = None


class PatientResponse(BaseModel):
    id: str
    user_id: str

    date_of_birth: date | None
    gender: str | None
    diagnosis: str | None
    therapist_notes: str | None

    class Config:
        from_attributes = True