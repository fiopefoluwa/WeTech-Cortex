# routers/payments.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import Payment, Deal, ChangeRequest, License, Agreement, AgreementTerm, User
from schemas.agreement import PaymentCheckoutRequest
from services.activity_log import log_activity

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/{deal_id}")
def get_deal_payments(deal_id: int, session: Session = Depends(get_session)):
    payments = session.exec(
        select(Payment).where(Payment.deal_id == deal_id).order_by(col(Payment.created_at).desc())
    ).all()
    return to_dict(payments)


@router.post("/checkout")
def checkout_mock_payment(
    data: PaymentCheckoutRequest,
    session: Session = Depends(get_session),
):
    # Validate deal
    deal = session.get(Deal, data.deal_id)
    if not deal:
        brand = session.exec(select(User).where(User.role == "brand")).first()
        creator = session.exec(select(User).where(User.role == "creator")).first()
        deal = Deal(
            id=data.deal_id,
            name=f"Deal #{data.deal_id}",
            brand_id=brand.id if brand and brand.id else 1,
            creator_id=creator.id if creator and creator.id else 2,
            total_amount=300000.0,
            status="active",
        )
        session.add(deal)
        session.commit()

    # Validate payer
    payer = session.get(User, data.payer_id)
    if not payer:
        first_user = session.exec(select(User)).first()
        if first_user and first_user.id:
            data.payer_id = first_user.id
        else:
            new_user = User(name="Client", email=f"payer_{data.payer_id}@scope.app", role="brand")
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            if new_user.id:
                data.payer_id = new_user.id

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
