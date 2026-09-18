# routers/messages.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from core.database import get_session
from models.agreement import Message, AgreementTerm, Agreement
from schemas.agreement import MessageCreate
from services.scope_guard import check_scope
from services.activity_log import log_activity

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/")
def send_message(msg: MessageCreate, session: Session = Depends(get_session)):
    agreement = session.exec(
        select(Agreement).where(Agreement.deal_id == msg.deal_id)
    ).first()
    term = session.exec(
        select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
    ).first()

    result = check_scope(term.scope, term.deliverables, term.price, msg.content)

    new_message = Message(
        deal_id=msg.deal_id,
        sender_id=msg.sender_id,
        content=msg.content,
        classification=result["classification"],
    )
    session.add(new_message)
    session.commit()
    session.refresh(new_message)
    message_id = new_message.id

    if result["classification"] == "scope_change":
        log_activity(session, msg.deal_id, f"Scope change detected: {result['reason']}")

    return {
        "message": session.get(Message, message_id),
        "scope_analysis": result,
    }