from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from ..models.task import Task


def get_task_stats(user_id: str, db: Session) -> dict:
    """Get task statistics for a user."""
    total = db.query(Task).filter(Task.user_id == user_id).count()
    completed = db.query(Task).filter(Task.user_id == user_id, Task.status == "completed").count()
    in_progress = db.query(Task).filter(Task.user_id == user_id, Task.status == "in-progress").count()
    todo = db.query(Task).filter(Task.user_id == user_id, Task.status == "todo").count()

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.completed_at >= today_start)
        .count()
    )

    completion_rate = round((completed / total) * 100, 2) if total > 0 else 0.0

    by_priority: dict = {}
    for priority in ["high", "medium", "low"]:
        by_priority[priority] = db.query(Task).filter(
            Task.user_id == user_id, Task.priority == priority
        ).count()

    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "in_progress_tasks": in_progress,
        "todo_tasks": todo,
        "completed_today": completed_today,
        "completion_rate": completion_rate,
        "by_priority": by_priority,
    }
