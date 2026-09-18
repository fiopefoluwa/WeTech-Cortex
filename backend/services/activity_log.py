from sqlmodel import Session
from models.agreement import Activity

def log_activity(session: Session, deal_id: int, description: str):
    activity = Activity(
        deal_id=deal_id,
        description=description
    )
    session.add(activity)
    session.commit()