# models/agreement.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str  # "brand" or "creator"
    email: str = Field(unique=True, index=True)
    hashed_password: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Deal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    brand_id: int = Field(foreign_key="user.id")
    creator_id: int = Field(foreign_key="user.id")
    description: Optional[str] = None
    total_amount: float
    status: str = "active"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
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
    platforms: Optional[str] = "TikTok + Instagram"
    usage_rights: Optional[str] = "Organic usage"
    license_duration: Optional[str] = "30 days"
    geographic_restrictions: Optional[str] = "Worldwide"
    exclusivity: Optional[str] = "Non-exclusive"


class Deliverable(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    name: str
    agreed_scope: str
    status: str = "Not started"  # "Not started", "Submitted", "In review", "Approved"
    deadline: Optional[str] = None
    revisions: Optional[str] = "0 of 1 revisions used"
    reference_clause: Optional[str] = "Deliverables §2"
    reference_text: Optional[str] = None
    submission_url: Optional[str] = None
    revision_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Content(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    title: str
    platform: str
    submission_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class License(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    content_id: Optional[int] = Field(default=None, foreign_key="content.id")
    title: str
    platforms: str
    usage_type: str = "Organic"  # "Organic", "Paid Advertisement", "All Media"
    status: str = "Active"  # "Active", "Expiring soon", "Expired"
    original_period: Optional[str] = None
    start_date: Optional[str] = None
    expiry_date: Optional[str] = None
    current_position: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UsageEventAudit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    license_id: Optional[int] = Field(default=None, foreign_key="license.id")
    content_title: str
    platform: str
    usage_type: str
    event_date: str
    is_violation: bool = False
    reason: Optional[str] = None
    suggested_fee: float = 0.0
    status: str = "detected"  # "detected", "renewed", "dismissed"
    created_at: datetime = Field(default_factory=datetime.utcnow)


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
    status: str = "pending"  # "pending", "approved", "rejected", "paid"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    item_type: str = "deal"  # "deal", "change_request", "license_renewal"
    item_id: Optional[int] = None
    amount: float
    currency: str = "NGN"
    status: str = "paid"  # "paid", "pending", "failed"
    payer_id: int = Field(foreign_key="user.id")
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deal_id: int = Field(foreign_key="deal.id")
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)