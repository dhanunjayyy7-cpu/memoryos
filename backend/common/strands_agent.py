import json
import os

import boto3
from strands import Agent, tool
from strands.models import BedrockModel

from . import memory_model

RELEVANCE_THRESHOLD = 0.75

SYSTEM_PROMPT = """You are the reasoning layer of MemoryOS.
You are given the user's current context (what they appear to be doing right now)
and a list of candidate memories retrieved by semantic search.

For each candidate that is genuinely useful right now, decide:
- a relevance score from 0 to 1
- a relationship type: related, previous_context, previous_knowledge, previous_decision, unresolved, recent_change
- a one-sentence explanation of WHY it's relevant to the current context

Drop candidates that are not meaningfully relevant. Return compact JSON:
{"memories": [{"memoryId": "...", "score": 0.0, "relationship": "...", "explanation": "..."}]}
"""


@tool
def get_memory_details(memory_id: str) -> str:
    """Fetch full details for a memory by id, given the current user's id is fixed for this request."""
    memory = memory_model.get_memory(_current_user_id, memory_id)
    return json.dumps(memory) if memory else "{}"


_current_user_id = None


def rank_and_explain(user_id: str, current_context: str, candidates: list[dict]) -> list[dict]:
    global _current_user_id
    _current_user_id = user_id

    memories = memory_model.get_memories_by_ids(user_id, [c["memoryId"] for c in candidates])
    if not memories:
        return []

    model = BedrockModel(
        model_id=os.environ["BEDROCK_MODEL_ID"],
        region_name=boto3.Session().region_name,
    )
    agent = Agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        tools=[get_memory_details],
    )

    prompt = (
        f"Current context: {current_context}\n\n"
        f"Candidate memories:\n{json.dumps(memories, default=str)}"
    )
    result = agent(prompt)
    try:
        parsed = json.loads(str(result))
    except (json.JSONDecodeError, TypeError):
        return []

    ranked = [m for m in parsed.get("memories", []) if m.get("score", 0) >= RELEVANCE_THRESHOLD]
    ranked.sort(key=lambda m: m["score"], reverse=True)
    return ranked[:5]
