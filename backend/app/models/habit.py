import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from ..database import Base


class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID())
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return str(value)
        if not isinstance(value, uuid.UUID):
            return str(uuid.UUID(str(value)))
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return str(value)


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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    habit_logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    habit_id = Column(GUID(), ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, index=True, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)
    date = Column(Date, default=date.today)

    habit = relationship("Habit", back_populates="habit_logs")
