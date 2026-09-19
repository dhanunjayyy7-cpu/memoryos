import json

from common import bedrock_client, memory_model, opensearch_client, strands_agent


def handler(event, context):
    body = json.loads(event.get("body") or "{}")
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

    current_context = _build_context_string(body)
    if not current_context.strip():
        return _response(200, {"memories": []})

    embedding = bedrock_client.embed_text(current_context)
    candidates = opensearch_client.search_similar(user_id, embedding, top_k=20)
    if not candidates:
        return _response(200, {"memories": []})

    ranked = strands_agent.rank_and_explain(user_id, current_context, candidates)
    enriched = _enrich(user_id, ranked)

    return _response(200, {"context": current_context, "memories": enriched})


def _build_context_string(body: dict) -> str:
    parts = [body.get("title", ""), body.get("url", ""), body.get("recentQuery", "")]
    return " | ".join(p for p in parts if p)


def _enrich(user_id: str, ranked: list[dict]) -> list[dict]:
    result = []
    for item in ranked:
        memory = memory_model.get_memory(user_id, item["memoryId"])
        if not memory:
            continue
        result.append(
            {
                "memoryId": memory["memoryId"],
                "title": memory["title"],
                "type": memory["type"],
                "createdAt": memory["createdAt"],
                "score": item["score"],
                "relationship": item["relationship"],
                "explanation": item["explanation"],
            }
        )
    return result


def _response(status: int, body: dict):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
