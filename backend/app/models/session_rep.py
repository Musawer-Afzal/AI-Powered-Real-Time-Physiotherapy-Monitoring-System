import uuid
from sqlalchemy import Boolean

from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey
)

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class SessionRep(Base):
    __tablename__ = "session_reps"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id"),
        nullable=False
    )

    rep_number = Column(Integer)

    form_score = Column(Float)

    is_good_rep = Column(Boolean)