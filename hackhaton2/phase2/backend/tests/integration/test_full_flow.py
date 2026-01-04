from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from main import app, get_session
import uuid

from src.models.user import User
from src.models.task import Task


# Create a test client
client = TestClient(app)

# Use an in-memory SQLite database for testing
DATABASE_URL = "sqlite:///test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def override_get_session():
    with Session(engine) as session:
        yield session


app.dependency_overrides[get_session] = override_get_session


def setup_module(module):
    SQLModel.metadata.create_all(engine)


def teardown_module(module):
    SQLModel.metadata.drop_all(engine)


def test_full_user_flow():
    # Generate a unique email for each test run to avoid conflicts
    unique_email = f"testuser_{uuid.uuid4()}@example.com"
    user_credentials = {"email": unique_email, "password": "testpassword"}

    # 1. Sign up a new user
    response = client.post("/api/auth/signup", json=user_credentials)
    assert response.status_code == 200
    assert "access_token" in response.json()
    token = response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create a new task
    task_data = {"title": "Test Task", "description": "This is a test task."}
    response = client.post("/api/tasks/", json=task_data, headers=headers)
    assert response.status_code == 200
    new_task = response.json()
    assert new_task["title"] == task_data["title"]
    assert new_task["description"] == task_data["description"]
    task_id = new_task["id"]

    # 3. Read tasks
    response = client.get("/tasks/", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == task_data["title"]

    # 4. Update the task
    updated_task_data = {"title": "Updated Test Task", "description": "This is an updated test task.", "completed": True}
    response = client.put(f"/tasks/{task_id}", json=updated_task_data, headers=headers)
    assert response.status_code == 200
    updated_task = response.json()
    assert updated_task["title"] == updated_task_data["title"]
    assert updated_task["completed"] == True

    # 5. Delete the task
    response = client.delete(f"/tasks/{task_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted successfully"

    # Verify the task is deleted
    response = client.get("/tasks/", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 0
