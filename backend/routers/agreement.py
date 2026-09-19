# routers/agreement.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session, select, col
from core.database import get_session, to_dict
from models.agreement import Agreement, AgreementTerm
from services.agreement_extraction import extract_agreement_terms, extract_text_from_pdf_bytes
from services.activity_log import log_activity

router = APIRouter(prefix="/agreements", tags=["agreements"])


@router.get("/{deal_id}")
def get_agreement_by_deal(deal_id: int, session: Session = Depends(get_session)):
    agreement = session.exec(
        select(Agreement).where(Agreement.deal_id == deal_id).order_by(col(Agreement.created_at).desc())
    ).first()
    if not agreement:
        raise HTTPException(status_code=404, detail="Agreement not found for this deal.")

    terms = session.exec(
        select(AgreementTerm).where(AgreementTerm.agreement_id == agreement.id)
    ).first()

    return {
        "agreement": to_dict(agreement),
        "terms": to_dict(terms),
    }


@router.post("/{deal_id}")
def create_agreement_from_text(
    deal_id: int,
    raw_text: str,
    session: Session = Depends(get_session),
):
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

    log_activity(session, deal_id, "Agreement ingested and terms extracted via AI")

    return {
        "agreement": to_dict(agreement),
        "terms": to_dict(term),
    }


@router.post("/{deal_id}/upload")
async def upload_agreement_file(
    deal_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    content_bytes = await file.read()
    filename = file.filename.lower() if file.filename else ""

    if filename.endswith(".pdf"):
        try:
            raw_text = extract_text_from_pdf_bytes(content_bytes)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse PDF document: {str(e)}",
            )
    else:
        try:
            raw_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raw_text = content_bytes.decode("latin-1", errors="ignore")

    if not raw_text.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded document contains no readable text.",
        )

    agreement = Agreement(deal_id=deal_id, raw_text=raw_text)
    session.add(agreement)
    session.commit()
    session.refresh(agreement)

    extracted = extract_agreement_terms(raw_text)
    term = AgreementTerm(agreement_id=agreement.id, **extracted.dict())
    session.add(term)
    session.commit()
    session.refresh(term)

    log_activity(
        session,
        deal_id,
        f"Contract document '{file.filename}' uploaded and parsed via AI engine",
    )

    return {
        "filename": file.filename,
        "agreement": to_dict(agreement),
        "terms": to_dict(term),
    }
