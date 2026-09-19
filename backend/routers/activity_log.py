# routers/activity_log.py
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import Activity

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("/{deal_id}")
def get_deal_activities(deal_id: int, session: Session = Depends(get_session)):
    activities = session.exec(
        select(Activity).where(Activity.deal_id == deal_id).order_by(col(Activity.created_at).desc())
    ).all()
    return to_dict(activities)