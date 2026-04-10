import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Date, JSON
from ..database import Base, GUID


class Analytics(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(GUID(), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=False)
    snapshot_date = Column(Date, default=date.today)
    total_habits = Column(Integer, default=0)
    habits_completed_today = Column(Integer, default=0)
    total_tasks = Column(Integer, default=0)
    tasks_completed_today = Column(Integer, default=0)
    overall_completion_rate = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
