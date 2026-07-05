from datetime import date
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)

    date_of_birth: date | None = None
    gender: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True