import json

from common import memory_model


def handler(event, context):
    user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    memories = memory_model.list_memories_for_user(user_id)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"memories": memories}, default=str),
    }
