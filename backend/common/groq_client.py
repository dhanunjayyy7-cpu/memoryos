import json
import os

import requests

from . import secrets

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

CLASSIFY_PROMPT = """You are the classification engine for MemoryOS.
Given a captured piece of content, decide:
1. type: one of knowledge, idea, decision, work_context, unresolved
2. title: a short human-readable title (max 8 words)
3. summary: one or two sentences capturing why this matters
4. project_hint: a short project/topic name this likely belongs to, or "unassigned"

Respond as compact JSON with keys: type, title, summary, project_hint.

Content:
---
{content}
---
"""

_VALID_TYPES = {"knowledge", "idea", "decision", "work_context", "unresolved"}


def chat(messages: list[dict], max_tokens: int = 400) -> str:
    resp = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {secrets.get_groq_api_key()}",
            "Content-Type": "application/json",
        },
        json={
            "model": os.environ["GROQ_MODEL_ID"],
            "messages": messages,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"},
        },
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def classify_content(content: str) -> dict:
    text = chat([{"role": "user", "content": CLASSIFY_PROMPT.format(content=content[:8000])}])
    return _parse_classification(text, content)


def _parse_classification(text: str, original_content: str) -> dict:
    try:
        parsed = json.loads(text)
        return {
            "type": parsed.get("type") if parsed.get("type") in _VALID_TYPES else "knowledge",
            "title": parsed.get("title") or original_content[:60],
            "summary": parsed.get("summary", ""),
            "project_hint": parsed.get("project_hint", "unassigned"),
        }
    except (json.JSONDecodeError, TypeError):
        return {
            "type": "knowledge",
            "title": original_content.strip()[:60] or "Untitled memory",
            "summary": "",
            "project_hint": "unassigned",
        }
