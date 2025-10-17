from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from sqlalchemy.exc import IntegrityError
from ..models import Transfer, Ledger
from decimal import Decimal
import uuid


async def create_transfer(
    db: AsyncSession,
    from_account,  # Account object
    to_account,    # Account object
    amount: Decimal,
    description: str,
    idempotency_key: str | None = None,
):
    if idempotency_key is None:
        idempotency_key = str(uuid.uuid4())

    # Check if transfer already exists
    existing = await db.execute(
        select(Transfer).where(Transfer.idempotency_key == idempotency_key)
    )
    if existing.scalars().first():
        raise ValueError("Transfer with this idempotency key already exists")

    # Create transfer record
    db_transfer = Transfer(
        idempotency_key=idempotency_key,
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        amount=amount,
        description=description,
        status="pending"
    )
    db.add(db_transfer)
    await db.flush()  # Get transfer ID

    # Create ledger entries
    debit_entry = Ledger(
        account_id=from_account.id,
        amount=-amount,
        description=description,
        transfer_id=db_transfer.id
    )
    credit_entry = Ledger(
        account_id=to_account.id,
        amount=amount,
        description=description,
        transfer_id=db_transfer.id
    )

    db.add(debit_entry)
    db.add(credit_entry)

    # Update transfer status
    db_transfer.status = "completed"

    await db.commit()
    await db.refresh(db_transfer)
    return db_transfer


async def get_transfer_by_id(db: AsyncSession, transfer_id: int):
    result = await db.execute(select(Transfer).where(Transfer.id == transfer_id))
    return result.scalars().first()


async def get_transfers_by_account(db: AsyncSession, account_id: int):
    result = await db.execute(
        select(Transfer).where(
            (Transfer.from_account_id == account_id) | (Transfer.to_account_id == account_id)
        )
    )
    return result.scalars().all()


async def get_ledger_entries(db: AsyncSession, account_id: int, limit: int = 50, offset: int = 0):
    result = await db.execute(
        select(Ledger).where(Ledger.account_id == account_id)
        .order_by(Ledger.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


async def get_account_transactions(db: AsyncSession, account, limit: int = 50, offset: int = 0):
    from sqlalchemy.orm import aliased
    from ..models import Account
    
    # Create aliases for from and to accounts in the transfer
    from_account = aliased(Account)
    to_account = aliased(Account)
    
    # Query all ledger entries for this account and join with transfers to get transaction details
    result = await db.execute(
        select(Ledger, Transfer, from_account, to_account)
        .join(Transfer, Ledger.transfer_id == Transfer.id)
        .join(from_account, Transfer.from_account_id == from_account.id)
        .join(to_account, Transfer.to_account_id == to_account.id)
        .where(Ledger.account_id == account.id)
        .order_by(Ledger.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    rows = result.all()
    transactions = []
    
    for ledger, transfer, from_acc, to_acc in rows:
        # Determine direction and counterparty based on which account this is
        if account.id == transfer.from_account_id:  # This account is the sender
            direction = "outgoing"
            counterparty_account_number = to_acc.account_number
        else:  # This account is the receiver
            direction = "incoming"
            counterparty_account_number = from_acc.account_number
        
        # Use absolute value of amount (always positive in response)
        amount = abs(ledger.amount)
        
        # Determine status from transfer
        status = transfer.status
        
        # Create transaction entry in the expected format
        transaction_entry = {
            "transfer_id": transfer.id,
            "direction": direction,
            "counterparty_account_number": counterparty_account_number,
            "amount": amount,
            "description": ledger.description,
            "status": status,
            "occurred_at": ledger.created_at.isoformat() if ledger.created_at else None
        }
        transactions.append(transaction_entry)
    
    return transactions