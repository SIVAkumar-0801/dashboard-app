from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import StatementError
from datetime import datetime, date
from typing import List, Optional

from ..database import get_db
from ..models.habit import Habit, HabitLog
from ..schemas.habit import HabitCreate, HabitUpdate, HabitResponse, HabitLogCreate, HabitLogResponse
from ..services.habit_service import calculate_streak, calculate_completion_rate, get_habit_stats

router = APIRouter(prefix="/habits", tags=["habits"])


def enrich_habit(habit: Habit, db: Session) -> dict:
    data = {c.name: getattr(habit, c.name) for c in habit.__table__.columns}
    stats = calculate_streak(habit.id, db)
    data["current_streak"] = stats["current_streak"]
    data["longest_streak"] = stats["longest_streak"]
    data["completion_rate"] = calculate_completion_rate(habit.id, db)
    data["habit_logs"] = habit.habit_logs
    return data


@router.get("/", response_model=List[HabitResponse])
def list_habits(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    return [enrich_habit(h, db) for h in habits]


@router.post("/", response_model=HabitResponse, status_code=201)
def create_habit(habit_in: HabitCreate, db: Session = Depends(get_db)):
    habit = Habit(**habit_in.model_dump())
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, db)


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(habit_id: str, db: Session = Depends(get_db)):
    try:
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Habit not found")
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return enrich_habit(habit, db)


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(habit_id: str, habit_in: HabitUpdate, db: Session = Depends(get_db)):
    try:
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Habit not found")
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    for field, value in habit_in.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)
    habit.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(habit)
    return enrich_habit(habit, db)


@router.delete("/{habit_id}", status_code=204)
def delete_habit(habit_id: str, db: Session = Depends(get_db)):
    try:
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Habit not found")
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()


@router.post("/{habit_id}/check-in", response_model=HabitLogResponse, status_code=201)
def check_in_habit(
    habit_id: str,
    notes: Optional[str] = None,
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today = date.today()
    existing = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.user_id == user_id, HabitLog.date == today)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")

    log = HabitLog(
        habit_id=habit_id,
        user_id=user_id,
        notes=notes,
        date=today,
        completed_at=datetime.utcnow(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/{habit_id}/stats")
def habit_stats(habit_id: str, db: Session = Depends(get_db)):
    try:
        habit = db.query(Habit).filter(Habit.id == habit_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Habit not found")
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return get_habit_stats(habit_id, db)
