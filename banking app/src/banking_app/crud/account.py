from __future__ import annotations

import secrets
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Account, Ledger

ACCOUNT_NUMBER_LENGTH = 12
TWO_PLACES = Decimal("0.01")


def _normalize_amount(value: Optional[Decimal | float | int]) -> Decimal:
    if value is None:
        return Decimal("0.00")
    if not isinstance(value, Decimal):
        value = Decimal(str(value))
    return value.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


async def _generate_unique_account_number(db: AsyncSession) -> str:
    while True:
        candidate = f"{secrets.randbelow(10**ACCOUNT_NUMBER_LENGTH):0{ACCOUNT_NUMBER_LENGTH}d}"
        if not await get_account_by_number(db, candidate):
            return candidate


async def create_account(
    db: AsyncSession,
    user_id: int,
    account_name: str,
    initial_deposit: Optional[Decimal] = None,
) -> Account:
    starting_balance = _normalize_amount(initial_deposit)
    account_number = await _generate_unique_account_number(db)

    db_account = Account(
        user_id=user_id,
        account_name=account_name,
        account_number=account_number,
        balance=starting_balance,
    )
    db.add(db_account)
    await db.flush()

    if starting_balance > Decimal("0.00"):
        db.add(
            Ledger(
                account_id=db_account.id,
                amount=starting_balance,
                description="Initial deposit",
            )
        )

    await db.commit()
    await db.refresh(db_account)
    return db_account


async def get_account_by_id(db: AsyncSession, account_id: int) -> Account | None:
    result = await db.execute(select(Account).where(Account.id == account_id))
    return result.scalars().first()


async def get_account_by_number(
    db: AsyncSession, account_number: str
) -> Account | None:
    result = await db.execute(
        select(Account).where(Account.account_number == account_number)
    )
    return result.scalars().first()


async def get_accounts_by_user(db: AsyncSession, user_id: int) -> list[Account]:
    result = await db.execute(select(Account).where(Account.user_id == user_id))
    accounts = result.scalars().all()
    for account in accounts:
        await refresh_account_balance_snapshot(db, account)
    return accounts


async def get_account_balance(db: AsyncSession, account_id: int) -> Decimal:
    result = await db.execute(
        select(func.sum(Ledger.amount)).where(Ledger.account_id == account_id)
    )
    balance = result.scalar() or Decimal("0.00")
    return _normalize_amount(balance)


async def refresh_account_balance_snapshot(
    db: AsyncSession, account: Account
) -> Decimal:
    balance = await get_account_balance(db, account.id)
    account.balance = balance
    await db.flush()
    return balance