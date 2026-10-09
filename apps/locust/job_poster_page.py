"""
Load test for the individual Job poster page (/[locale]/jobs/[id]).

Each visit picks a published job and loads the page the way the browser does
(HTML, app shell, then PoolAdvertisementPage).

The list of published jobs is fetched once per test engine with OpenJobsPage
(recorded as setup_OpenJobsPage), unless POOL_IDS is set.

Run locally:
  locust -f job_poster_page.py --config locust.conf

Environment variables (plus the ones in common.py):
  POOL_IDS     comma separated pool ids to visit instead of every published job
"""

import os
import random
from typing import List

from gevent.lock import Semaphore
from locust import task
from locust.exception import StopUser

from common import PublicPageUser

pool_ids: List[str] = [p.strip() for p in os.getenv("POOL_IDS", "").split(",") if p.strip()]
pool_ids_lock = Semaphore()


class JobPosterPageUser(PublicPageUser):
    def on_start(self):
        super().on_start()
        with pool_ids_lock:
            if not pool_ids:
                data = self.graphql("OpenJobsPage", expect="poolsPaginated", name="setup_OpenJobsPage")
                pool_ids.extend(p["id"] for p in ((data or {}).get("poolsPaginated") or {}).get("data") or [] if p)
        if not pool_ids:
            # Nothing to visit, stop this user rather than sending requests for a missing job
            raise StopUser()

    @task
    def job_poster(self):
        pool_id = random.choice(pool_ids)
        self.load_page("job_poster", f"/{self.locale()}/jobs/{pool_id}", [("PoolAdvertisementPage", {"id": pool_id}, "pool")])
