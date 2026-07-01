import uuid

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from app.core.database import Base


class TherapistPatient(Base):

    __tablename__ = "therapist_patients"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    therapist_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    patient_id = Column(
        UUID(as_uuid=True),
        ForeignKey("patients.id"),
        nullable=False
    )

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    therapist = relationship(
        "User",
        foreign_keys=[therapist_user_id]
    )

    patient = relationship(
        "Patient",
        back_populates="therapist_links"
    )