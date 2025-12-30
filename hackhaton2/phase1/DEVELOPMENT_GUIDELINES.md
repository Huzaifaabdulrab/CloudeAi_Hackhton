# Python CLI Todo Application Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-28

## Active Technologies

- **Language**: Python 3.11+
- **CLI Frameworks**: `argparse`, `rich`
- **Testing**: `pytest`
- **Data Storage**: JSON

## Project Structure

```text
src/
├── models.py       # Defines the Task data structure.
├── database.py     # Handles all interactions with the JSON data file.
├── cli.py          # Implements the command-line interface (argparse and rich).
└── main.py         # Application entry point, orchestrates the components.
tests/
├── test_database.py # Unit tests for the database module.
└── test_cli.py      # Integration tests for the CLI commands.
tasks.json               # Default JSON file for storing tasks.
requirements.txt         # Project dependencies.
```

## Commands

- **Run tests**: `pytest`
- **Run application**: `python src/main.py`

## Code Style

- Follow PEP 8 for Python code.
- Use type hints for all function signatures.

## Recent Changes

- **001-cli-todo-app**: Initial setup of the CLI Todo application.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
