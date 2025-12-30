
# model.py
import datetime
from dataclasses import dataclass, field

@dataclass
class Task:
    """Represents a single to-do item."""
    id: int
    title: str
    description: str = ""
    completed: bool = False
    timestamp: str = field(default_factory=lambda: datetime.datetime.now().isoformat())