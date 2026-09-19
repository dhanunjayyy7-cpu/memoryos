import json
import os

import boto3

from common import bedrock_client, memory_model, opensearch_client

_s3 = boto3.client("s3")

FULL_PAGE_THRESHOLD_CHARS = 2000


def handler(event, context):
    for record in event["Records"]:
        envelope = json.loads(record["body"])
        detail = envelope["detail"]
        _process(detail)


def _process(detail: dict) -> None:
    user_id = detail["userId"]
    content = detail["content"]

    classification = bedrock_client.classify_content(content)
    memory_id = memory_model.new_memory_id()

    s3_key = ""
    stored_content = content
    if len(content) > FULL_PAGE_THRESHOLD_CHARS:
        s3_key = f"{user_id}/{memory_id}.txt"
        _s3.put_object(Bucket=os.environ["ARTIFACTS_BUCKET"], Key=s3_key, Body=content.encode("utf-8"))
        stored_content = content[:FULL_PAGE_THRESHOLD_CHARS]

    memory = {
        "memoryId": memory_id,
        "projectId": classification.get("project_hint", "unassigned"),
        "type": classification["type"],
        "title": classification["title"],
        "summary": classification["summary"],
        "content": stored_content,
        "source": detail["source"],
        "sourceUrl": detail.get("url", ""),
        "s3Key": s3_key,
    }
    stored = memory_model.put_memory(user_id, memory)

    embedding = bedrock_client.embed_text(f"{classification['title']}\n{classification['summary']}\n{content[:2000]}")
    opensearch_client.index_memory(stored, embedding)
