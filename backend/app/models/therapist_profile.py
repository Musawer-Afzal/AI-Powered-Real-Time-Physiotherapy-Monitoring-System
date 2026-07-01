import uuid

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer
from sqlalchemy import ForeignKey

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from app.core.database import Base


class TherapistProfile(Base):

    __tablename__ = "therapist_profiles"

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        primary_key=True,
        default=uuid.uuid4
    )

    name = Column(String, nullable=False)

    age = Column(Integer)

    gender = Column(String)

    phone_number = Column(String)

    license_number = Column(
        String,
        unique=True,
        nullable=False
    )

    specialization = Column(String)

    user = relationship(
        "User",
        back_populates="therapist_profile"
    )