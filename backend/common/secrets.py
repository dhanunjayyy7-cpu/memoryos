import json
import os

import boto3

_client = boto3.client("secretsmanager")


def get_groq_api_key() -> str:
    resp = _client.get_secret_value(SecretId=os.environ["GROQ_API_KEY_SECRET_ARN"])
    return json.loads(resp["SecretString"])["key"]
