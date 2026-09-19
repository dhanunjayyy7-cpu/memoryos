import json
import os
import time

import boto3
import requests

from common import secrets

_events = boto3.client("events")
_ssm = boto3.client("ssm")

GITHUB_API = "https://api.github.com"


def handler(event, context):
    token = secrets.get_github_token()
    repo = os.environ["GITHUB_REPO"]
    param_name = os.environ["GITHUB_POLL_STATE_PARAM"]
    sha_param_name = f"{param_name}_sha"

    since = _get_last_poll(param_name)
    last_sha = _get_last_sha(sha_param_name)

    commits = _fetch_new_commits(repo, token, since)
    new_commits = _drop_already_seen(commits, last_sha)

    for commit in reversed(new_commits):
        _emit_commit_event(commit)

    _set_last_poll(param_name, _now_iso())
    if new_commits:
        _set_last_sha(sha_param_name, new_commits[0]["sha"])
    return {"processed": len(new_commits)}


def _drop_already_seen(commits: list[dict], last_sha: str | None) -> list[dict]:
    if not last_sha:
        return commits
    for i, commit in enumerate(commits):
        if commit["sha"] == last_sha:
            return commits[:i]
    return commits


def _fetch_new_commits(repo: str, token: str, since: str) -> list[dict]:
    resp = requests.get(
        f"{GITHUB_API}/repos/{repo}/commits",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
        params={"since": since},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def _emit_commit_event(commit: dict) -> None:
    message = commit["commit"]["message"]
    detail = {
        "userId": os.environ["DEFAULT_USER_ID"],
        "source": "github_commit",
        "url": commit["html_url"],
        "title": message.splitlines()[0][:80],
        "content": message,
    }
    _events.put_events(
        Entries=[
            {
                "EventBusName": os.environ["EVENT_BUS_NAME"],
                "Source": "github.commit",
                "DetailType": "MemorySaveRequested",
                "Detail": json.dumps(detail),
            }
        ]
    )


def _get_last_poll(param_name: str) -> str:
    try:
        resp = _ssm.get_parameter(Name=param_name)
        return resp["Parameter"]["Value"]
    except _ssm.exceptions.ParameterNotFound:
        return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(0))


def _get_last_sha(param_name: str) -> str | None:
    try:
        resp = _ssm.get_parameter(Name=param_name)
        return resp["Parameter"]["Value"]
    except _ssm.exceptions.ParameterNotFound:
        return None


def _set_last_sha(param_name: str, value: str) -> None:
    _ssm.put_parameter(Name=param_name, Value=value, Type="String", Overwrite=True)


def _set_last_poll(param_name: str, value: str) -> None:
    _ssm.put_parameter(Name=param_name, Value=value, Type="String", Overwrite=True)


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
