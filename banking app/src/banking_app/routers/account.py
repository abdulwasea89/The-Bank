from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.dependencies import get_current_user
from ..crud import account as account_crud, transfer as transfer_crud
from ..database import get_db
from ..schemas.account import (
    Account,
    AccountCreate,
    TransactionEntry,
    Transfer,
    TransferCreate,
)
from ..schemas.auth import User

router = APIRouter()


@router.post("/", response_model=Account, status_code=201)
async def create_account(
    account: AccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_account = await account_crud.create_account(
        db=db,
        user_id=current_user.id,
        account_name=account.account_name,
        initial_deposit=account.initial_deposit,
    )
    return new_account


@router.get("/", response_model=List[Account])
async def get_accounts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await account_crud.get_accounts_by_user(db, current_user.id)


@router.post("/transfer", response_model=Transfer, status_code=201)
async def transfer_money(
    transfer: TransferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from_account = await account_crud.get_account_by_number(
        db, transfer.from_account_number
    )
    if not from_account or from_account.user_id != current_user.id:
        raise HTTPException(
            status_code=404, detail="Source account not found for current user"
        )

    to_account = await account_crud.get_account_by_number(
        db, transfer.to_account_number
    )
    if not to_account:
        raise HTTPException(status_code=404, detail="Destination account not found")

    if from_account.id == to_account.id:
        raise HTTPException(
            status_code=400, detail="Cannot transfer to the same account"
        )

    balance = await account_crud.get_account_balance(db, from_account.id)
    if balance < transfer.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    try:
        db_transfer = await transfer_crud.create_transfer(
            db=db,
            from_account=from_account,
            to_account=to_account,
            amount=transfer.amount,
            description=transfer.description,
            idempotency_key=transfer.idempotency_key,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "id": db_transfer.id,
        "from_account_number": from_account.account_number,
        "to_account_number": to_account.account_number,
        "amount": db_transfer.amount,
        "description": db_transfer.description,
        "status": db_transfer.status,
        "created_at": db_transfer.created_at.isoformat()
        if db_transfer.created_at
        else None,
        "completed_at": (
            db_transfer.completed_at.isoformat()
            if db_transfer.completed_at is not None
            else None
        ),
    }


@router.get("/transactions", response_model=List[TransactionEntry])
async def get_transactions(
    account_number: str = Query(..., description="Account number to filter by"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    account = await account_crud.get_account_by_number(db, account_number)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    return await transfer_crud.get_account_transactions(
        db=db, account=account, limit=limit, offset=offset
    )