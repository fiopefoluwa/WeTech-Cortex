# services/scope_guard.py
import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

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
    if not client:
        # Fallback heuristic if API key is not configured
        is_scope_change = bool(
            re.search(r"instagram|reel|youtube|shorts|podcast|extra|additional|new version", message, re.I)
        )
        if is_scope_change:
            return {
                "classification": "scope_change",
                "reason": "Request asks for content or platforms outside contracted deliverables",
                "estimated_fee": 40000.0,
            }
        return {
            "classification": "normal",
            "reason": "Message is within contracted project scope",
            "estimated_fee": 0.0,
        }

    try:
        prompt = SCOPE_CHECK_PROMPT.format(
            scope=scope, deliverables=deliverables, price=price, message=message
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
        )

        raw_text = (response.text or "").strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        return json.loads(raw_text)
    except Exception as e:
        print(f"Scope check API note ({e}), evaluating with heuristic fallback.")
        is_scope_change = bool(
            re.search(r"instagram|reel|youtube|shorts|podcast|extra|additional|new version", message, re.I)
        )
        if is_scope_change:
            return {
                "classification": "scope_change",
                "reason": f"Request asks for additional deliverables not included in agreement ({deliverables})",
                "estimated_fee": 40000.0,
            }
        return {
            "classification": "normal",
            "reason": "Communication is within agreement terms",
            "estimated_fee": 0.0,
        }
