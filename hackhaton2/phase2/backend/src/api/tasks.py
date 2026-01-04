from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_session
from ..models.task import Task
from ..models.user import User
from ..security import get_current_user
from sqlmodel import select
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/tasks", response_model=Task)
async def create_task(task: Task, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    logger.info(f"User {current_user.id} creating a new task.")
    task.owner_id = current_user.id
    session.add(task)
    session.commit()
    session.refresh(task)
    logger.info(f"Task {task.id} created successfully for user {current_user.id}.")
    return task

@router.get("/tasks", response_model=List[Task])
async def read_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    logger.info(f"User {current_user.id} reading their tasks.")
    tasks = session.exec(select(Task).where(Task.owner_id == current_user.id)).all()
    return tasks

@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    task: Task, # This should ideally be a partial update model
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    logger.info(f"User {current_user.id} updating task {task_id}.")
    db_task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    
    db_task.description = task.description
    db_task.completed_status = task.completed_status
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    logger.info(f"Task {task_id} updated successfully by user {current_user.id}.")
    return db_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    logger.info(f"User {current_user.id} deleting task {task_id}.")
    db_task = session.exec(select(Task).where(Task.id == task_id)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    
    session.delete(db_task)
    session.commit()
    logger.info(f"Task {task_id} deleted successfully by user {current_user.id}.")
    return
