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
            "settings": {"index": {"knn": True}},
            "mappings": {
                "properties": {
                    "userId": {"type": "keyword"},
                    "memoryId": {"type": "keyword"},
                    "projectId": {"type": "keyword"},
                    "type": {"type": "keyword"},
                    "title": {"type": "text"},
                    "summary": {"type": "text"},
                    "createdAt": {"type": "date"},
                    "embedding": {
                        "type": "knn_vector",
                        "dimension": 1024,
                    },
                }
            },
        },
    )


def index_memory(memory: dict, embedding: list[float]) -> None:
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
            "createdAt": memory["createdAt"],
            "embedding": embedding,
        },
    )


def search_similar(user_id: str, embedding: list[float], top_k: int = 20) -> list[dict]:
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
                            "knn": {
                                "embedding": {
                                    "vector": embedding,
                                    "k": top_k,
                                }
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
