"""
Shared helpers for the GC Digital Talent Locust load tests.

Each page script models a visitor landing on a page the way the browser does it:
  1. GET the page HTML (served by Nginx)
  2. App shell GraphQL queries, sent in parallel (authorizationQuery, SitewideBanner)
  3. The page's own GraphQL queries, sent in parallel

Metrics recorded (rows in the Locust / Azure Load Testing stats):
  - One row per GraphQL operation, named after the operation (eg. CountTalentRequestMatches)
  - One row per page HTML request (eg. html_search)
  - PAGE rows (eg. page_load_search): wall clock time for the whole page load,
    failed if any request in the page load failed
  - SERVER rows (eg. server_total_SearchForm, server_db_SearchForm): server side time from
    the API's Server-Timing header, only when SERVER_TIMING_ENABLED is on for the target

Failures are grouped by a stable message (HTTP status, rate limited, GraphQL error, empty data,
connection error) so the failures table doubles as an error breakdown.

A summary (server timing percentiles per operation, GraphQL error counts, lowest rate limit
headroom seen) is logged when the test stops.

PAGE and SERVER rows are synthetic, so they are included in the overall totals (requests,
throughput, error %). Set SYNTHETIC_METRICS=false to only record real HTTP requests.

Environment variables:
  LOCALES              comma separated locales to pick from per visit (default "en,fr")
  THINK_TIME_MIN       seconds between visits, lower bound (default 5)
  THINK_TIME_MAX       seconds between visits, upper bound (default 15)
  SYNTHETIC_METRICS    record PAGE and SERVER rows (default "true")
"""

from __future__ import annotations

import logging
import os
import random
import re
import string
import time
from collections import Counter, defaultdict

import gevent
from locust import HttpUser, between, events

import queries

logger = logging.getLogger(__name__)

LOCALES = [l.strip() for l in os.getenv("LOCALES", "en,fr").split(",") if l.strip()]
THINK_TIME_MIN = float(os.getenv("THINK_TIME_MIN", "5"))
THINK_TIME_MAX = float(os.getenv("THINK_TIME_MAX", "15"))
SYNTHETIC_METRICS = os.getenv("SYNTHETIC_METRICS", "true").lower() == "true"

USER_AGENT = "gcdt-locust-load-test"

SERVER_TIMING_PATTERN = re.compile(r'([\w-]+);desc="[^"]*";dur=([\d.]+)')
# Strip ids and numbers so the same error groups into one failure row
NORMALIZE_PATTERN = re.compile(r"[0-9a-f]{8}-[0-9a-f-]{27}|\d+")

# Collected for the end of test summary
server_timings: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
graphql_errors: Counter = Counter()
rate_limit = {"min_remaining": None, "limit": None, "hits": 0}


def percentile(values: list[float], pct: float) -> float:
    ordered = sorted(values)
    index = min(len(ordered) - 1, int(round(pct / 100 * (len(ordered) - 1))))
    return ordered[index]


def fire_synthetic(request_type: str, name: str, response_time: float, length: int = 0, error: str | None = None):
    if not SYNTHETIC_METRICS:
        return
    events.request.fire(
        request_type=request_type,
        name=name,
        response_time=response_time,
        response_length=length,
        response=None,
        context={},
        exception=Exception(error) if error else None,
    )


def record_server_timing(operation: str, header: str | None):
    if not header:
        return
    for metric, duration in SERVER_TIMING_PATTERN.findall(header):
        server_timings[operation][metric].append(float(duration))
        if metric == "total":
            fire_synthetic("SERVER", f"server_total_{operation}", float(duration))
        elif metric == "database-query":
            fire_synthetic("SERVER", f"server_db_{operation}", float(duration))


def record_rate_limit(headers):
    remaining = headers.get("X-RateLimit-Remaining")
    if remaining is None:
        return
    remaining = int(remaining)
    rate_limit["limit"] = headers.get("X-RateLimit-Limit")
    if rate_limit["min_remaining"] is None or remaining < rate_limit["min_remaining"]:
        rate_limit["min_remaining"] = remaining


