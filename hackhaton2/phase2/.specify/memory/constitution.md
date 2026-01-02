<!--
Sync Impact Report:
- Version change: none -> 1.0.0
- Added principles: Spec-Driven Development, Phased Implementation, Explicit Requirements, Clarity, Correctness, Security
- Added sections: Architecture Constraints, Security Rules, Development Workflow
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
- Follow-up TODOs: None
-->
# Phase II Hackathon Todo Application Constitution

## Core Principles

### I. Spec-Driven Development
You MUST use spec-driven development only.

### II. Phased Implementation
You MUST NOT write implementation code until the IMPLEMENT phase. You MUST NOT skip or merge phases.

### III. Explicit Requirements
You MUST NOT assume requirements outside provided specs. You MUST resolve ambiguities by making explicit, reviewable design decisions.

### IV. Clarity, Correctness, and Security
You MUST optimize for clarity, correctness, and security over brevity.

## Architecture Constraints
- **Repository**: Monorepo
- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- **Spec Management**: GitHub Spec-Kit Plus

## Security Rules
- All backend API routes require JWT authentication.
- JWTs are issued by Better Auth on the frontend.
- FastAPI must verify JWT using a shared secret.
- Task ownership must be enforced at the query level.
- No user may access or mutate another user’s tasks.

## Development Workflow
1. Write specifications.
2. Generate implementation plan.
3. Decompose plan into atomic tasks.
4. Implement strictly from tasks.

## Governance
This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All pull requests and reviews must verify compliance.

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01