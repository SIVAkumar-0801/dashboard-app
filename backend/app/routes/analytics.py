from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.analytics import DashboardStats, HabitAnalytics, TaskAnalytics, HeatmapEntry, WeeklyTrend
from ..services.analytics_service import get_dashboard_stats, get_heatmap_data, get_trend_data
from ..services.habit_service import calculate_streak, calculate_completion_rate as habit_rate
from ..services.task_service import get_task_stats
from ..models.habit import Habit
from ..models.task import Task

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard_stats(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    return get_dashboard_stats(user_id, db)


@router.get("/habits", response_model=List[HabitAnalytics])
def habit_analytics(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    habits = db.query(Habit).filter(Habit.user_id == user_id, Habit.is_active == True).all()
    result = []
    for habit in habits:
        streaks = calculate_streak(habit.id, db)
        rate = habit_rate(habit.id, db, days=30)
        result.append(
            HabitAnalytics(
                habit_id=habit.id,
                habit_name=habit.name,
                current_streak=streaks["current_streak"],
                longest_streak=streaks["longest_streak"],
                completion_rate_30d=rate,
                total_completions=len(habit.habit_logs),
            )
        )
    return result


@router.get("/tasks", response_model=TaskAnalytics)
def task_analytics(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    stats = get_task_stats(user_id, db)
    tasks = db.query(Task).filter(Task.user_id == user_id).all()

    by_category: dict = {}
    for task in tasks:
        cat = task.category or "uncategorized"
        by_category[cat] = by_category.get(cat, 0) + 1

    by_status = {
        "todo": stats["todo_tasks"],
        "in-progress": stats["in_progress_tasks"],
        "completed": stats["completed_tasks"],
    }

    return TaskAnalytics(
        total_tasks=stats["total_tasks"],
        completed_tasks=stats["completed_tasks"],
        completion_rate=stats["completion_rate"],
        by_priority=stats["by_priority"],
        by_category=by_category,
        by_status=by_status,
    )


@router.get("/heatmap", response_model=List[HeatmapEntry])
def heatmap(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    return get_heatmap_data(user_id, db)


@router.get("/trends", response_model=List[WeeklyTrend])
def trends(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    return get_trend_data(user_id, db)
