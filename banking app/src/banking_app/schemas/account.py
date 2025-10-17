from __future__ import annotations

from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class AccountBase(BaseModel):
    account_number: str
    account_name: str


class AccountCreate(BaseModel):
    account_name: str = Field(..., min_length=1, max_length=100)
    initial_deposit: Optional[Decimal] = Field(
        default=None,
        ge=Decimal("0.00"),
        description="Optional opening deposit amount",
    )


class Account(AccountBase):
    id: int
    user_id: int
    balance: Decimal

    class Config:
        from_attributes = True


class TransferCreate(BaseModel):
    from_account_number: str = Field(..., min_length=1)
    to_account_number: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=Decimal("0.00"))
    description: str = Field(..., min_length=1)
    idempotency_key: Optional[str] = Field(
        default=None, description="Optional key to ensure idempotent transfers"
    )


class Transfer(BaseModel):
    id: int
    from_account_number: str
    to_account_number: str
    amount: Decimal
    description: str
    status: str
    created_at: str
    completed_at: Optional[str]

    class Config:
        from_attributes = True


class TransactionEntry(BaseModel):
    transfer_id: int
    direction: str
    counterparty_account_number: str
    amount: Decimal
    description: str
    status: str
    occurred_at: str

    class Config:
        from_attributes = True