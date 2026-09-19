# routers/deals.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from core.database import get_session, to_dict
from models.agreement import Deal
from schemas.agreement import DealCreate
from services.activity_log import log_activity

router = APIRouter(prefix="/deals", tags=["deals"])


@router.get("/")
def list_deals(session: Session = Depends(get_session)):
    deals = session.exec(select(Deal).order_by(Deal.created_at.desc())).all()
    return to_dict(deals)


@router.post("/")
def create_deal(deal: DealCreate, session: Session = Depends(get_session)):
    new_deal = Deal(**deal.dict())
    session.add(new_deal)
    session.commit()
    session.refresh(new_deal)
    deal_id = new_deal.id
    deal_name = new_deal.name
    log_activity(session, deal_id, f"Deal '{deal_name}' created")
    return to_dict(new_deal)


@router.get("/{deal_id}")
def get_deal(deal_id: int, session: Session = Depends(get_session)):
    deal = session.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return to_dict(deal)