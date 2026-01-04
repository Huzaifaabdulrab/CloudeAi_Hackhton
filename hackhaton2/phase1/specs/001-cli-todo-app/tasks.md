---
description: "Task list for feature implementation"
---

# Tasks: CLI Todo App

**Input**: Design documents from `/specs/001-cli-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create the directory structure: `src/`, `tests/`.
- [X] T002 [P] Create empty Python files: `src/main.py`, `src/models.py`, `src/database.py`, `src/cli.py`, `tests/test_database.py`, `tests/test_cli.py`.
- [X] T003 [P] Create an empty `tasks.json` file in the root directory.
- [X] T004 Create `requirements.txt` with initial dependencies: `rich`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Define the `Task` data model in `src/models.py` including fields for id, title, description, completed, and timestamp, based on `data-model.md`.
- [X] T006 In `src/database.py`, implement the `load_tasks` function to read and parse tasks from `tasks.json`. Handle cases where the file doesn't exist or is empty.
- [X] T007 In `src/database.py`, implement the `save_tasks` function to write the current list of tasks back to `tasks.json`.
- [X] T008 In `src/main.py`, set up the main application entry point that calls `load_tasks` on startup.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Stories 1 & 2 - Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Allows users to add new tasks and see the full list of tasks. This provides the minimum viable functionality.

**Independent Test**: A user can run the app, add a task via a command, and then run the app again with another command to see the newly added task in the list.

### Implementation for User Stories 1 & 2

- [X] T009 [US1] In `src/database.py`, implement the `add_task` function that takes a task dictionary, adds it to the list, and calls `save_tasks`.
- [X] T010 [US2] In `src/database.py`, implement the `get_all_tasks` function that returns the list of all tasks.
- [X] T011 [P] [US1, US2] In `src/cli.py`, implement the basic CLI structure using `argparse` to handle sub-commands for 'add' and 'list'.
- [X] T012 [P] [US1] In `src/cli.py`, implement the logic for the 'add' command to parse arguments and call `database.add_task`.
- [X] T013 [P] [US2] In `src/cli.py`, implement the logic for the 'list' command to call `database.get_all_tasks` and display the results using `rich`.
- [X] T014 [US1, US2] In `src/main.py`, integrate the CLI command parsing and execution.

**Checkpoint**: At this point, User Stories 1 and 2 should be functional. Users can add and list tasks.

---

## Phase 4: User Story 3 & 4 - Complete and Update Tasks (Priority: P2)

**Goal**: Allows users to modify existing tasks by marking them as complete or editing their content.

**Independent Test**: A user can list tasks, use the 'complete' command on a task ID, list tasks again, and see the status updated. A user can also use the 'update' command to change a task's title/description and see it reflected in the list.

### Implementation for User Stories 3 & 4

- [X] T015 [US3] In `src/database.py`, implement the `update_task_status` function which finds a task by ID and sets its `completed` status.
- [X] T016 [US4] In `src/database.py`, implement the `update_task` function which finds a task by ID and updates its title and/or description.
- [X] T017 [US3] In `src/database.py`, add "Task not found" error handling to `update_task_status`.
- [X] T018 [US4] In `src/database.py`, add "Task not found" error handling to `update_task`.
- [X] T019 [P] [US3] In `src/cli.py`, add the 'complete' sub-command to parse a task ID and call `update_task_status`.
- [X] T020 [P] [US4] In `src/cli.py`, add the 'update' sub-command to parse a task ID and new content, then call `update_task`.

**Checkpoint**: At this point, User Stories 1, 2, 3, and 4 should be functional.

---

## Phase 5: User Story 5 - Delete a Task (Priority: P3)

**Goal**: Allows users to remove tasks that are no longer needed.

**Independent Test**: A user can list tasks, use the 'delete' command on a task ID, list tasks again, and see the task has been removed.

### Implementation for User Story 5

- [X] T021 [US5] In `src/database.py`, implement the `delete_task` function which removes a task by its ID.
- [X] T022 [US5] In `src/database.py`, add "Task not found" error handling to `delete_task`.
- [X] T023 [P] [US5] In `src/cli.py`, add the 'delete' sub-command to parse a task ID and call `delete_task`.

**Checkpoint**: All core user stories should now be implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T024 Implement robust input validation in `src/cli.py` for all commands (e.g., ensure ID is an integer).
- [X] T025 Implement handling for a corrupted `tasks.json` file in `src/database.py`.
- [X] T026 Add an interactive menu mode in `src/cli.py` as an alternative to command-line arguments.
- [X] T027 Refine the output formatting using `rich` for better readability.
- [X] T028 Run a final integration check of all commands working together.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories should proceed sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 & US2 (P1)**: Can start after Foundational (Phase 2).
- **US3 & US4 (P2)**: Depend on Foundational phase. Can be tested on their own but are more useful after US1/US2.
- **US5 (P3)**: Depends on Foundational phase.

### Within Each Phase

- Models before database logic.
- Database logic before CLI implementation.
- Core implementation before integration.

### Parallel Opportunities

- Most Setup tasks (T001-T003) can run in parallel.
- Once Foundational is complete, CLI work and Database work for a given user story can sometimes be done in parallel, but the CLI depends on the database function signatures.
- Different user stories can be worked on in parallel by different developers if the team size allows, but for a solo developer, a sequential approach is recommended.

---

## Implementation Strategy

### MVP First (Phase 3)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Stories 1 & 2.
4. **STOP and VALIDATE**: Test adding and listing tasks. The app is now a useful, albeit simple, tool.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add Phase 3 (US1/US2) → Test independently → MVP is ready.
3. Add Phase 4 (US3/US4) → Test independently → Users can now modify tasks.
4. Add Phase 5 (US5) → Test independently → Users can now delete tasks.
5. Complete Phase 6 → Final polished application.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story should be independently completable and testable.
- Commit after each task or logical group.
- Stop at any checkpoint to validate story independently.