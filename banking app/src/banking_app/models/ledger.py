from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Numeric
from sqlalchemy.sql import func
from .base import Base


class Ledger(Base):
    __tablename__ = "ledger"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)  # Positive for credit, negative for debit
    description = Column(String, nullable=False)
    transfer_id = Column(Integer, ForeignKey("transfers.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())