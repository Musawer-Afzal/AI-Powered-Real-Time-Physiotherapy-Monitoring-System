from uuid import UUID
from datetime import date
from pydantic import BaseModel, EmailStr, Field

class TherapistRegister(BaseModel):

    name: str = Field(
        min_length=3,
        max_length=100
    )

    age: int = Field(
        ge=21,
        le=80
    )
    gender: str
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=64
    )
    phone_number: str = Field(
        min_length=10,
        max_length=20
    )
    specialization: str = Field(
        min_length=3,
        max_length=100
    )
    license_number: str = Field(
        min_length=5,
        max_length=50
    )


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
    diagnosis: str | None = Field(
        default=None,
        max_length=1000
    )