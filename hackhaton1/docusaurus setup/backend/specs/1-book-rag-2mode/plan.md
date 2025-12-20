# Implementation Plan: 2-Mode RAG Book Search

**Branch**: `1-book-rag-2mode` | **Date**: 2025-01-08 | **Spec**: [link](spec.md)
**Input**: Feature specification from `/specs/1-book-rag-2mode/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a 2-mode RAG system for book content with Global search (entire book) and Selected text only search capabilities. The system will connect to Qdrant for vector storage, Neon Postgres for metadata, and Cohere for LLM processing.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, Cohere SDK, Qdrant-client, psycopg2-binary, python-dotenv
**Storage**: Qdrant vector database and Neon Postgres
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: Web application backend
**Performance Goals**: <5 second response time for queries
**Constraints**: Cohere API only (no OpenAI), credential security, 500-char chunks with 50-char overlap
**Scale/Scope**: Single book content, concurrent user support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

All principles from the project constitution have been reviewed and the implementation plan aligns with:
- Content-Based Response Integrity
- Clear Explanations for Developers
- Cohere API Exclusivity
- Secure and Isolated Operations
- High Performance and Responsiveness
- Mode-Based Operation

## Project Structure

### Documentation (this feature)

```text
specs/1-book-rag-2mode/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
rag-chatbot/
├── main.py
├── rag.py
├── ingest.py
├── models.py
├── .env
├── requirements.txt
└── README.md
```

**Structure Decision**: Backend-only web application structure with models, services, API endpoints, and utilities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|