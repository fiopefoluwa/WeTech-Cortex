from fastapi import APIRouter, Depends
from sqlmodel import Session
from core.database import get_session
from models.agreement import Deal
from schemas.agreement import DealCreate
from services.activity_log import log_activity

router = APIRouter(prefix="/deals", tags=["deals"])


@router.post("/")
def create_deal(deal: DealCreate, session: Session = Depends(get_session)):
    new_deal = Deal(**deal.dict())
    session.add(new_deal)
    session.commit()
    session.refresh(new_deal)
    deal_id = new_deal.id
    deal_name = new_deal.name
    log_activity(session, deal_id, f"Deal '{deal_name}' created")
    return session.get(Deal, deal_id)


@router.get("/{deal_id}")
def get_deal(deal_id: int, session: Session = Depends(get_session)):
    return session.get(Deal, deal_id)