from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.patient import Patient
from app.models.session import Session as SessionModel

from app.schemas.therapist import (
    TherapistRegister,
    AddPatientRequest
)

from app.services.therapist_service import (
    register_therapist,
    add_patient,
    get_my_patients,
    therapist_has_patient,
    get_patient_details
)

router = APIRouter(
    prefix="/api/therapist",
    tags=["Therapist"]
)

@router.post("/register")
def register(
    data: TherapistRegister,
    db: Session = Depends(get_db)
):
    therapist = register_therapist(
        db,
        data
    )

    if therapist is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message":
        "Registration successful. Waiting for admin approval."
    }

@router.post("/add-patient")
def add_new_patient(
    request: AddPatientRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "therapist":
        raise HTTPException(
            status_code=403,
            detail="Only therapists can access this endpoint."
        )

    result = add_patient(
        db,
        current_user.id,
        request.patient_uuid
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    if result == "exists":
        raise HTTPException(
            status_code=400,
            detail="Patient already assigned."
        )

    return {
        "message": "Patient added successfully."
    }

@router.get("/my-patients")
def my_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "therapist":
        raise HTTPException(
            status_code=403,
            detail="Only therapists allowed."
        )

    return get_my_patients(
        db,
        current_user.id
    )

@router.get("/patient/{patient_id}")
def patient_details(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "therapist":
        raise HTTPException(
            status_code=403,
            detail="Only therapists allowed."
        )

    allowed = therapist_has_patient(
        db,
        current_user.id,
        patient_id
    )

    if not allowed:
        raise HTTPException(
            status_code=403,
            detail="Access denied."
        )

    patient = get_patient_details(
        db,
        patient_id
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found."
        )

    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.patient_id == patient_id)
        .order_by(SessionModel.created_at.desc())
        .all()
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
    "patient": patient,
    "statistics": {
        "total_sessions": total_sessions,
        "total_reps": total_reps,
        "good_reps": good_reps,
        "average_score": round(average_score, 2)
    },
    "sessions": [
        {
            "exercise":
                s.exercise.name,
            "reps":
                s.total_reps,
            "good_reps":
                s.good_reps,
            "score":
                s.average_form_score,
            "duration":
                s.duration_seconds,
            "date":
                s.created_at
        }
        for s in sessions
    ]
}

@router.put("/patient/{patient_id}/notes")
def update_notes(
    patient_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed = therapist_has_patient(
        db,
        current_user.id,
        patient_id
    )

    if not allowed:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    patient = (
        db.query(Patient).filter(Patient.id == patient_id).first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.therapist_notes = body["therapist_notes"]
    db.commit()
    return {
        "message": "Notes updated"
    }