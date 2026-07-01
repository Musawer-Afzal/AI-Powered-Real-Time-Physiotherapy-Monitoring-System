from uuid import UUID
from datetime import date
from pydantic import BaseModel, EmailStr

class TherapistRegister(BaseModel):

    name: str
    age: int
    gender: str
    email: EmailStr
    password: str
    phone_number: str
    specialization: str
    license_number: str


class TherapistProfileResponse(BaseModel):

    user_id: UUID

    name: str

    age: int

    gender: str

    email: EmailStr

    phone_number: str

    specialization: str

    license_number: str

    class Config:
        from_attributes = True


class AddPatientRequest(BaseModel):

    patient_uuid: UUID


class TherapistPatientResponse(BaseModel):

    patient_id: UUID
    user_id: UUID
    name: str
    email: EmailStr
    gender: str | None
    date_of_birth: date | None = None
    diagnosis: str | None = None