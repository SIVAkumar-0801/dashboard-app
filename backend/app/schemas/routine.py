from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List


class RoutineBase(BaseModel):
    name: str
    description: Optional[str] = None
    time_of_day: str = "morning"
    duration_minutes: int = 30
    days_of_week: str = "1,2,3,4,5"
    is_active: bool = True


class RoutineCreate(RoutineBase):
    user_id: str = "default_user"


class RoutineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    time_of_day: Optional[str] = None
    duration_minutes: Optional[int] = None
    days_of_week: Optional[str] = None
    is_active: Optional[bool] = None


class RoutineLogBase(BaseModel):
    notes: Optional[str] = None
    date: Optional[date] = None


class RoutineLogCreate(RoutineLogBase):
    routine_id: str
    user_id: str = "default_user"


class RoutineLogResponse(RoutineLogBase):
    id: str
    routine_id: str
    user_id: str
    completed_at: datetime
    date: date

    model_config = {"from_attributes": True}


class RoutineResponse(RoutineBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    completion_rate: float = 0.0

    model_config = {"from_attributes": True}
