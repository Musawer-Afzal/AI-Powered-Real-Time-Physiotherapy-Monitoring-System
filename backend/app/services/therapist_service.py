from sqlalchemy.orm import Session

from app.models.user import User
from app.models.patient import Patient
from app.models.session import Session
from app.models.therapist_profile import TherapistProfile
from app.models.therapist_patient import TherapistPatient

from app.core.security import hash_password


def register_therapist(db: Session, data):

    existing = (
        db.query(User).filter(User.email == data.email).first()
    )

    if existing:
        return None

    user = User(
        name = data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="therapist",
        is_approved=False
    )

    db.add(user)
    db.flush()

    profile = TherapistProfile(
        user_id=user.id,
        name=data.name,
        age=data.age,
        gender=data.gender,
        phone_number=data.phone_number,
        specialization=data.specialization,
        license_number=data.license_number
    )
    
    db.add(profile)
    db.commit()
    db.refresh(user)
    return user


def add_patient(db: Session, therapist_user_id, patient_user_uuid):

    patient = (
        db.query(Patient).join(User).filter(User.id == patient_user_uuid).first()
    )

    if not patient:
        return None

    already_exists = (
        db.query(TherapistPatient).filter(
            TherapistPatient.therapist_user_id == therapist_user_id,
            TherapistPatient.patient_id == patient.id
        ).first()
    )

    if already_exists:
        return "exists"

    assignment = TherapistPatient(
        therapist_user_id=therapist_user_id,
        patient_id=patient.id
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


def get_my_patients(db: Session, therapist_user_id):

    assignments = (
        db.query(TherapistPatient).filter(
            TherapistPatient.therapist_user_id == therapist_user_id
        ).all()
    )

    patients = []

    for assignment in assignments:
        patient = assignment.patient
        user = patient.user
        patients.append({
            "patient_id": str(patient.id),
            "user_id": str(user.id),
            "name": user.name,
            "email": user.email,
            "gender": patient.gender,
            "date_of_birth": patient.date_of_birth,
            "diagnosis": patient.diagnosis
        })
    return patients


def therapist_has_patient(
    db: Session,
    therapist_user_id,
    patient_id
):

    return (
        db.query(TherapistPatient).filter(
            TherapistPatient.therapist_user_id == therapist_user_id,
            TherapistPatient.patient_id == patient_id
        ).first()
    )


def get_patient_details(db: Session, patient_id):

    patient = (
        db.query(Patient).filter(Patient.id == patient_id).first()
    )

    if not patient:
        return None

    user = patient.user

    sessions = (
        db.query(Session).filter(Session.patient_id == patient.id).order_by(Session.created_at.desc()).all()
    )

    total_sessions = len(sessions)
    total_reps = sum(s.total_reps for s in sessions)
    good_reps = sum(s.good_reps for s in sessions)
    average_score = (
        sum(s.average_form_score for s in sessions) / total_sessions
        if total_sessions
        else 0
    )

    return {
        "patient": {
            "patient_id": str(patient.id),
            "user_id": str(user.id),
            "name": user.name,
            "email": user.email,
            "gender": patient.gender,
            "date_of_birth": patient.date_of_birth,
            "diagnosis": patient.diagnosis,
            "therapist_notes": patient.therapist_notes
        },

        "statistics": {
            "total_sessions": total_sessions,
            "total_reps": total_reps,
            "good_reps": good_reps,
            "average_score": round(average_score, 2)
        },

        "sessions": [
            {
                "id": str(s.id),
                "exercise": s.exercise.name,
                "reps": s.total_reps,
                "good_reps": s.good_reps,
                "score": s.average_form_score,
                "duration": s.duration_seconds,
                "date": s.created_at
            }
            for s in sessions
        ]
    }