
# main.py
import sys
from src.database import load_tasks
from src.cli import create_parser, handle_command, interactive_mode

def main():
    """
    Main entry point for the CLI application.
    """
    load_tasks()
    
    if len(sys.argv) > 1:
        parser = create_parser()
        handle_command(parser)
    else:
        interactive_mode()

if __name__ == "__main__":
    main()
