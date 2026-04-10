from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, List


class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "other"
    color: str = "#3B82F6"
    icon: Optional[str] = None
    frequency: str = "daily"
    target_per_week: int = 7
    is_active: bool = True


class HabitCreate(HabitBase):
    user_id: str = "default_user"


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    frequency: Optional[str] = None
    target_per_week: Optional[int] = None
    is_active: Optional[bool] = None


class HabitLogBase(BaseModel):
    notes: Optional[str] = None
    date: Optional[date] = None


class HabitLogCreate(HabitLogBase):
    habit_id: str
    user_id: str = "default_user"


class HabitLogResponse(HabitLogBase):
    id: str
    habit_id: str
    user_id: str
    completed_at: datetime
    date: date

    model_config = {"from_attributes": True}


class HabitResponse(HabitBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    current_streak: int = 0
    longest_streak: int = 0
    completion_rate: float = 0.0
    habit_logs: List[HabitLogResponse] = []

    model_config = {"from_attributes": True}
