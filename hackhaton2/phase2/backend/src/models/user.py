from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List # Import List

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str

    tasks: List["Task"] = Relationship(back_populates="owner")

from .task import Task
User.update_forward_refs()
