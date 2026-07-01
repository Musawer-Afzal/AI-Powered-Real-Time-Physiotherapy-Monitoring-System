from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.user import User


def create_patient_profile(
    db: Session,
    user: User,
    patient_data
):
    existing = (
        db.query(Patient)
        .filter(Patient.user_id == user.id)
        .first()
    )

    if existing:
        return None

    patient = Patient(
        user_id=user.id,
        date_of_birth=patient_data.date_of_birth,
        gender=patient_data.gender,
        diagnosis=patient_data.diagnosis,
        therapist_notes=patient_data.therapist_notes
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


def get_patient_profile(
    db: Session,
    user: User
):
    return (
        db.query(Patient)
        .filter(Patient.user_id == user.id)
        .first()
    )


def update_patient_profile(
    db: Session,
    patient: Patient,
    data
):
    patient.date_of_birth = data.date_of_birth
    patient.gender = data.gender
    patient.diagnosis = data.diagnosis
    patient.therapist_notes = data.therapist_notes

    db.commit()
    db.refresh(patient)

    return patient