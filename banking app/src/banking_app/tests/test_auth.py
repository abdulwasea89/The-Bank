import pytest
from httpx import AsyncClient
from banking_app.main import app
from banking_app import crud


@pytest.mark.asyncio
async def test_signup(db_session):
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post(
            "/auth/signup",
            json={"email": "test@example.com", "full_name": "Test User", "password": "password"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["full_name"] == "Test User"


@pytest.mark.asyncio
async def test_login(db_session):
    # Create user first
    await crud.create_user(db_session, "test@example.com", "Test User", "password")

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        response = await client.post(
            "/auth/login",
            data={"username": "test@example.com", "password": "password"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"