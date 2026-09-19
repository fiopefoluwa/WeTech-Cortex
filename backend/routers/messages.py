# routers/messages.py
from typing import List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select, col
from core.database import get_session
from models.agreement import Message, AgreementTerm, Agreement, User
from schemas.agreement import MessageCreate
from services.scope_guard import check_scope
from services.activity_log import log_activity
from services.websocket_manager import manager

router = APIRouter(tags=["messages"])


@router.get("/messages/{deal_id}", response_model=List[Message])
def get_deal_messages(deal_id: int, session: Session = Depends(get_session)):
    messages = session.exec(
        select(Message).where(Message.deal_id == deal_id).order_by(col(Message.created_at))
    ).all()
    return messages


@router.post("/messages/")
async def send_message(msg: MessageCreate, session: Session = Depends(get_session)):
    agreement = session.exec(
        select(Agreement).where(Agreement.deal_id == msg.deal_id).order_by(col(Agreement.created_at).desc())
    ).first()

    scope = "3 TikTok videos"
    deliverables = "3 TikTok videos"
    price = 300000.0

    if agreement:
        term = session.exec(
            select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
        ).first()
        if term:
            scope = term.scope
            deliverables = term.deliverables
            price = term.price

    result = check_scope(scope, deliverables, price, msg.content)

    new_message = Message(
        deal_id=msg.deal_id,
        sender_id=msg.sender_id,
        content=msg.content,
        classification=result.get("classification"),
    )
    session.add(new_message)
    session.commit()
    session.refresh(new_message)

    if result.get("classification") == "scope_change":
        log_activity(
            session,
            msg.deal_id,
            f"Scope change detected: {result.get('reason', 'Uncontracted request')}",
        )

    response_payload = {
        "message": {
            "id": new_message.id,
            "deal_id": new_message.deal_id,
            "sender_id": new_message.sender_id,
            "content": new_message.content,
            "classification": new_message.classification,
            "created_at": new_message.created_at.isoformat(),
        },
        "scope_analysis": result,
    }

    # Broadcast via WebSocket in real-time
    await manager.broadcast_to_deal(msg.deal_id, response_payload)

    return response_payload


@router.websocket("/ws/deals/{deal_id}")
async def deal_room_websocket(websocket: WebSocket, deal_id: int):
    await manager.connect(deal_id, websocket)
    try:
        while True:
            # Keep connection open and receive ping/messages if sent by client
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(deal_id, websocket)