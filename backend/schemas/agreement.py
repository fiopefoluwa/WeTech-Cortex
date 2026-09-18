# schemas/agreement.py
from typing import Optional
from sqlmodel import SQLModel


class DealCreate(SQLModel):
    name: str
    brand_id: int
    creator_id: int
    description: Optional[str] = None
    total_amount: float


class AgreementTermCreate(SQLModel):
    scope: str
    deliverables: str
    price: float
    revision_limit: Optional[int] = None
    deadline: Optional[str] = None
    payment_terms: Optional[str] = None


class MessageCreate(SQLModel):
    deal_id: int
    sender_id: int
    content: str


class ChangeRequestCreate(SQLModel):
    deal_id: int
    message_id: Optional[int] = None
    description: str
    reason: str
    additional_amount: float
    requested_by: int