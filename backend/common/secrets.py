import json
import os

import boto3

_client = boto3.client("secretsmanager")


def get_github_token() -> str:
    resp = _client.get_secret_value(SecretId=os.environ["GITHUB_TOKEN_SECRET_ARN"])
    return json.loads(resp["SecretString"])["token"]
