import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base, GUID


class Habit(Base):
    __tablename__ = "habits"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, default="other")  # health/productivity/learning/personal/other
    color = Column(String, default="#3B82F6")
    icon = Column(String, nullable=True)
    frequency = Column(String, default="daily")  # daily/weekly
    target_per_week = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    habit_logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    habit_id = Column(GUID(), ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, index=True, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    notes = Column(String, nullable=True)
    date = Column(Date, default=date.today)

    habit = relationship("Habit", back_populates="habit_logs")
