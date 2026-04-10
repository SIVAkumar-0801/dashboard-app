from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import StatementError
from datetime import datetime, date
from typing import List, Optional

from ..database import get_db
from ..models.routine import Routine, RoutineLog
from ..schemas.routine import RoutineCreate, RoutineUpdate, RoutineResponse, RoutineLogResponse
from ..services.routine_service import calculate_completion_rate

router = APIRouter(prefix="/routines", tags=["routines"])


def enrich_routine(routine: Routine, db: Session) -> dict:
    data = {c.name: getattr(routine, c.name) for c in routine.__table__.columns}
    data["completion_rate"] = calculate_completion_rate(routine.id, db)
    return data


@router.get("/", response_model=List[RoutineResponse])
def list_routines(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    routines = db.query(Routine).filter(Routine.user_id == user_id).all()
    return [enrich_routine(r, db) for r in routines]


@router.post("/", response_model=RoutineResponse, status_code=201)
def create_routine(routine_in: RoutineCreate, db: Session = Depends(get_db)):
    routine = Routine(**routine_in.model_dump())
    db.add(routine)
    db.commit()
    db.refresh(routine)
    return enrich_routine(routine, db)


@router.get("/{routine_id}", response_model=RoutineResponse)
def get_routine(routine_id: str, db: Session = Depends(get_db)):
    try:
        routine = db.query(Routine).filter(Routine.id == routine_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Routine not found")
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return enrich_routine(routine, db)


@router.put("/{routine_id}", response_model=RoutineResponse)
def update_routine(routine_id: str, routine_in: RoutineUpdate, db: Session = Depends(get_db)):
    try:
        routine = db.query(Routine).filter(Routine.id == routine_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Routine not found")
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    for field, value in routine_in.model_dump(exclude_unset=True).items():
        setattr(routine, field, value)
    routine.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(routine)
    return enrich_routine(routine, db)


@router.delete("/{routine_id}", status_code=204)
def delete_routine(routine_id: str, db: Session = Depends(get_db)):
    try:
        routine = db.query(Routine).filter(Routine.id == routine_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Routine not found")
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    db.delete(routine)
    db.commit()


@router.post("/{routine_id}/check-in", response_model=RoutineLogResponse, status_code=201)
def check_in_routine(
    routine_id: str,
    notes: Optional[str] = None,
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    routine = db.query(Routine).filter(Routine.id == routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")

    today = date.today()
    existing = (
        db.query(RoutineLog)
        .filter(
            RoutineLog.routine_id == routine_id,
            RoutineLog.user_id == user_id,
            RoutineLog.date == today,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")

    log = RoutineLog(
        routine_id=routine_id,
        user_id=user_id,
        notes=notes,
        date=today,
        completed_at=datetime.utcnow(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log
