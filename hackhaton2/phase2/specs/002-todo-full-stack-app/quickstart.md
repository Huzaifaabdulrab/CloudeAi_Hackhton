# Quickstart: Todo Full-Stack Application

**Date**: 2026-01-02
**Feature**: `002-todo-full-stack-app`

## Setup

1. **Environment Variables**: Create a `.env` file in the `backend` directory with the following variables:
   ```
   DATABASE_URL="your_neon_postgresql_connection_string"
   BETTER_AUTH_SECRET="your_strong_secret_for_jwt"
   ```

2. **Install Dependencies**:
   - Backend: `cd backend && poetry install`
   - Frontend: `cd frontend && npm install`

## Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   poetry run uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Testing Scenarios

### User Signup and Login

1. Navigate to `http://localhost:3000/signup`.
2. Enter a valid email and password and click "Sign Up".
3. You should be redirected to the tasks page.
4. Log out.
5. Navigate to `http://localhost:3000/login`.
6. Enter the credentials you just created and click "Log In".
7. You should be redirected to the tasks page.

### Task Management

1. Once logged in, on the tasks page, enter a new task in the input field and click "Add".
2. The new task should appear in your list.
3. Click on the task to edit its description.
4. Click the checkbox to mark the task as complete.
5. Click the delete button to remove the task.
