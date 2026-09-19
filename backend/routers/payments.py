# routers/payments.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from core.database import get_session, to_dict
from models.agreement import Payment, Deal, ChangeRequest, License, Agreement, AgreementTerm
from schemas.agreement import PaymentCheckoutRequest
from services.activity_log import log_activity

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/{deal_id}")
def get_deal_payments(deal_id: int, session: Session = Depends(get_session)):
    payments = session.exec(
        select(Payment).where(Payment.deal_id == deal_id).order_by(Payment.created_at.desc())
    ).all()
    return to_dict(payments)


@router.post("/checkout")
def checkout_mock_payment(
    data: PaymentCheckoutRequest,
    session: Session = Depends(get_session),
):
    payment = Payment(
        deal_id=data.deal_id,
        item_type=data.item_type,
        item_id=data.item_id,
        amount=data.amount,
        currency="NGN",
        status="paid",
        payer_id=data.payer_id,
        description=data.description or f"Payment for {data.item_type}",
    )
    session.add(payment)
    session.commit()
    session.refresh(payment)

    # 1. Update Change Request if applicable
    if data.item_type == "change_request" and data.item_id:
        cr = session.get(ChangeRequest, data.item_id)
        if cr:
            cr.status = "paid"
            session.add(cr)

            # Update Deal total amount
            deal = session.get(Deal, data.deal_id)
            if deal:
                deal.total_amount += data.amount
                session.add(deal)

            # Update AgreementTerm deliverables and price
            agreement = session.exec(
                select(Agreement).where(Agreement.deal_id == data.deal_id)
            ).first()
            if agreement:
                term = session.exec(
                    select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
                ).first()
                if term:
                    term.deliverables = f"{term.deliverables} + {cr.description}"
                    term.price += data.amount
                    session.add(term)

            session.commit()

    # 2. Update License if applicable
    elif data.item_type == "license_renewal" and data.item_id:
        lic = session.get(License, data.item_id)
        if lic:
            lic.status = "Active"
            lic.current_position = "Paid advertising renewed for 30 days"
            session.add(lic)
            session.commit()

    # Log payment event
    log_activity(
        session,
        data.deal_id,
        f"₦{data.amount:,.0f} payment received for: {payment.description}",
    )

    return to_dict(payment)
