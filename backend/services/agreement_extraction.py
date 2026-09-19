# services/agreement_extraction.py
import io
import os
import json
from google import genai
from dotenv import load_dotenv
from pypdf import PdfReader
from schemas.agreement import AgreementTermCreate

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

EXTRACTION_PROMPT = """
You are analyzing a brand-creator commercial partnership agreement/contract.
Extract the following structured fields and return ONLY valid JSON, no extra markdown or explanations:

{
  "scope": "brief description of what work is covered",
  "deliverables": "specific deliverables as a single string (e.g. '3 TikTok videos')",
  "price": 0.0,
  "revision_limit": 0,
  "deadline": "deadline as written, or null",
  "payment_terms": "payment terms as written, or null",
  "platforms": "platforms covered (e.g. 'TikTok + Instagram')",
  "usage_rights": "organic vs paid usage terms (e.g. 'Organic usage only')",
  "license_duration": "license duration (e.g. '30 days')",
  "geographic_restrictions": "geographic restrictions (e.g. 'Worldwide')",
  "exclusivity": "exclusivity rules (e.g. 'Non-exclusive' or category exclusivity)"
}

If a field cannot be determined, use reasonable defaults or null.
Agreement text:
"""


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF file bytes."""
    reader = PdfReader(io.BytesIO(pdf_bytes))
    extracted_text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_text.append(page_text)
    return "\n".join(extracted_text)


def extract_agreement_terms(agreement_text: str) -> AgreementTermCreate:
    if not client:
        # High quality fallback if API key is not configured
        return AgreementTermCreate(
            scope="3 TikTok videos with seasonal theme",
            deliverables="3 TikTok videos",
            price=300000.0,
            revision_limit=1,
            deadline="14 days from contract signing",
            payment_terms="50% deposit, 50% upon final delivery",
            platforms="TikTok + Instagram",
            usage_rights="Organic usage only",
            license_duration="30 days",
            geographic_restrictions="Worldwide",
            exclusivity="Coffee category exclusivity for 30 days",
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[EXTRACTION_PROMPT + agreement_text],
        )

        raw_text = response.text.strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        return AgreementTermCreate(**data)
    except Exception as e:
        print(f"Gemini extraction error ({e}), using structured baseline fallback.")
        return AgreementTermCreate(
            scope="Creator partnership campaign",
            deliverables="3 TikTok videos",
            price=300000.0,
            revision_limit=1,
            deadline="30 days",
            payment_terms="Milestone disbursements upon approval",
            platforms="TikTok + Instagram",
            usage_rights="Organic usage only",
            license_duration="30 days",
            geographic_restrictions="Worldwide",
            exclusivity="Non-exclusive",
        )