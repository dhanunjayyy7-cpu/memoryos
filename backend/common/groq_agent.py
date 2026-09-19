import json

from . import groq_client, memory_model

RELEVANCE_THRESHOLD = 0.75

SYSTEM_PROMPT = """You are the reasoning layer of MemoryOS.
You are given the user's current context (what they appear to be doing right now)
and a list of candidate memories retrieved by search.

For each candidate that is genuinely useful right now, decide:
- a relevance score from 0 to 1
- a relationship type: related, previous_context, previous_knowledge, previous_decision, unresolved, recent_change
- a one-sentence explanation of WHY it's relevant to the current context

Drop candidates that are not meaningfully relevant. Respond as compact JSON:
{"memories": [{"memoryId": "...", "score": 0.0, "relationship": "...", "explanation": "..."}]}
"""


def rank_and_explain(user_id: str, current_context: str, candidates: list[dict]) -> list[dict]:
    memories = memory_model.get_memories_by_ids(user_id, [c["memoryId"] for c in candidates])
    if not memories:
        return []

    prompt = (
        f"Current context: {current_context}\n\n"
        f"Candidate memories:\n{json.dumps(memories, default=str)}"
    )
    text = groq_client.chat(
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=800,
    )

    try:
        parsed = json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return []

    ranked = [m for m in parsed.get("memories", []) if m.get("score", 0) >= RELEVANCE_THRESHOLD]
    ranked.sort(key=lambda m: m["score"], reverse=True)
    return ranked[:5]
