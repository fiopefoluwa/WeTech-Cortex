# services/scope_guard.py
import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SCOPE_CHECK_PROMPT = """
You are comparing a new message against an existing agreement's terms.

AGREEMENT TERMS:
Scope: {scope}
Deliverables: {deliverables}
Price: {price}

NEW MESSAGE:
{message}

Determine if this message represents:
- "normal" (regular communication, no new request)
- "scope_change" (asking for something not in the agreement)
- "revision_request" (asking to revise existing deliverable)
- "other"

If it's a scope_change, estimate a reasonable additional fee in Naira based on the price
of similar existing deliverables in the agreement.

Return ONLY valid JSON, no other text:
{{
  "classification": "normal | scope_change | revision_request | other",
  "reason": "brief explanation",
  "estimated_fee": 0.0
}}
"""


def check_scope(scope: str, deliverables: str, price: float, message: str) -> dict:
    prompt = SCOPE_CHECK_PROMPT.format(
        scope=scope, deliverables=deliverables, price=price, message=message
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[prompt],
    )

    raw_text = response.text.strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    return json.loads(raw_text)
