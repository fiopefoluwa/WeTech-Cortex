# services/agreement_extraction.py
import os
import json
from google import genai
from dotenv import load_dotenv
from schemas.agreement import AgreementTermCreate

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

EXTRACTION_PROMPT = """
You are analyzing a brand-creator agreement/contract.
Extract the following fields and return ONLY valid JSON, no other text:

{
  "scope": "brief description of what work is covered",
  "deliverables": "list of specific deliverables as a single string",
  "price": 0.0,
  "revision_limit": 0,
  "deadline": "deadline as written, or null",
  "payment_terms": "payment terms as written, or null"
}

If a field cannot be found, use null for that field.
Agreement text:
"""


def extract_agreement_terms(agreement_text: str) -> AgreementTermCreate:
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[EXTRACTION_PROMPT + agreement_text],
    )

    raw_text = response.text.strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    data = json.loads(raw_text)

    return AgreementTermCreate(**data)