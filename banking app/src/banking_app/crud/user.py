from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import User
from ..auth.utils import get_password_hash


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()


async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()


async def create_user(db: AsyncSession, email: str, full_name: str, password: str):
    hashed_password = get_password_hash(password)
    db_user = User(email=email, full_name=full_name, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user