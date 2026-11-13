"""
Load test for the individual Job poster page (/[locale]/jobs/[id]).

Each visit picks a published job and loads the page the way the browser does
(HTML, app shell, then PoolAdvertisementPage).

The list of published jobs is fetched once per test engine with OpenJobsPage
(recorded as setup_OpenJobsPage), unless POOL_IDS is set. A failed fetch is retried
SETUP_ATTEMPTS times. If there are still no jobs, the test records a failed setup_no_jobs
request and stops, so the run fails instead of finishing green with no load.

Run locally:
  locust -f job_poster_page.py --config locust.conf

Environment variables (plus the ones in common.py):
  POOL_IDS     comma separated pool ids to visit instead of every published job
"""

import logging
import os
import random
from typing import List, Optional

import gevent
from gevent.lock import Semaphore
from locust import events, task
from locust.exception import StopUser

from common import PublicPageUser

logger = logging.getLogger(__name__)

SETUP_ATTEMPTS = 3
SETUP_RETRY_PAUSE = 5

pool_ids: List[str] = [p.strip() for p in os.getenv("POOL_IDS", "").split(",") if p.strip()]
pool_ids_lock = Semaphore()
# Why setup found nothing to visit, set once so later users stop without fetching again
setup_error: Optional[str] = None


def fetch_pool_ids(user: PublicPageUser) -> Optional[str]:
    """Fills pool_ids from OpenJobsPage, retrying failed requests. Returns why there are no jobs, or None."""
    for attempt in range(1, SETUP_ATTEMPTS + 1):
        data = user.graphql("OpenJobsPage", expect="poolsPaginated", name="setup_OpenJobsPage")
        if data is not None:
            pool_ids.extend(p["id"] for p in data["poolsPaginated"].get("data") or [] if p)
            return None if pool_ids else "No published jobs found. Publish a job or set POOL_IDS."
        if attempt < SETUP_ATTEMPTS:
            gevent.sleep(SETUP_RETRY_PAUSE)
    return f"Couldn't load published jobs after {SETUP_ATTEMPTS} attempts, see the setup_OpenJobsPage failures."


def fail_run(environment, message: str):
    """Fails the run with a failed request (the error % is what fails it), then stops the test."""
    logger.error("%s Stopping the test.", message)
    events.request.fire(
        request_type="SETUP",
        name="setup_no_jobs",
        response_time=0,
        response_length=0,
        response=None,
        context={},
        exception=Exception(message),
    )
    environment.process_exit_code = 1
    # Quitting directly from on_start would cancel itself
    gevent.spawn(quit_after_report, environment)


def quit_after_report(environment):
    # Workers send their stats to the master every 3 seconds, wait so the failure gets there before quitting
    gevent.sleep(5)
    environment.runner.quit()


class JobPosterPageUser(PublicPageUser):
    def on_start(self):
        super().on_start()
        global setup_error
        with pool_ids_lock:
            if not pool_ids and setup_error is None:
                setup_error = fetch_pool_ids(self)
                if setup_error:
                    fail_run(self.environment, f"{setup_error} Host: {self.host}.")
        if setup_error:
            raise StopUser()

    @task
    def job_poster(self):
        pool_id = random.choice(pool_ids)
        self.load_page("job_poster", f"/{self.locale()}/jobs/{pool_id}", [("PoolAdvertisementPage", {"id": pool_id}, "pool")])
