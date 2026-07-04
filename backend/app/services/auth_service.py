from sqlalchemy.orm import Session
from datetime import date
from app.models.user import User
from app.models.patient import Patient

from app.core.security import (
    hash_password,
    verify_password
)


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    date_of_birth: date | None = None,
    gender: str | None = None
):
    existing_user = (db.query(User).filter(User.email == email).first())

    if existing_user:
        return None

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role="patient",
        is_approved=True
    )

    db.add(user)
    db.flush()
    patient = Patient(
        user_id=user.id,
        date_of_birth=date_of_birth,
        gender=gender,
        diagnosis="",
        therapist_notes=""
    )
    db.add(patient)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    if (
        user.role == "therapist"
        and not user.is_approved
    ):
        return "NOT_APPROVED"

    return user