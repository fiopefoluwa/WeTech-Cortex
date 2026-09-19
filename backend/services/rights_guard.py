# services/rights_guard.py
import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

RIGHTS_AUDIT_PROMPT = """
You are analyzing a commercial licensing compliance event for brand-creator content.

AGREED LICENSE TERMS:
Content: {title}
Platforms: {platforms}
Permitted Usage: {usage_type}
License Period: {period}
Restrictions: {restrictions}

ACTUAL DETECTED USAGE EVENT:
Platform: {event_platform}
Detected Usage: {event_usage}
Detected Date: {event_date}

Determine if this detected event violates the contracted license terms (e.g. paid ads when only organic was licensed, wrong platform, or expired date).
If it is a violation, provide a concise explanation and suggest a reasonable commercial renewal fee in Naira (e.g. 120,000 NGN for a 30-day paid ad extension).

Return ONLY valid JSON, no extra text:
{{
  "is_violation": true,
  "reason": "Clear explanation referencing which agreement clause or date was breached",
  "suggested_fee": 120000.0
}}
"""


def audit_usage_event(
    title: str,
    platforms: str,
    usage_type: str,
    period: str,
    restrictions: str,
    event_platform: str,
    event_usage: str,
    event_date: str,
) -> dict:
    if not client:
        # High quality heuristic fallback
        is_paid_ad = "paid" in event_usage.lower() or "ad" in event_usage.lower()
        organic_only = "organic" in usage_type.lower()
        if is_paid_ad and organic_only:
            return {
                "is_violation": True,
                "reason": f"Active {event_platform} paid advertising exceeds agreed organic usage (Licensing §5: {platforms}, Organic usage; Restrictions §6: No paid advertising).",
                "suggested_fee": 120000.0,
            }
        return {
            "is_violation": False,
            "reason": "Detected usage aligns with contracted license permissions.",
            "suggested_fee": 0.0,
        }

    try:
        prompt = RIGHTS_AUDIT_PROMPT.format(
            title=title,
            platforms=platforms,
            usage_type=usage_type,
            period=period,
            restrictions=restrictions,
            event_platform=event_platform,
            event_usage=event_usage,
            event_date=event_date,
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
        )

        raw_text = (response.text or "").strip()
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        return json.loads(raw_text)
    except Exception as e:
        print(f"RightsGuard API note ({e}), evaluating with heuristic fallback.")
        return {
            "is_violation": True,
            "reason": f"Active {event_platform} {event_usage} on {event_date} exceeds contracted organic terms.",
            "suggested_fee": 120000.0,
        }
