import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DB_URL = "sqlite:///./test_dashboard.db"
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


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_list_habits_empty():
    response = client.get("/api/habits/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_habit():
    payload = {
        "name": "Morning Run",
        "description": "Run 5km every morning",
        "category": "health",
        "frequency": "daily",
        "target_per_week": 7,
        "user_id": "test_user",
    }
    response = client.post("/api/habits/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Morning Run"
    assert data["category"] == "health"
    assert "id" in data
    return data["id"]


def test_get_habit():
    habit_id = test_create_habit()
    response = client.get(f"/api/habits/{habit_id}")
    assert response.status_code == 200
    assert response.json()["id"] == habit_id


def test_update_habit():
    habit_id = test_create_habit()
    response = client.put(f"/api/habits/{habit_id}", json={"name": "Evening Run"})
    assert response.status_code == 200
    assert response.json()["name"] == "Evening Run"


def test_delete_habit():
    habit_id = test_create_habit()
    response = client.delete(f"/api/habits/{habit_id}")
    assert response.status_code == 204
    response = client.get(f"/api/habits/{habit_id}")
    assert response.status_code == 404


def test_habit_check_in():
    habit_id = test_create_habit()
    response = client.post(f"/api/habits/{habit_id}/check-in?user_id=test_user")
    assert response.status_code == 201
    assert response.json()["habit_id"] == habit_id


def test_habit_check_in_duplicate():
    habit_id = test_create_habit()
    client.post(f"/api/habits/{habit_id}/check-in?user_id=test_user")
    response = client.post(f"/api/habits/{habit_id}/check-in?user_id=test_user")
    assert response.status_code == 400


def test_habit_stats():
    habit_id = test_create_habit()
    response = client.get(f"/api/habits/{habit_id}/stats")
    assert response.status_code == 200
    data = response.json()
    assert "current_streak" in data
    assert "longest_streak" in data
    assert "completion_rate" in data


def test_habit_not_found():
    response = client.get("/api/habits/nonexistent-id")
    assert response.status_code == 404
