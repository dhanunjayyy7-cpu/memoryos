import json
import os

import boto3

_events = boto3.client("events")

ALLOWED_SOURCES = {"manual_page", "manual_selection"}


def handler(event, context):
    body = json.loads(event.get("body") or "{}")
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

    source = body.get("source")
    content = body.get("content", "")
    if source not in ALLOWED_SOURCES or not content.strip():
        return _response(400, {"error": "source must be manual_page or manual_selection, content required"})

    detail = {
        "userId": user_id,
        "source": source,
        "url": body.get("url", ""),
        "title": body.get("title", ""),
        "content": content,
    }

    _events.put_events(
        Entries=[
            {
                "EventBusName": os.environ["EVENT_BUS_NAME"],
                "Source": "orb.manual",
                "DetailType": "MemorySaveRequested",
                "Detail": json.dumps(detail),
            }
        ]
    )

    return _response(202, {"status": "queued"})


def _response(status: int, body: dict):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
