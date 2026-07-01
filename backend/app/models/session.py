import uuid

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Float,
    DateTime
)

from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Session(Base):
    __tablename__ = "sessions"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id"),
        nullable=False
    )

    exercise_id = Column(
        UUID(as_uuid=True),
        ForeignKey("exercises.id"),
        nullable=False
    )

    total_reps = Column(Integer)
    good_reps = Column(Integer)
    average_form_score = Column(Float)
    duration_seconds = Column(Integer)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    patient = relationship("Patient")
    exercise = relationship(
        "Exercise",
        back_populates="sessions"
    )