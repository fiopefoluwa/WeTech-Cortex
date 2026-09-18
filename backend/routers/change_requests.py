from fastapi import APIRouter, Depends
from sqlmodel import Session
from core.database import get_session
from models.agreement import ChangeRequest
from schemas.agreement import ChangeRequestCreate
from services.activity_log import log_activity

router = APIRouter(prefix="/change-requests", tags=["change-requests"])


@router.post("/")
def create_change_request(cr: ChangeRequestCreate, session: Session = Depends(get_session)):
    new_cr = ChangeRequest(**cr.dict())
    session.add(new_cr)
    session.commit()
    session.refresh(new_cr)
    cr_id = new_cr.id
    deal_id = new_cr.deal_id
    description = new_cr.description
    log_activity(session, deal_id, f"Change request created: {description}")
    return session.get(ChangeRequest, cr_id)


@router.patch("/{cr_id}/approve")
def approve_change_request(cr_id: int, session: Session = Depends(get_session)):
    cr = session.get(ChangeRequest, cr_id)
    cr.status = "approved"
    session.add(cr)
    session.commit()
    deal_id = cr.deal_id
    description = cr.description
    log_activity(session, deal_id, f"Change request approved: {description}")
    return session.get(ChangeRequest, cr_id)


@router.patch("/{cr_id}/pay")
def pay_change_request(cr_id: int, session: Session = Depends(get_session)):
    cr = session.get(ChangeRequest, cr_id)
    cr.status = "paid"
    session.add(cr)
    session.commit()
    deal_id = cr.deal_id
    amount = cr.additional_amount
    description = cr.description
    log_activity(session, deal_id, f"₦{amount} payment received for: {description}")
    return session.get(ChangeRequest, cr_id)