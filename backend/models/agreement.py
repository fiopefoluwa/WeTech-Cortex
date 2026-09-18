# models/agreement.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str  # "brand" or "creator"
    email: str


class Deal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    brand_id: int = Field(foreign_key="user.id")
    creator_id: int = Field(foreign_key="user.id")
    description: Optional[str] = None
    total_amount: float
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Agreement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    raw_text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AgreementTerm(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    agreement_id: int = Field(foreign_key="agreement.id")
    scope: str
    deliverables: str
    price: float
    revision_limit: Optional[int] = None
    deadline: Optional[str] = None
    payment_terms: Optional[str] = None


class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    sender_id: int = Field(foreign_key="user.id")
    content: str
    classification: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChangeRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    message_id: Optional[int] = Field(default=None, foreign_key="message.id")
    description: str
    reason: str
    additional_amount: float
    requested_by: int = Field(foreign_key="user.id")
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)