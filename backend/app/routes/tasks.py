from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import StatementError
from datetime import datetime, timezone
from typing import List, Optional

from ..database import get_db
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatusUpdate
from ..services.task_service import get_task_stats

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/stats/summary")
def task_stats(
    user_id: str = Query(default="default_user"),
    db: Session = Depends(get_db),
):
    return get_task_stats(user_id, db)


@router.get("/", response_model=List[TaskResponse])
def list_tasks(
    user_id: str = Query(default="default_user"),
    status: Optional[str] = Query(default=None),
    priority: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Task).filter(Task.user_id == user_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if category:
        query = query.filter(Task.category == category)
    return query.all()


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**task_in.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Task not found")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, task_in: TaskUpdate, db: Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Task not found")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    updates = task_in.model_dump(exclude_unset=True)
    if "status" in updates and updates["status"] == "completed" and task.status != "completed":
        updates["completed_at"] = datetime.now(timezone.utc)
    for field, value in updates.items():
        setattr(task, field, value)
    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Task not found")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()


@router.put("/{task_id}/status", response_model=TaskResponse)
def update_task_status(task_id: str, status_in: TaskStatusUpdate, db: Session = Depends(get_db)):
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
    except StatementError:
        raise HTTPException(status_code=404, detail="Task not found")
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if status_in.status == "completed" and task.status != "completed":
        task.completed_at = datetime.now(timezone.utc)
    task.status = status_in.status
    task.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(task)
    return task
