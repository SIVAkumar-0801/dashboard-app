import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base, GUID


class Routine(Base):
    __tablename__ = "routines"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    time_of_day = Column(String, default="morning")  # morning/afternoon/evening/night
    duration_minutes = Column(Integer, default=30)
    days_of_week = Column(String, default="1,2,3,4,5")  # comma-separated like "1,2,3,4,5"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    routine_logs = relationship("RoutineLog", back_populates="routine", cascade="all, delete-orphan")


class RoutineLog(Base):
    __tablename__ = "routine_logs"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    routine_id = Column(GUID(), ForeignKey("routines.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, index=True, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    date = Column(Date, default=date.today)
    notes = Column(String, nullable=True)

    routine = relationship("Routine", back_populates="routine_logs")
