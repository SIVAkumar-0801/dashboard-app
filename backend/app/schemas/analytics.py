from pydantic import BaseModel
from datetime import date
from typing import List, Dict, Optional


class DashboardStats(BaseModel):
    total_habits: int
    active_habits: int
    habits_completed_today: int
    habit_completion_rate_today: float
    total_tasks: int
    tasks_todo: int
    tasks_in_progress: int
    tasks_completed: int
    tasks_completed_today: int
    longest_streak: int
    average_streak: float
    total_routines: int
    active_routines: int


class HabitAnalytics(BaseModel):
    habit_id: str
    habit_name: str
    current_streak: int
    longest_streak: int
    completion_rate_30d: float
    total_completions: int


class TaskAnalytics(BaseModel):
    total_tasks: int
    completed_tasks: int
    completion_rate: float
    by_priority: Dict[str, int]
    by_category: Dict[str, int]
    by_status: Dict[str, int]
    average_completion_hours: Optional[float] = None


class HeatmapEntry(BaseModel):
    date: str  # ISO date string
    count: int
    level: int  # 0-4


class WeeklyTrend(BaseModel):
    week_start: str  # ISO date string
    habits_completed: int
    tasks_completed: int
    routines_completed: int
    total_activities: int
