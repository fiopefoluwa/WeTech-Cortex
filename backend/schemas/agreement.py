# schemas/agreement.py
from typing import Optional
from sqlmodel import SQLModel


class DealCreate(SQLModel):
    name: str
    brand_id: int
    creator_id: int
    description: Optional[str] = None
    total_amount: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class AgreementTermCreate(SQLModel):
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


class DeliverableCreate(SQLModel):
    deal_id: int
    name: str
    agreed_scope: str
    status: Optional[str] = "Not started"
    deadline: Optional[str] = None
    revisions: Optional[str] = "0 of 1 revisions used"
    reference_clause: Optional[str] = "Deliverables §2"
    reference_text: Optional[str] = None


class DeliverableSubmit(SQLModel):
    submission_url: str


class DeliverableRevise(SQLModel):
    revision_notes: str


class ContentCreate(SQLModel):
    deal_id: int
    title: str
    platform: str
    submission_url: Optional[str] = None


class LicenseCreate(SQLModel):
    deal_id: int
    content_id: Optional[int] = None
    title: str
    platforms: str
    usage_type: str = "Organic"
    status: str = "Active"
    original_period: Optional[str] = None
    start_date: Optional[str] = None
    expiry_date: Optional[str] = None
    current_position: Optional[str] = None


class UsageEventAuditRequest(SQLModel):
    deal_id: int
    license_id: Optional[int] = None
    content_title: str
    platform: str
    usage_type: str
    event_date: str


class LicenseRenewRequest(SQLModel):
    new_usage: str = "Paid Advertisement"
    duration_days: int = 30
    amount: float = 120000.0


class PaymentCheckoutRequest(SQLModel):
    deal_id: int
    item_type: str  # "deal", "change_request", "license_renewal"
    item_id: Optional[int] = None
    amount: float
    payer_id: int
    description: Optional[str] = None