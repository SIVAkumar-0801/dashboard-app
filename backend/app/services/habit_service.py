from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from ..models.habit import Habit, HabitLog


def calculate_streak(habit_id: str, db: Session) -> dict:
    """Calculate current and longest streak for a habit."""
    logs = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id)
        .order_by(HabitLog.date.desc())
        .all()
    )

    if not logs:
        return {"current_streak": 0, "longest_streak": 0}

    completed_dates = sorted({log.date for log in logs}, reverse=True)

    # Current streak
    current_streak = 0
    check_date = date.today()
    for completed_date in completed_dates:
        if completed_date == check_date or completed_date == check_date - timedelta(days=1):
            current_streak += 1
            check_date = completed_date - timedelta(days=1)
        elif completed_date < check_date - timedelta(days=1):
            break

    # Longest streak
    longest_streak = 0
    temp_streak = 1
    sorted_dates = sorted(completed_dates)
    for i in range(1, len(sorted_dates)):
        if sorted_dates[i] == sorted_dates[i - 1] + timedelta(days=1):
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 1
    if sorted_dates:
        longest_streak = max(longest_streak, temp_streak)

    return {"current_streak": current_streak, "longest_streak": longest_streak}


def calculate_completion_rate(habit_id: str, db: Session, days: int = 30) -> float:
    """Calculate completion rate for a habit over the last N days."""
    since = date.today() - timedelta(days=days)
    log_count = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.date >= since)
        .count()
    )
    return round((log_count / days) * 100, 2) if days > 0 else 0.0


def get_habit_stats(habit_id: str, db: Session) -> dict:
    """Get comprehensive stats for a habit."""
    streak_data = calculate_streak(habit_id, db)
    completion_rate = calculate_completion_rate(habit_id, db, days=30)
    total_logs = db.query(HabitLog).filter(HabitLog.habit_id == habit_id).count()
    return {
        **streak_data,
        "completion_rate": completion_rate,
        "total_completions": total_logs,
    }
