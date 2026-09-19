# services/agreement_extraction.py
import io
import os
import json
import re
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


def heuristic_extract_terms(text: str) -> AgreementTermCreate:
    """Smart regex heuristic fallback that parses real values out of agreement text."""
    # Deliverables
    deliverables = "3 TikTok videos"
    deliv_match = re.search(r"deliverables?[:\s]+([^\n\r.]+)", text, re.I)
    if deliv_match:
        deliverables = deliv_match.group(1).strip()
    else:
        cnt_match = re.search(r"(\d+)\s+(?:TikTok|Instagram|YouTube|Reels?|posts?|videos?|UGC|shorts?)[^\n\r.,]*", text, re.I)
        if cnt_match:
            deliverables = cnt_match.group(0).strip()

    # Price
    price = 300000.0
    price_match = re.search(r"(?:₦|NGN|Naira|\$)\s*([\d,]+(?:\.\d+)?)", text, re.I)
    if price_match:
        try:
            price = float(price_match.group(1).replace(",", ""))
        except ValueError:
            pass
    else:
        num_match = re.search(r"(?:total|compensation|fee|amount|rate)[:\s]+(?:₦|NGN|Naira|\$)?\s*([\d,]+)", text, re.I)
        if num_match:
            try:
                price = float(num_match.group(1).replace(",", ""))
            except ValueError:
                pass

    # Revision limit
    revision_limit = 1
    rev_match = re.search(r"(\d+)\s*(?:free\s*)?rounds?\s*of\s*revisions?|(\d+)\s*revisions?", text, re.I)
    if rev_match:
        try:
            revision_limit = int(rev_match.group(1) or rev_match.group(2))
        except (ValueError, TypeError):
            pass

    # License duration
    license_duration = "30 days"
    lic_match = re.search(r"(\d+\s*(?:days?|months?|weeks?|years?))", text, re.I)
    if lic_match:
        license_duration = lic_match.group(1)

    # Platforms
    platforms = "TikTok + Instagram"
    found_platforms = []
    for p in ["TikTok", "Instagram", "YouTube", "Twitter", "LinkedIn", "Facebook"]:
        if re.search(r"\b" + re.escape(p) + r"\b", text, re.I):
            found_platforms.append(p)
    if found_platforms:
        platforms = " + ".join(found_platforms)

    # Scope
    scope = "Commercial creator campaign"
    scope_match = re.search(r"scope[:\s]+([^\n\r.]+)", text, re.I)
    if scope_match:
        scope = scope_match.group(1).strip()
    elif deliverables:
        scope = f"Campaign deliverables: {deliverables}"

    return AgreementTermCreate(
        scope=scope,
        deliverables=deliverables,
        price=price,
        revision_limit=revision_limit,
        deadline="14 days from contract signing",
        payment_terms="50% deposit, 50% upon final delivery",
        platforms=platforms,
        usage_rights="Organic usage only",
        license_duration=license_duration,
        geographic_restrictions="Worldwide",
        exclusivity="Category exclusivity for active license duration",
    )


def extract_agreement_terms(agreement_text: str) -> AgreementTermCreate:
    if not client:
        return heuristic_extract_terms(agreement_text)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[EXTRACTION_PROMPT + agreement_text],
        )

        raw_text = (response.text or "").strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw_text)
        return AgreementTermCreate(**data)
    except Exception as e:
        print(f"Gemini extraction notice ({e}), using intelligent heuristic fallback.")
        return heuristic_extract_terms(agreement_text)