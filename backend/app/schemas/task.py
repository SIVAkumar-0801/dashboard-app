from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    status: str = "todo"
    category: Optional[str] = None
    project: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None


class TaskCreate(TaskBase):
    user_id: str = "default_user"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    project: Optional[str] = None
    deadline: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None


class TaskStatusUpdate(BaseModel):
    status: str


class TaskResponse(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
