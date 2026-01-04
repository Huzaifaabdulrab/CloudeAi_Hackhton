# src/cli.py
import argparse
from src.database import add_task, get_all_tasks, update_task_status, update_task, delete_task
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt

def create_parser() -> argparse.ArgumentParser:
    """Creates the argument parser for the CLI."""
    parser = argparse.ArgumentParser(description="A simple CLI Todo application.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a new task")
    add_parser.add_argument("title", type=str, help="The title of the task")
    add_parser.add_argument("-d", "--description", type=str, default="", help="The description of the task")

    # List command
    list_parser = subparsers.add_parser("list", help="List all tasks")

    # Complete command
    complete_parser = subparsers.add_parser("complete", help="Mark a task as complete")
    complete_parser.add_argument("id", type=int, help="The ID of the task to mark as complete")

    # Update command
    update_parser = subparsers.add_parser("update", help="Update a task")
    update_parser.add_argument("id", type=int, help="The ID of the task to update")
    update_parser.add_argument("-t", "--title", type=str, help="The new title of the task")
    update_parser.add_argument("-d", "--description", type=str, help="The new description of the task")

    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a task")
    delete_parser.add_argument("id", type=int, help="The ID of the task to delete")

    return parser

def handle_add_task(console: Console, args: argparse.Namespace):
    new_task = add_task(title=args.title, description=args.description)
    console.print(f"Added task: '[bold green]{new_task.title}[/bold green]' with ID {new_task.id}")

def handle_list_tasks(console: Console):
    tasks = get_all_tasks()
    if not tasks:
        console.print("No tasks found.")
        return

    table = Table(title="TODO List")
    table.add_column("ID", justify="right", style="cyan", no_wrap=True)
    table.add_column("Title", style="magenta")
    table.add_column("Description", style="white")
    table.add_column("Completed", justify="center")
    table.add_column("Timestamp", style="green")

    for task in tasks:
        completed_str = "✅" if task.completed else "❌"
        table.add_row(
            str(task.id),
            task.title,
            task.description,
            completed_str,
            task.timestamp
        )
    
    console.print(table)

def handle_complete_task(console: Console, args: argparse.Namespace):
    try:
        updated_task = update_task_status(task_id=args.id, completed=True)
        console.print(f"Task '{updated_task.title}' marked as complete.")
    except (ValueError, TypeError) as e:
        console.print(f"[bold red]Error: {e}[/bold red]")

def handle_update_task(console: Console, args: argparse.Namespace):
    try:
        if args.title is None and args.description is None:
            console.print("[bold red]Error: You must provide a new title and/or description to update a task.[/bold red]")
            return 

        updated_task = update_task(task_id=args.id, title=args.title, description=args.description)
        console.print(f"Task {updated_task.id} updated.")
    except (ValueError, TypeError) as e:
        console.print(f"[bold red]Error: {e}[/bold red]")

def handle_delete_task(console: Console, args: argparse.Namespace):
    try:
        delete_task(task_id=args.id)
        console.print(f"Task {args.id} deleted.")
    except (ValueError, TypeError) as e:
        console.print(f"[bold red]Error: {e}[/bold red]")


def handle_command(parser: argparse.ArgumentParser):
    """Handles the command line arguments."""
    args = parser.parse_args()
    console = Console()

    if args.command == "add":
        handle_add_task(console, args)
    elif args.command == "list":
        handle_list_tasks(console)
    elif args.command == "complete":
        handle_complete_task(console, args)
    elif args.command == "update":
        handle_update_task(console, args)
    elif args.command == "delete":
        handle_delete_task(console, args)
    else:
        parser.print_help()

def interactive_mode():
    """Starts the interactive menu mode."""
    console = Console()
    console.print("[bold cyan]Welcome to the Interactive TODO List Manager![/bold cyan]")

    while True:
        console.print("\n[bold]Menu:[/bold]")
        console.print("1. Add a new task")
        console.print("2. List all tasks")
        console.print("3. Mark a task as complete")
        console.print("4. Update a task")
        console.print("5. Delete a task")
        console.print("6. Exit")

        choice = Prompt.ask("Choose an option", choices=["1", "2", "3", "4", "5", "6"], default="2")

        if choice == "1":
            title = Prompt.ask("Enter the task title")
            description = Prompt.ask("Enter the task description (optional)", default="")
            args = argparse.Namespace(title=title, description=description)
            handle_add_task(console, args)
        elif choice == "2":
            handle_list_tasks(console)
        elif choice == "3":
            task_id = int(Prompt.ask("Enter the ID of the task to mark as complete"))
            args = argparse.Namespace(id=task_id)
            handle_complete_task(console, args)
        elif choice == "4":
            task_id = int(Prompt.ask("Enter the ID of the task to update"))
            title = Prompt.ask("Enter the new title (leave blank to keep current)")
            description = Prompt.ask("Enter the new description (leave blank to keep current)")
            args = argparse.Namespace(id=task_id, title=title or None, description=description or None)
            handle_update_task(console, args)
        elif choice == "5":
            task_id = int(Prompt.ask("Enter the ID of the task to delete"))
            args = argparse.Namespace(id=task_id)
            handle_delete_task(console, args)
        elif choice == "6":
            console.print("[bold cyan]Goodbye![/bold cyan]")
            break
