import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DB_URL = "sqlite:///./test_tasks.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.pop(get_db, None)


client = TestClient(app)


def test_list_tasks_empty():
    response = client.get("/api/tasks/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_task():
    payload = {
        "title": "Write tests",
        "description": "Write unit tests for the API",
        "priority": "high",
        "status": "todo",
        "user_id": "test_user",
    }
    response = client.post("/api/tasks/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Write tests"
    assert data["priority"] == "high"
    assert "id" in data
    return data["id"]


def test_get_task():
    task_id = test_create_task()
    response = client.get(f"/api/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id


def test_update_task():
    task_id = test_create_task()
    response = client.put(f"/api/tasks/{task_id}", json={"title": "Updated title"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated title"


def test_update_task_status():
    task_id = test_create_task()
    response = client.put(f"/api/tasks/{task_id}/status", json={"status": "completed"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["completed_at"] is not None


def test_delete_task():
    task_id = test_create_task()
    response = client.delete(f"/api/tasks/{task_id}")
    assert response.status_code == 204
    assert client.get(f"/api/tasks/{task_id}").status_code == 404


def test_filter_tasks_by_status():
    test_create_task()
    response = client.get("/api/tasks/?status=todo&user_id=test_user")
    assert response.status_code == 200
    for task in response.json():
        assert task["status"] == "todo"


def test_task_stats():
    test_create_task()
    response = client.get("/api/tasks/stats/summary?user_id=test_user")
    assert response.status_code == 200
    data = response.json()
    assert "total_tasks" in data
    assert "completion_rate" in data


def test_task_not_found():
    response = client.get("/api/tasks/nonexistent-id")
    assert response.status_code == 404
