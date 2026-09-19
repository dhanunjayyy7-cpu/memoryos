import os

import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

INDEX_NAME = "memoryos-memories"


def _client() -> OpenSearch:
    region = boto3.Session().region_name
    credentials = boto3.Session().get_credentials()
    auth = AWS4Auth(
        credentials.access_key,
        credentials.secret_key,
        region,
        "es",
        session_token=credentials.token,
    )
    endpoint = os.environ["OPENSEARCH_ENDPOINT"]
    return OpenSearch(
        hosts=[{"host": endpoint, "port": 443}],
        http_auth=auth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection,
    )


def ensure_index() -> None:
    client = _client()
    if client.indices.exists(INDEX_NAME):
        return
    client.indices.create(
        INDEX_NAME,
        body={
            "mappings": {
                "properties": {
                    "userId": {"type": "keyword"},
                    "memoryId": {"type": "keyword"},
                    "projectId": {"type": "keyword"},
                    "type": {"type": "keyword"},
                    "title": {"type": "text"},
                    "summary": {"type": "text"},
                    "content": {"type": "text"},
                    "createdAt": {"type": "date"},
                }
            },
        },
    )


def index_memory(memory: dict) -> None:
    client = _client()
    ensure_index()
    client.index(
        index=INDEX_NAME,
        id=memory["memoryId"],
        body={
            "userId": memory["userId"],
            "memoryId": memory["memoryId"],
            "projectId": memory.get("projectId", "unassigned"),
            "type": memory["type"],
            "title": memory["title"],
            "summary": memory.get("summary", ""),
            "content": memory.get("content", "")[:2000],
            "createdAt": memory["createdAt"],
        },
    )


def search_similar(user_id: str, query_text: str, top_k: int = 20) -> list[dict]:
    client = _client()
    ensure_index()
    resp = client.search(
        index=INDEX_NAME,
        body={
            "size": top_k,
            "query": {
                "bool": {
                    "filter": [{"term": {"userId": user_id}}],
                    "must": [
                        {
                            "multi_match": {
                                "query": query_text,
                                "fields": ["title^3", "summary^2", "content"],
                                "fuzziness": "AUTO",
                            }
                        }
                    ],
                }
            },
        },
    )
    return [
        {"memoryId": hit["_source"]["memoryId"], "score": hit["_score"]}
        for hit in resp["hits"]["hits"]
    ]
