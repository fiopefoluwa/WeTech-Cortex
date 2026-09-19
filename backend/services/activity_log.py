from sqlmodel import Session
from models.agreement import Activity, Deal


def log_activity(session: Session, deal_id: int, description: str):
    try:
        deal = session.get(Deal, deal_id)
        if not deal:
            return None
        activity = Activity(
            deal_id=deal_id,
            description=description
        )
        session.add(activity)
        session.commit()
        return activity
    except Exception:
        session.rollback()
        return None