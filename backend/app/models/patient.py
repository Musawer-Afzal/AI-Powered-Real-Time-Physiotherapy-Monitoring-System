import uuid

from sqlalchemy import Column, String, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    date_of_birth = Column(Date)
    gender = Column(String)
    diagnosis = Column(String)
    therapist_notes = Column(String)
    user = relationship("User")
    therapist_links = relationship(
        "TherapistPatient",
        back_populates="patient"
    )