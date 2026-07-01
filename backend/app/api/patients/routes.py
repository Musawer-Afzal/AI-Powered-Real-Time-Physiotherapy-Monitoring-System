from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.patient import Patient

router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient).filter(Patient.user_id == current_user.id).first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    return {
        "id": str(patient.id),
        "user_id": str(patient.user_id),
        "diagnosis": patient.diagnosis,
        "gender": patient.gender,
        "date_of_birth": patient.date_of_birth,
        "therapist_notes": patient.therapist_notes
    }