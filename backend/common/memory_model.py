import os
import time
import uuid

import boto3

_dynamodb = boto3.resource("dynamodb")
_table = _dynamodb.Table(os.environ["MEMORIES_TABLE"])

MEMORY_TYPES = {"knowledge", "idea", "decision", "work_context", "unresolved"}


def new_memory_id() -> str:
    return f"mem_{uuid.uuid4().hex[:12]}"


def put_memory(user_id: str, memory: dict) -> dict:
    item = {
        "userId": user_id,
        "memoryId": memory["memoryId"],
        "projectId": memory.get("projectId", "unassigned"),
        "type": memory["type"],
        "title": memory["title"],
        "summary": memory.get("summary", ""),
        "content": memory.get("content", ""),
        "source": memory["source"],
        "sourceUrl": memory.get("sourceUrl", ""),
        "s3Key": memory.get("s3Key", ""),
        "createdAt": memory.get("createdAt") or _now_iso(),
        "importance": memory.get("importance", 0.5),
    }
    _table.put_item(Item=item)
    return item


def get_memory(user_id: str, memory_id: str) -> dict | None:
    resp = _table.get_item(Key={"userId": user_id, "memoryId": memory_id})
    return resp.get("Item")


def get_memories_by_ids(user_id: str, memory_ids: list[str]) -> list[dict]:
    return [m for m in (get_memory(user_id, mid) for mid in memory_ids) if m]


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
