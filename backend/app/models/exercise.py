import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    code = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    body_region = Column(String)
    difficulty = Column(String)
    movement_type = Column(String)
    sessions = relationship(
    "Session",
    back_populates="exercise"
    )