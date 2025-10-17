import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from banking_app.database import Base
from banking_app.config import settings

# Use test database
test_engine = create_async_engine(
    settings.database_url.replace("neondb", "neondb_test"),  # Assuming test DB
    echo=True,
)

TestingSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
async def test_db():
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield TestingSessionLocal

    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db_session(test_db):
    async with test_db() as session:
        yield session
        await session.rollback()