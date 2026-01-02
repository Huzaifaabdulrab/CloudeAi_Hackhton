Write complete, structured specifications for:

Phase II: Todo Full-Stack Web Application

Objective:
Transform the existing console-based todo app into a modern, multi-user, authenticated web application with persistent storage.

Scope:
- Frontend UI
- Backend REST API
- Authentication and authorization
- Database schema
- Security model
- Monorepo organization using Spec-Kit Plus

Functional Requirements:
- Implement all 5 basic todo features:
  - Add task
  - View tasks
  - Update task
  - Delete task
  - Mark task complete
- Multi-user support with strict data isolation
- Responsive frontend interface
- Persistent storage using Neon PostgreSQL

Authentication Requirements:
- Use Better Auth on the frontend
- Enable JWT issuance
- Attach JWT to all API requests
- Backend verifies JWT using shared secret
- Backend derives authenticated user from token
- User ID in URL must match token user

API Requirements:
Specify RESTful endpoints including:
- Methods
- URLs
- Request/response shapes
- Authentication behavior
- Error conditions

Database Requirements:
- Define users and tasks schema
- Define relationships
- Define indexes
- Define ownership rules

Security Requirements:
- Stateless JWT authentication
- Token expiry handling
- Unauthorized access handling (401 / 403)
- No cross-user data access

Frontend Requirements:
- Auth flow (signup/signin)
- Task CRUD UI
- API client behavior
- Error and loading states

Spec-Kit Structure:
Organize specs under:
- specs/overview.md
- specs/features/
- specs/api/
- specs/database/
- specs/ui/

Output:
Only specification documents.
No plans.
No tasks.
No implementation.
