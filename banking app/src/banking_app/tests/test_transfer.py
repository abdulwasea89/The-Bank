import pytest
from decimal import Decimal
from banking_app import crud


@pytest.mark.asyncio
async def test_create_transfer(db_session):
    # Create users and accounts
    user1 = await crud.create_user(db_session, "user1@example.com", "User 1", "pass")
    user2 = await crud.create_user(db_session, "user2@example.com", "User 2", "pass")
    account1 = await crud.create_account(db_session, user1.id, "ACC001")
    account2 = await crud.create_account(db_session, user2.id, "ACC002")

    # Perform transfer
    transfer = await crud.create_transfer(
        db_session, account1.id, account2.id, Decimal("100.00"), "Test transfer", "key1"
    )
    assert transfer.status == "completed"
    assert transfer.amount == Decimal("100.00")

    # Check balances
    balance1 = await crud.get_account_balance(db_session, account1.id)
    balance2 = await crud.get_account_balance(db_session, account2.id)
    assert balance1 == Decimal("-100.00")
    assert balance2 == Decimal("100.00")


@pytest.mark.asyncio
async def test_idempotency(db_session):
    # Create users and accounts
    user1 = await crud.create_user(db_session, "user3@example.com", "User 3", "pass")
    user2 = await crud.create_user(db_session, "user4@example.com", "User 4", "pass")
    account1 = await crud.create_account(db_session, user1.id, "ACC003")
    account2 = await crud.create_account(db_session, user2.id, "ACC004")

    # Perform transfer twice with same key
    await crud.create_transfer(
        db_session, account1.id, account2.id, Decimal("50.00"), "Test", "key2"
    )
    with pytest.raises(ValueError):
        await crud.create_transfer(
            db_session, account1.id, account2.id, Decimal("50.00"), "Test", "key2"
        )

    # Balance should be -50, not -100
    balance1 = await crud.get_account_balance(db_session, account1.id)
    assert balance1 == Decimal("-50.00")