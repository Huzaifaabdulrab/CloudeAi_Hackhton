
# databse.py
import json
from typing import List, Dict, Any, Optional
from src.models import Task
from dataclasses import asdict
from rich.console import Console

TASKS_FILE = "tasks.json"

_tasks: List[Task] = []
console = Console()

def load_tasks() -> None:
    """
    Loads tasks from the JSON file into the in-memory list.
    Handles file not found and corrupted JSON file cases.
    """
    global _tasks
    try:
        with open(TASKS_FILE, "r") as f:
            tasks_data = json.load(f)
            if not tasks_data:
                _tasks = []
            else:
                # This could fail if the data is not in the expected format
                try:
                    _tasks = [Task(**task) for task in tasks_data]
                except TypeError:
                    console.print("[bold red]Error: The tasks.json file has corrupted data.[/bold red]")
                    console.print("Starting with an empty task list.")
                    _tasks = []
    except FileNotFoundError:
        _tasks = []
    except json.JSONDecodeError:
        console.print("[bold red]Error: The tasks.json file is corrupted.[/bold red]")
        console.print("Starting with an empty task list.")

        _tasks = []

def save_tasks() -> None:
    """
    Saves the in-memory list of tasks to the JSON file.
    """
    with open(TASKS_FILE, "w") as f:
        tasks_data = [asdict(task) for task in _tasks]
        json.dump(tasks_data, f, indent=4)

def get_all_tasks() -> List[Task]:
    """
    Returns the list of all tasks.
    """
    return _tasks

def add_task(title: str, description: str = "") -> Task:
    """
    Adds a new task to the list and saves it.
    """
    global _tasks
    # Determine the next ID
    new_id = _tasks[-1].id + 1 if _tasks else 1
    
    new_task = Task(id=new_id, title=title, description=description)
    _tasks.append(new_task)
    save_tasks()
    return new_task

def update_task_status(task_id: int, completed: bool) -> Task:
    """
    Updates the completion status of a task and saves it.
    Raises ValueError if the task is not found.
    """
    global _tasks
    task_to_update = None
    for task in _tasks:
        if task.id == task_id:
            task_to_update = task
            break
    
    if task_to_update:
        task_to_update.completed = completed
        save_tasks()
        return task_to_update
    else:
        raise ValueError("Task not found.")

def update_task(task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Task:
    """
    Updates the title and/or description of a task and saves it.
    Raises ValueError if the task is not found.
    """
    global _tasks
    task_to_update = None
    for task in _tasks:
        if task.id == task_id:
            task_to_update = task
            break

    if task_to_update:
        if title is not None:
            task_to_update.title = title
        if description is not None:
            task_to_update.description = description
        save_tasks()
        return task_to_update
    else:
        raise ValueError("Task not found.")

def delete_task(task_id: int) -> None:
    """
    Deletes a task by its ID.
    Raises ValueError if the task is not found.
    """
    global _tasks
    task_to_delete = None
    for task in _tasks:
        if task.id == task_id:
            task_to_delete = task
            break
    
    if task_to_delete:
        _tasks.remove(task_to_delete)
        save_tasks()
    else:
        raise ValueError("Task not found.")
