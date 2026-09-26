"""Persistent cache of screening question answers, keyed by normalized question."""

import json
import re
from pathlib import Path

CACHE_FILE = Path("learned_answers.json")
MAX_STORED = 500


def _norm(q: str) -> str:
    q = q.strip().lower()
    q = re.sub(r"\s+", " ", q)
    q = re.sub(r"[^\w\s]", "", q)
    return q


def load() -> dict:
    if not CACHE_FILE.exists():
        return {}
    try:
        with CACHE_FILE.open() as f:
            return json.load(f)
    except Exception:
        return {}


def save(data: dict):
    try:
        with CACHE_FILE.open("w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"  (couldn't save learned answers: {e})")


def get_answer(question: str) -> str | None:
    data = load()
    return data.get(_norm(question))


def save_answer(question: str, answer: str):
    data = load()
    data[_norm(question)] = answer.strip()
    # Keep size bounded
    if len(data) > MAX_STORED:
        # Remove oldest entries (simple FIFO)
        keys = list(data.keys())
        for k in keys[:len(data) - MAX_STORED]:
            del data[k]
    save(data)