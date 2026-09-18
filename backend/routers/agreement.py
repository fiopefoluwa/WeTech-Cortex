from fastapi import APIRouter, Depends
from sqlmodel import Session
from core.database import get_session
from models.agreement import Agreement, AgreementTerm
from services.agreement_extraction import extract_agreement_terms
from services.activity_log import log_activity

router = APIRouter(prefix="/agreements", tags=["agreements"])


@router.post("/{deal_id}")
def create_agreement(deal_id: int, raw_text: str, session: Session = Depends(get_session)):
    agreement = Agreement(deal_id=deal_id, raw_text=raw_text)
    session.add(agreement)
    session.commit()
    session.refresh(agreement)
    agreement_id = agreement.id

    extracted = extract_agreement_terms(raw_text)

    term = AgreementTerm(agreement_id=agreement_id, **extracted.dict())
    session.add(term)
    session.commit()
    session.refresh(term)
    term_id = term.id

    log_activity(session, deal_id, "Agreement created and terms extracted")

    return {
        "agreement": session.get(Agreement, agreement_id),
        "terms": session.get(AgreementTerm, term_id),
    }
