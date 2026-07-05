from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.user import User
from app.models.patient import Patient
from app.models.session import Session
from app.models.therapist_profile import TherapistProfile
from app.models.therapist_patient import TherapistPatient


def get_dashboard_stats(db: Session):

    return {

        "users":
            db.query(User).count(),

        "patients":
            db.query(Patient).count(),

        "therapists":
            db.query(TherapistProfile).count(),

        "sessions":
            db.query(Session).count(),

        "pending_therapists":
            db.query(User)
            .filter(
                User.role == "therapist",
                User.is_approved == False
            )
            .count()

    }

def get_all_users(
    db: Session,
    role=None,
    approved=None,
    search=None
):

    query = db.query(User)

    if role:
        query = query.filter(
            User.role == role
        )

    if approved is not None:
        query = query.filter(
            User.is_approved == approved
        )

    if search:

        query = query.filter(

            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )

        )

    users = query.order_by(
        User.created_at.desc()
    ).all()

    return users

def approve_therapist(db: Session, user_id):

    therapist = (

        db.query(User)

        .filter(User.id == user_id)

        .first()

    )

    if not therapist:

        return None

    therapist.is_approved = True

    db.commit()

    db.refresh(therapist)

    return therapist


def update_user_status(
    db: Session,
    user_id,
    approved
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return False

    user.is_approved = approved

    db.commit()

    return True


def delete_user(db, user_id):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return False

    # Patient
    patient = (
        db.query(Patient)
        .filter(Patient.user_id == user.id)
        .first()
    )

    if patient:
        # Delete sessions
        db.query(Session).filter(Session.patient_id == patient.id).delete()

        # Delete therapist assignments
        db.query(TherapistPatient).filter(TherapistPatient.patient_id == patient.id).delete()
        db.delete(patient)

    # Therapist
    therapist_profile = (
        db.query(TherapistProfile)
        .filter(TherapistProfile.user_id == user.id)
        .first()
    )

    if therapist_profile:
        db.query(TherapistPatient).filter(
            TherapistPatient.therapist_user_id == user.id
        ).delete()
        db.delete(therapist_profile)

    # Delete user
    db.delete(user)
    db.commit()
    return True