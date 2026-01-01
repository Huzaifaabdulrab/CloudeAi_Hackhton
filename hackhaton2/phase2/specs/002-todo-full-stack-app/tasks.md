---

description: "Task list for Todo Full-Stack Application"
---

# Tasks: Todo Full-Stack Web Application

**Input**: Design documents from `/specs/002-todo-full-stack-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create monorepo structure with `backend/` and `frontend/` directories
- [ ] T002 Initialize Python project for backend in `backend/` with Poetry
- [ ] T003 Initialize Node.js project for frontend in `frontend/` with Next.js
- [ ] T004 Configure Git ignore rules for both `backend/` and `frontend/`
- [ ] T005 [P] Configure linting and formatting tools for backend (Black, isort, Flake8) in `backend/pyproject.toml`
- [ ] T006 [P] Configure linting and formatting tools for frontend (ESLint, Prettier) in `frontend/` configs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Set up FastAPI application structure in `backend/main.py`
- [ ] T008 Configure database connection with SQLModel and Neon PostgreSQL in `backend/src/database.py`
- [ ] T009 Create base `User` model using SQLModel in `backend/src/models/user.py`
- [ ] T010 Implement database migration setup (e.g., Alembic) for `backend/`
- [ ] T011 Configure JWT handling and shared secret for Better Auth in `backend/main.py`
- [ ] T012 Set up basic error handling middleware in `backend/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (P1) 🎯 MVP

**Goal**: Enable users to sign up and log in securely.

**Independent Test**: Create a new user account, log out, and log back in.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement user registration endpoint (`/auth/signup`) in `backend/src/api/auth.py`
- [ ] T014 [P] [US1] Implement user login endpoint (`/auth/login`) in `backend/src/api/auth.py`
- [ ] T015 [US1] Integrate `User` model with authentication endpoints in `backend/src/api/auth.py`
- [ ] T016 [US1] Create signup page and form in `frontend/app/signup/page.tsx`
- [ ] T017 [US1] Create login page and form in `frontend/app/login/page.tsx`
- [ ] T018 [US1] Implement authentication context/service in `frontend/src/services/auth.ts`
- [ ] T019 [US1] Handle JWT token storage and retrieval in `frontend/src/services/auth.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task Creation (P1)

**Goal**: Authenticated users can add new tasks to their list.

**Independent Test**: Authenticated user creates a new task and verifies its appearance in their list.

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create `Task` model using SQLModel in `backend/src/models/task.py`
- [ ] T021 [US2] Implement task creation endpoint (`POST /tasks`) in `backend/src/api/tasks.py`
- [ ] T022 [US2] Ensure task creation enforces user ownership in `backend/src/api/tasks.py`
- [ ] T023 [US2] Create task input form in `frontend/src/components/TaskInput.tsx`
- [ ] T024 [US2] Implement API client for task creation in `frontend/src/services/task.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Tasks (P2)

**Goal**: Authenticated users can view all their tasks.

**Independent Test**: Log in and view the task list.

### Implementation for User Story 3

- [ ] T025 [P] [US3] Implement task retrieval endpoint (`GET /tasks`) in `backend/src/api/tasks.py`
- [ ] T026 [US3] Ensure task retrieval enforces user ownership in `backend/src/api/tasks.py`
- [ ] T027 [US3] Create tasks list display component in `frontend/src/components/TaskList.tsx`
- [ ] T028 [US3] Implement API client for task retrieval in `frontend/src/services/task.ts`
- [ ] T029 [US3] Integrate task list display into `frontend/app/tasks/page.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update Task (P2)

**Goal**: Authenticated users can edit task descriptions.

**Independent Test**: Authenticated user edits a task and verifies the change.

### Implementation for User Story 4

- [ ] T030 [P] [US4] Implement task update endpoint (`PUT /tasks/{taskId}`) in `backend/src/api/tasks.py`
- [ ] T031 [US4] Ensure task update enforces user ownership in `backend/src/api/tasks.py`
- [ ] T032 [US4] Create task edit functionality in `frontend/src/components/TaskItem.tsx` (within `TaskList`)
- [ ] T033 [US4] Implement API client for task update in `frontend/src/services/task.ts`

---

## Phase 7: User Story 5 - Mark Task Complete (P2)

**Goal**: Authenticated users can mark tasks as complete.

**Independent Test**: Authenticated user marks a task as complete and verifies its status.

### Implementation for User Story 5

- [ ] T034 [P] [US5] Extend task update endpoint (`PUT /tasks/{taskId}`) to handle `completed_status` in `backend/src/api/tasks.py`
- [ ] T035 [US5] Implement UI toggle/checkbox for task completion in `frontend/src/components/TaskItem.tsx`
- [ ] T036 [US5] Update API client for task completion in `frontend/src/services/task.ts`

---

## Phase 8: User Story 6 - Delete Task (P3)

**Goal**: Authenticated users can delete tasks they no longer need.

**Independent Test**: Authenticated user deletes a task and verifies its removal.

### Implementation for User Story 6

- [ ] T037 [P] [US6] Implement task deletion endpoint (`DELETE /tasks/{taskId}`) in `backend/src/api/tasks.py`
- [ ] T038 [US6] Ensure task deletion enforces user ownership in `backend/src/api/tasks.py`
- [ ] T039 [US6] Implement UI delete button/action in `frontend/src/components/TaskItem.tsx`
- [ ] T040 [US6] Implement API client for task deletion in `frontend/src/services/task.ts`

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T041 Implement global error handling and display in `frontend/app/layout.tsx`
- [ ] T042 Implement loading states and indicators in `frontend/` components
- [ ] T043 Add logging for backend operations (e.g., using `structlog` or standard `logging`) in `backend/`
- [ ] T044 Implement responsive design for all frontend pages/components in `frontend/`
- [ ] T045 Final review of security rules (JWT verification, user ownership) across `backend/`
- [ ] T046 Run `quickstart.md` validation and create integration tests in `tests/integration/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4/US5 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for /auth/signup"
Task: "Contract test for /auth/login"

# Launch all models for User Story 1 together:
Task: "Implement user registration endpoint (/auth/signup) in backend/src/api/auth.py"
Task: "Implement user login endpoint (/auth/login) in backend/src/api/auth.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
