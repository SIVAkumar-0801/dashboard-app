from datetime import date, timedelta
from sqlalchemy.orm import Session
from ..models.routine import Routine, RoutineLog


def calculate_completion_rate(routine_id: str, db: Session, days: int = 30) -> float:
    """Calculate routine completion rate over the last N days."""
    routine = db.query(Routine).filter(Routine.id == routine_id).first()
    if not routine:
        return 0.0

    since = date.today() - timedelta(days=days)
    scheduled_days = len(routine.days_of_week.split(",")) if routine.days_of_week else 0
    if scheduled_days == 0:
        return 0.0

    # Number of scheduled occurrences in the period
    expected_count = int((scheduled_days / 7) * days)
    if expected_count == 0:
        return 0.0

    actual_count = (
        db.query(RoutineLog)
        .filter(RoutineLog.routine_id == routine_id, RoutineLog.date >= since)
        .count()
    )

    return round(min((actual_count / expected_count) * 100, 100.0), 2)
