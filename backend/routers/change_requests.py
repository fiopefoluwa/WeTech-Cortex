# routers/change_requests.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import ChangeRequest, Deal, Agreement, AgreementTerm
from schemas.agreement import ChangeRequestCreate
from services.activity_log import log_activity

router = APIRouter(prefix="/change-requests", tags=["change-requests"])


@router.get("/{deal_id}")
def get_change_requests_by_deal(deal_id: int, session: Session = Depends(get_session)):
    requests = session.exec(
        select(ChangeRequest).where(ChangeRequest.deal_id == deal_id).order_by(col(ChangeRequest.created_at).desc())
    ).all()
    return to_dict(requests)


@router.post("/")
def create_change_request(cr: ChangeRequestCreate, session: Session = Depends(get_session)):
    new_cr = ChangeRequest(**cr.dict())
    session.add(new_cr)
    session.commit()
    session.refresh(new_cr)
    deal_id = new_cr.deal_id
    description = new_cr.description
    log_activity(session, deal_id, f"Change request created: {description} (₦{new_cr.additional_amount:,.0f})")
    return to_dict(new_cr)


@router.patch("/{cr_id}/approve")
def approve_change_request(cr_id: int, session: Session = Depends(get_session)):
    cr = session.get(ChangeRequest, cr_id)
    if not cr:
        raise HTTPException(status_code=404, detail="Change request not found")
    cr.status = "approved"
    session.add(cr)
    session.commit()
    session.refresh(cr)
    deal_id = cr.deal_id
    description = cr.description
    log_activity(session, deal_id, f"Change request approved: {description}")
    return to_dict(cr)


@router.patch("/{cr_id}/pay")
def pay_change_request(cr_id: int, session: Session = Depends(get_session)):
    cr = session.get(ChangeRequest, cr_id)
    if not cr:
        raise HTTPException(status_code=404, detail="Change request not found")

    cr.status = "paid"
    session.add(cr)

    # 1. Update Deal total_amount
    deal = session.get(Deal, cr.deal_id)
    if deal:
        deal.total_amount += cr.additional_amount
        session.add(deal)

    # 2. Update Agreement deliverables and price to reflect new agreed scope
    agreement = session.exec(
        select(Agreement).where(Agreement.deal_id == cr.deal_id).order_by(col(Agreement.created_at).desc())
    ).first()
    if agreement:
        term = session.exec(
            select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
        ).first()
        if term:
            if cr.description not in term.deliverables:
                term.deliverables = f"{term.deliverables} + {cr.description}"
            term.price += cr.additional_amount
            session.add(term)

    session.commit()
    session.refresh(cr)

    log_activity(
        session,
        cr.deal_id,
        f"₦{cr.additional_amount:,.0f} payment settled for '{cr.description}' · Agreement updated with new deliverable",
    )
    return to_dict(cr)