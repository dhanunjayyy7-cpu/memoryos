import json
import os

import boto3

_bedrock = boto3.client("bedrock-runtime")

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


def classify_content(content: str) -> dict:
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "messages": [
            {"role": "user", "content": CLASSIFY_PROMPT.format(content=content[:8000])}
        ],
    }
    resp = _bedrock.invoke_model(
        modelId=os.environ["BEDROCK_MODEL_ID"],
        body=json.dumps(body),
    )
    payload = json.loads(resp["body"].read())
    text = payload["content"][0]["text"]
    return _parse_classification(text, content)


def _parse_classification(text: str, original_content: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned[cleaned.find("{"):]

    try:
        parsed = json.loads(cleaned)
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


_VALID_TYPES = {"knowledge", "idea", "decision", "work_context", "unresolved"}


def embed_text(text: str) -> list[float]:
    resp = _bedrock.invoke_model(
        modelId=os.environ["BEDROCK_EMBEDDING_MODEL_ID"],
        body=json.dumps({"inputText": text[:8000]}),
    )
    payload = json.loads(resp["body"].read())
    return payload["embedding"]
