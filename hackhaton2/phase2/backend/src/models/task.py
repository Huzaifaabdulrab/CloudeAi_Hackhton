from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    completed_status: bool = Field(default=False)
    owner_id: int = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="tasks")

from .user import User
Task.model_rebuild()

# Add back_populates to User model for relationship
# This part is for the User model, but needs to be in user.py
# class User(SQLModel, table=True):
#     ...
#     tasks: List["Task"] = Relationship(back_populates="owner")