class PublicPageUser(HttpUser):
    """Anonymous visitor. Subclasses add @task methods that call load_page()."""

    abstract = True
    # Used when no host is given on the command line, in locust.conf or in the Azure Load tab
    host = "https://dev-talentcloud.tbs-sct.gc.ca"
    wait_time = between(THINK_TIME_MIN, THINK_TIME_MAX)

    def on_start(self):
        # The API rate limits by user, then ai_user cookie, then IP. Load test engines share a
        # few IPs, so give each virtual user its own ai_user like a real browser has.
        self.client.cookies.set("ai_user", "".join(random.choices(string.ascii_letters + string.digits, k=22)))
        self.client.headers.update({"User-Agent": USER_AGENT})

    def locale(self) -> str:
        return random.choice(LOCALES)

    def html(self, name: str, path: str) -> bool:
        with self.client.get(path, name=name, catch_response=True) as response:
            if response.status_code == 0:
                response.failure("Connection error")
                return False
            if response.status_code != 200:
                response.failure(f"HTTP {response.status_code}")
                return False
            response.success()
            return True

    def graphql(
        self, operation: str, variables: dict | None = None, expect: str | None = None, name: str | None = None
    ) -> dict | None:
        """
        Send a GraphQL operation from queries.py. Returns the response data, or None on failure.
        expect is a top level field that must not be null (eg. "pool"), otherwise the request fails.
        """
        payload = {
            "operationName": operation,
            "query": getattr(queries, operation),
            "variables": variables or {},
        }
        with self.client.post(
            "/graphql",
            name=name or operation,
            json=payload,
            headers={"Accept": "application/graphql-response+json, application/json"},
            catch_response=True,
        ) as response:
            if response.status_code == 0:
                response.failure("Connection error")
                return None

            record_rate_limit(response.headers)
            record_server_timing(name or operation, response.headers.get("Server-Timing"))

            if response.status_code == 429:
                rate_limit["hits"] += 1
                response.failure("HTTP 429 rate limited")
                return None
            if response.status_code != 200:
                response.failure(f"HTTP {response.status_code}")
                return None

            try:
                body = response.json()
            except ValueError:
                response.failure("Invalid JSON response")
                return None

            errors = body.get("errors")
            if errors:
                message = NORMALIZE_PATTERN.sub("#", str(errors[0].get("message", "unknown")))[:120]
                graphql_errors[f"{name or operation}: {message}"] += 1
                response.failure(f"GraphQL error: {message}")
                return None

            data = body.get("data") or {}
            if expect and data.get(expect) is None:
                response.failure(f"Empty data: {expect}")
                return None

            response.success()
            return data

    def parallel(self, calls: list[tuple]) -> dict[str, dict | None]:
        """Send GraphQL calls at the same time, like the browser does. Each call is (operation, variables, expect)."""
        jobs = {call[0]: gevent.spawn(self.graphql, *call) for call in calls}
        gevent.joinall(list(jobs.values()))
        return {operation: job.value for operation, job in jobs.items()}

    def load_page(self, page: str, path: str, page_calls: list[tuple]) -> dict[str, dict | None]:
        """Full page load: HTML, then app shell queries, then the page queries. Records a PAGE row."""
        start = time.perf_counter()
        results: dict[str, dict | None] = {}

        ok = self.html(f"html_{page}", path)
        results.update(self.parallel([("authorizationQuery",), ("SitewideBanner",)]))
        results.update(self.parallel(page_calls))

        elapsed_ms = (time.perf_counter() - start) * 1000
        failed = [operation for operation, data in results.items() if data is None]
        if not ok:
            failed.insert(0, f"html_{page}")
        fire_synthetic("PAGE", f"page_load_{page}", elapsed_ms, error=f"Failed: {', '.join(failed)}" if failed else None)
        return results


@events.test_stop.add_listener
def log_summary(environment, **_kwargs):
    lines = ["", "===== Load test summary ====="]

    if server_timings:
        lines.append("Server-Timing per operation (ms): metric count p50 p95 p99 max")
        for operation in sorted(server_timings):
            for metric in sorted(server_timings[operation]):
                values = server_timings[operation][metric]
                lines.append(
                    f"  {operation:<28} {metric:<22} {len(values):>7} "
                    f"{percentile(values, 50):>8.1f} {percentile(values, 95):>8.1f} "
                    f"{percentile(values, 99):>8.1f} {max(values):>8.1f}"
                )
    else:
        lines.append("No Server-Timing headers received (SERVER_TIMING_ENABLED may be off on the target)")

    lines.append(
        f"Rate limit: limit={rate_limit['limit']} lowest remaining={rate_limit['min_remaining']} "
        f"429 responses={rate_limit['hits']}"
    )

    if graphql_errors:
        lines.append("GraphQL errors:")
        for message, count in graphql_errors.most_common():
            lines.append(f"  {count:>7}  {message}")
    else:
        lines.append("GraphQL errors: none")

    logger.info("\n".join(lines))
