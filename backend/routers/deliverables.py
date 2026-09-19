# routers/deliverables.py
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import Deliverable
from schemas.agreement import DeliverableCreate, DeliverableSubmit, DeliverableRevise
from services.activity_log import log_activity

router = APIRouter(prefix="/deliverables", tags=["deliverables"])


@router.get("/{deal_id}")
def get_deliverables(deal_id: int, session: Session = Depends(get_session)):
    deliverables = session.exec(
        select(Deliverable).where(Deliverable.deal_id == deal_id).order_by(col(Deliverable.id))
    ).all()
    return to_dict(deliverables)


@router.post("/")
def create_deliverable(data: DeliverableCreate, session: Session = Depends(get_session)):
    deliverable = Deliverable(**data.dict())
    session.add(deliverable)
    session.commit()
    session.refresh(deliverable)
    log_activity(session, data.deal_id, f"Deliverable '{deliverable.name}' added to scope")
    return to_dict(deliverable)


@router.post("/{deliverable_id}/submit")
def submit_deliverable(
    deliverable_id: int,
    data: DeliverableSubmit,
    session: Session = Depends(get_session),
):
    deliverable = session.get(Deliverable, deliverable_id)
    if not deliverable:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable.status = "In review"
    deliverable.submission_url = data.submission_url
    session.add(deliverable)
    session.commit()
    session.refresh(deliverable)

    log_activity(
        session,
        deliverable.deal_id,
        f"Work submitted for '{deliverable.name}' · URL: {data.submission_url}",
    )
    return to_dict(deliverable)


@router.post("/{deliverable_id}/approve")
def approve_deliverable(deliverable_id: int, session: Session = Depends(get_session)):
    deliverable = session.get(Deliverable, deliverable_id)
    if not deliverable:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable.status = "Approved"
    session.add(deliverable)
    session.commit()
    session.refresh(deliverable)

    log_activity(
        session,
        deliverable.deal_id,
        f"Deliverable '{deliverable.name}' approved by Brand",
    )
    return to_dict(deliverable)


@router.post("/{deliverable_id}/revise")
def request_revision(
    deliverable_id: int,
    data: DeliverableRevise,
    session: Session = Depends(get_session),
):
    deliverable = session.get(Deliverable, deliverable_id)
    if not deliverable:
        raise HTTPException(status_code=404, detail="Deliverable not found")

    deliverable.status = "In review"
    deliverable.revisions = "1 of 1 revisions used"
    deliverable.revision_notes = data.revision_notes
    session.add(deliverable)
    session.commit()
    session.refresh(deliverable)

    log_activity(
        session,
        deliverable.deal_id,
        f"Revision requested on '{deliverable.name}': {data.revision_notes}",
    )
    return to_dict(deliverable)
