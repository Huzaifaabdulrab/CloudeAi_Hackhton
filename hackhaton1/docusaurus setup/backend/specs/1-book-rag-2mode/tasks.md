---

description: "Task list template for feature implementation"
---

# Tasks: 2-Mode RAG Book Search

**Input**: Design documents from `/specs/1-book-rag-2mode/`
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

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create rag-chatbot directory and initialize project structure
- [ ] T002 Create requirements.txt with FastAPI==0.115.0, uvicorn[standard]==0.30.6, cohere==5.9.2, qdrant-client==1.11.0, psycopg2-binary==2.9.9, pydantic==2.9.2, python-dotenv==1.0.1, python-multipart==0.0.9, slowapi==0.1.9
- [ ] T003 [P] Install dependencies using pip install -r requirements.txt
- [ ] T004 Create .env file with provided credentials for NEON_DATABASE_URL, QDRANT_API_KEY, QDRANT_CLUSTER_URL, QDRANT_CLUSTER_ID, and COHERE_API_KEY

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T005 Set up Qdrant client connection in rag.py using cluster URL and API key from .env
- [ ] T006 [P] Set up Neon Postgres connection in rag.py using connection string from .env
- [ ] T007 [P] Set up Cohere client connection in rag.py using API key from .env
- [ ] T008 Create models.py with Pydantic models: ChatRequest, ChatResponse, HealthResponse
- [ ] T009 Create utility functions in rag.py: embed_query, build_prompt, build_prompt_selected_text
- [ ] T010 Set up logging and error handling infrastructure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Global Book Search (Priority: P1) 🎯 MVP

**Goal**: Enable book readers to ask questions about book content and receive answers grounded in the full book with source references

**Independent Test**: The system can accept a question via the /chat/global endpoint and return an answer with source citations, even when the relevant content is spread across different parts of the book

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Contract test for /chat/global endpoint in tests/contract/test_global_chat.py
- [ ] T012 [P] [US1] Integration test for global book search flow in tests/integration/test_global_search.py

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create global_search function in rag.py to search Qdrant collection "book_chunks"
- [ ] T014 [P] [US1] Create cohere_chat function in rag.py for LLM responses
- [ ] T015 [US1] Implement /chat/global endpoint in main.py (depends on T008, T013, T014)
- [ ] T016 [US1] Add validation for incoming requests to /chat/global
- [ ] T017 [US1] Add source citation functionality to return references with answers
- [ ] T018 [US1] Add "I don't know" response when no relevant context found

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Selected Text Search (Priority: P2)

**Goal**: Enable book readers to ask questions about specific text they have selected and receive answers only from that provided text

**Independent Test**: The system can accept user-provided text and a question via the /chat/selected endpoint and return an answer based only on that text

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T019 [P] [US2] Contract test for /chat/selected endpoint in tests/contract/test_selected_chat.py
- [ ] T020 [P] [US2] Integration test for selected text search flow in tests/integration/test_selected_search.py

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement /chat/selected endpoint in main.py (depends on T008)
- [ ] T022 [US2] Add validation for selected text in /chat/selected endpoint
- [ ] T023 [US2] Add function to process selected text only search (no book context)
- [ ] T024 [US2] Add "I don't know" response when question cannot be answered from provided text
- [ ] T025 [US2] Connect selected text functionality with Cohere response generation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Service Integration (Priority: P3)

**Goal**: Ensure that the three services (Qdrant vector database, Neon Postgres, and Cohere API) connect successfully with the provided credentials to enable the RAG functionality

**Independent Test**: All three services connect successfully using the provided credentials and the system can perform basic operations with each

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T026 [P] [US3] Contract test for /health endpoint in tests/contract/test_health.py
- [ ] T027 [P] [US3] Integration test for service connectivity in tests/integration/test_service_connectivity.py

### Implementation for User Story 3

- [ ] T028 [P] [US3] Implement health check endpoint in main.py (depends on T005, T006, T007)
- [ ] T029 [US3] Create ingest.py for book content ingestion
- [ ] T030 [US3] Implement chunk_text function in ingest.py (500 chars with 50 char overlap)
- [ ] T031 [US3] Implement create_embedding function in ingest.py using Cohere
- [ ] T032 [US3] Implement ingest_book function in ingest.py to upload to Qdrant and Neon Postgres
- [ ] T033 [US3] Create /ingest endpoint in main.py for manual trigger

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T034 [P] Documentation updates in README.md
- [ ] T035 Code cleanup and refactoring
- [ ] T036 Performance optimization across all stories
- [ ] T037 [P] Additional unit tests (if requested) in tests/unit/
- [ ] T038 Security hardening
- [ ] T039 Run quickstart.md validation

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

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
Task: "Contract test for /chat/global endpoint in tests/contract/test_global_chat.py"
Task: "Integration test for global book search flow in tests/integration/test_global_search.py"

# Launch all models for User Story 1 together:
Task: "Create global_search function in rag.py to search Qdrant collection "book_chunks""
Task: "Create cohere_chat function in rag.py for LLM responses"
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