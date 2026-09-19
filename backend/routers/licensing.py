# routers/licensing.py
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import License, Content, UsageEventAudit, AgreementTerm, Agreement
from schemas.agreement import (
    LicenseCreate,
    ContentCreate,
    UsageEventAuditRequest,
    LicenseRenewRequest,
)
from services.rights_guard import audit_usage_event
from services.activity_log import log_activity

router = APIRouter(prefix="/licensing", tags=["licensing"])


@router.get("/{deal_id}")
def get_licensing_overview(deal_id: int, session: Session = Depends(get_session)):
    licenses = session.exec(select(License).where(License.deal_id == deal_id)).all()
    contents = session.exec(select(Content).where(Content.deal_id == deal_id)).all()
    audits = session.exec(
        select(UsageEventAudit)
        .where(UsageEventAudit.deal_id == deal_id)
        .order_by(col(UsageEventAudit.created_at).desc())
    ).all()

    return {
        "licenses": to_dict(licenses),
        "content": to_dict(contents),
        "recent_audits": to_dict(audits),
    }


@router.post("/content")
def create_content_item(data: ContentCreate, session: Session = Depends(get_session)):
    content = Content(**data.dict())
    session.add(content)
    session.commit()
    session.refresh(content)
    return to_dict(content)


@router.post("/license")
def create_license_item(data: LicenseCreate, session: Session = Depends(get_session)):
    license_item = License(**data.dict())
    session.add(license_item)
    session.commit()
    session.refresh(license_item)
    return to_dict(license_item)


@router.post("/audit")
def audit_detected_usage(
    data: UsageEventAuditRequest,
    session: Session = Depends(get_session),
):
    agreement = session.exec(
        select(Agreement).where(Agreement.deal_id == data.deal_id)
    ).first()
    
    term = None
    if agreement:
        term = session.exec(
            select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
        ).first()

    platforms = term.platforms if term and term.platforms else "TikTok + Instagram"
    usage_type = term.usage_rights if term and term.usage_rights else "Organic usage"
    period = term.license_duration if term and term.license_duration else "30 days"
    restrictions = "No paid advertising without prior commercial licensing"

    result = audit_usage_event(
        title=data.content_title,
        platforms=platforms,
        usage_type=usage_type,
        period=period,
        restrictions=restrictions,
        event_platform=data.platform,
        event_usage=data.usage_type,
        event_date=data.event_date,
    )

    audit_entry = UsageEventAudit(
        deal_id=data.deal_id,
        license_id=data.license_id,
        content_title=data.content_title,
        platform=data.platform,
        usage_type=data.usage_type,
        event_date=data.event_date,
        is_violation=result.get("is_violation", False),
        reason=result.get("reason"),
        suggested_fee=result.get("suggested_fee", 0.0),
        status="detected",
    )
    session.add(audit_entry)
    session.commit()
    session.refresh(audit_entry)

    if result.get("is_violation"):
        log_activity(
            session,
            data.deal_id,
            f"RightsGuard Alert: Detected {data.platform} {data.usage_type} on {data.content_title} exceeds agreed license.",
        )

    return {
        "audit": to_dict(audit_entry),
        "evaluation": result,
    }


@router.post("/{license_id}/renew")
def renew_license(
    license_id: int,
    data: LicenseRenewRequest,
    session: Session = Depends(get_session),
):
    lic = session.get(License, license_id)
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")

    lic.status = "Active"
    lic.usage_type = data.new_usage
    lic.current_position = f"{data.new_usage} through {data.duration_days} days extension"
    session.add(lic)
    session.commit()
    session.refresh(lic)

    log_activity(
        session,
        lic.deal_id,
        f"License renewed for '{lic.title}' · ₦{data.amount:,.0f} paid for {data.duration_days}-day {data.new_usage} rights",
    )
    return to_dict(lic)
