import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
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


def test_list_routines_empty():
    response = client.get("/api/routines/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_routine():
    payload = {
        "name": "Morning Workout",
        "description": "30 min workout",
        "time_of_day": "morning",
        "duration_minutes": 30,
        "days_of_week": "1,2,3,4,5",
        "user_id": "test_user",
    }
    response = client.post("/api/routines/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Morning Workout"
    assert data["time_of_day"] == "morning"
    assert "id" in data
    return data["id"]


def test_get_routine():
    routine_id = test_create_routine()
    response = client.get(f"/api/routines/{routine_id}")
    assert response.status_code == 200
    assert response.json()["id"] == routine_id


def test_update_routine():
    routine_id = test_create_routine()
    response = client.put(f"/api/routines/{routine_id}", json={"duration_minutes": 45})
    assert response.status_code == 200
    assert response.json()["duration_minutes"] == 45


def test_delete_routine():
    routine_id = test_create_routine()
    response = client.delete(f"/api/routines/{routine_id}")
    assert response.status_code == 204
    assert client.get(f"/api/routines/{routine_id}").status_code == 404


def test_routine_check_in():
    routine_id = test_create_routine()
    response = client.post(f"/api/routines/{routine_id}/check-in?user_id=test_user")
    assert response.status_code == 201
    assert response.json()["routine_id"] == routine_id


def test_routine_check_in_duplicate():
    routine_id = test_create_routine()
    client.post(f"/api/routines/{routine_id}/check-in?user_id=test_user")
    response = client.post(f"/api/routines/{routine_id}/check-in?user_id=test_user")
    assert response.status_code == 400


def test_routine_not_found():
    response = client.get("/api/routines/nonexistent-id")
    assert response.status_code == 404
