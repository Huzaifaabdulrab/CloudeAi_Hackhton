# Quickstart Guide: Python CLI Todo App

This guide will help you get the Todo application up and running.

## Prerequisites

- Python 3.11 or higher
- `pip` for installing dependencies

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: `requirements.txt` will be created during implementation).*

## How to Run

The application supports two modes of interaction.

### Interactive Mode

To start the application in interactive mode, simply run:

```bash
python src/main.py
```

You will be presented with a menu of options to manage your tasks.

### Direct Command Mode

You can also execute commands directly from your terminal.

- **Add a task**:
  ```bash
  python src/main.py add "Your new task title" --description "An optional description."
  ```

- **List all tasks**:
  ```bash
  python src/main.py list
  ```

- **Mark a task as complete**:
  ```bash
  python src/main.py complete <task_id>
  ```

- **Update a task**:
  ```bash
  python src/main.py update <task_id> --title "New title" --description "New description"
  ```

- **Delete a task**:
  ```bash
  python src/main.py delete <task_id>
  ```
