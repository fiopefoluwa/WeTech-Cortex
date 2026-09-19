# routers/deals.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import Deal, User
from schemas.agreement import DealCreate
from services.activity_log import log_activity

router = APIRouter(prefix="/deals", tags=["deals"])


@router.get("/")
def list_deals(session: Session = Depends(get_session)):
    deals = session.exec(select(Deal).order_by(col(Deal.created_at).desc())).all()
    return to_dict(deals)


@router.post("/")
def create_deal(deal: DealCreate, session: Session = Depends(get_session)):
    # Ensure brand user exists
    brand = session.get(User, deal.brand_id)
    if not brand:
        brand = session.exec(select(User).where(User.role == "brand")).first()
        if not brand:
            brand = User(name="Brand Client", email=f"brand_{deal.brand_id}@scope.app", role="brand")
            session.add(brand)
            session.commit()
            session.refresh(brand)
        if brand.id is not None:
            deal.brand_id = brand.id

    # Ensure creator user exists
    creator = session.get(User, deal.creator_id)
    if not creator:
        creator = session.exec(select(User).where(User.role == "creator")).first()
        if not creator:
            creator = User(name="Creator Partner", email=f"creator_{deal.creator_id}@scope.app", role="creator")
            session.add(creator)
            session.commit()
            session.refresh(creator)
        if creator.id is not None:
            deal.creator_id = creator.id

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