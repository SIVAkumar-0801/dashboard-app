from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.habit import Habit, HabitLog
from ..models.task import Task
from ..models.routine import Routine, RoutineLog
from .habit_service import calculate_streak, calculate_completion_rate as habit_completion_rate


def get_dashboard_stats(user_id: str, db: Session) -> dict:
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())

    total_habits = db.query(Habit).filter(Habit.user_id == user_id).count()
    active_habits = db.query(Habit).filter(Habit.user_id == user_id, Habit.is_active == True).count()

    habits_completed_today = (
        db.query(func.count(func.distinct(HabitLog.habit_id)))
        .filter(HabitLog.user_id == user_id, HabitLog.date == today)
        .scalar() or 0
    )

    habit_completion_rate_today = (
        round((habits_completed_today / active_habits) * 100, 2) if active_habits > 0 else 0.0
    )

    total_tasks = db.query(Task).filter(Task.user_id == user_id).count()
    tasks_todo = db.query(Task).filter(Task.user_id == user_id, Task.status == "todo").count()
    tasks_in_progress = db.query(Task).filter(Task.user_id == user_id, Task.status == "in-progress").count()
    tasks_completed = db.query(Task).filter(Task.user_id == user_id, Task.status == "completed").count()
    tasks_completed_today = (
        db.query(Task)
        .filter(Task.user_id == user_id, Task.completed_at >= today_start)
        .count()
    )

    habits = db.query(Habit).filter(Habit.user_id == user_id, Habit.is_active == True).all()
    streaks = [calculate_streak(h.id, db)["current_streak"] for h in habits]
    longest_streak = max(streaks, default=0)
    average_streak = round(sum(streaks) / len(streaks), 2) if streaks else 0.0

    total_routines = db.query(Routine).filter(Routine.user_id == user_id).count()
    active_routines = db.query(Routine).filter(Routine.user_id == user_id, Routine.is_active == True).count()

    return {
        "total_habits": total_habits,
        "active_habits": active_habits,
        "habits_completed_today": habits_completed_today,
        "habit_completion_rate_today": habit_completion_rate_today,
        "total_tasks": total_tasks,
        "tasks_todo": tasks_todo,
        "tasks_in_progress": tasks_in_progress,
        "tasks_completed": tasks_completed,
        "tasks_completed_today": tasks_completed_today,
        "longest_streak": longest_streak,
        "average_streak": average_streak,
        "total_routines": total_routines,
        "active_routines": active_routines,
    }


def get_heatmap_data(user_id: str, db: Session) -> list:
    """Return activity heatmap data for the last 365 days."""
    since = date.today() - timedelta(days=364)

    habit_rows = (
        db.query(HabitLog.date, func.count(HabitLog.id).label("count"))
        .filter(HabitLog.user_id == user_id, HabitLog.date >= since)
        .group_by(HabitLog.date)
        .all()
    )

    routine_rows = (
        db.query(RoutineLog.date, func.count(RoutineLog.id).label("count"))
        .filter(RoutineLog.user_id == user_id, RoutineLog.date >= since)
        .group_by(RoutineLog.date)
        .all()
    )

    counts: dict = {}
    for row in habit_rows:
        d = str(row.date)
        counts[d] = counts.get(d, 0) + row.count
    for row in routine_rows:
        d = str(row.date)
        counts[d] = counts.get(d, 0) + row.count

    result = []
    for i in range(365):
        d = since + timedelta(days=i)
        count = counts.get(str(d), 0)
        level = 0 if count == 0 else (1 if count <= 2 else (2 if count <= 4 else (3 if count <= 6 else 4)))
        result.append({"date": str(d), "count": count, "level": level})

    return result


def get_trend_data(user_id: str, db: Session) -> list:
    """Return weekly trend data for the last 12 weeks."""
    today = date.today()
    results = []
    for week in range(11, -1, -1):
        week_end = today - timedelta(weeks=week)
        week_start = week_end - timedelta(days=6)

        habits_completed = (
            db.query(func.count(HabitLog.id))
            .filter(
                HabitLog.user_id == user_id,
                HabitLog.date >= week_start,
                HabitLog.date <= week_end,
            )
            .scalar() or 0
        )

        tasks_completed = (
            db.query(Task)
            .filter(
                Task.user_id == user_id,
                Task.completed_at >= datetime.combine(week_start, datetime.min.time()),
                Task.completed_at <= datetime.combine(week_end, datetime.max.time()),
            )
            .count()
        )

        routines_completed = (
            db.query(func.count(RoutineLog.id))
            .filter(
                RoutineLog.user_id == user_id,
                RoutineLog.date >= week_start,
                RoutineLog.date <= week_end,
            )
            .scalar() or 0
        )

        results.append({
            "week_start": str(week_start),
            "habits_completed": habits_completed,
            "tasks_completed": tasks_completed,
            "routines_completed": routines_completed,
            "total_activities": habits_completed + tasks_completed + routines_completed,
        })

    return results
