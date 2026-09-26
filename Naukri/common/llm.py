"""LLM client using OpenRouter API."""

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"


class LLMError(RuntimeError):
    pass


def draft_answer(question: str, profile: dict, job_context: str = "") -> str:
    """
    Draft an answer to a screening question using the profile via OpenRouter.
    Returns the answer string, or a [NEEDS_HUMAN_INPUT: reason] marker.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise LLMError("OPENROUTER_API_KEY not set in .env")

    model = os.getenv("OPENROUTER_MODEL", DEFAULT_OPENROUTER_MODEL)

    system = (
        "You are answering a job application screening question on behalf of the candidate. "
        "Use ONLY the facts in the profile below. Answer concisely (under 200 chars). "
        "If the profile lacks the information, respond with exactly: "
        "[NEEDS_HUMAN_INPUT: <brief reason>]"
    )

    profile_summary = {
        "total_experience_years": profile.get("total_experience_years"),
        "current_title": profile.get("current_title"),
        "current_company": profile.get("current_company"),
        "skills": profile.get("skills", []),
        "notice_period_days": profile.get("notice_period_days"),
        "current_ctc": profile.get("current_ctc"),
        "expected_ctc": profile.get("expected_ctc"),
        "current_city": profile.get("current_city"),
        "relocate_cities": profile.get("relocate_cities"),
        "night_shift_ok": profile.get("night_shift_ok"),
        "weekend_ok": profile.get("weekend_ok"),
        "highest_degree": profile.get("highest_degree"),
        "field_of_study": profile.get("field_of_study"),
        "certifications": profile.get("certifications", []),
        "languages": profile.get("languages", []),
    }

    prompt = (
        f"Profile: {json.dumps(profile_summary, ensure_ascii=False)}\n"
        f"Job context: {job_context}\n"
        f"Question: {question}\n"
        f"Answer:"
    )

    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": prompt},
    ]

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 500,
    }

    try:
        resp = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=(10, 60),
        )
        resp.raise_for_status()
        data = resp.json()
        text = (data.get("choices", [{}])[0].get("message", {}).get("content", "")).strip()
        return text
    except requests.RequestException as e:
        return f"[NEEDS_HUMAN_INPUT: OpenRouter API error: {e}]"
    except Exception as e:
        return f"[NEEDS_HUMAN_INPUT: OpenRouter error: {e}]"