from app.core.database import Base, engine

from app.models.user import User
from app.models.patient import Patient
from app.models.exercise import Exercise
from app.models.session import Session
from app.models.session_rep import SessionRep
from app.models.therapist_profile import TherapistProfile
from app.models.therapist_patient import TherapistPatient

Base.metadata.create_all(bind=engine)

print("Tables created successfully")