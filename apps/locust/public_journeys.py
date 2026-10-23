"""
Load test that mixes the public user journeys in one script, to model overall public traffic
instead of one page at a time.

Journeys, picked per visit by weight (0 turns a journey off):
  A  Browse open jobs     OPEN_JOBS_WEIGHT    /[locale]/jobs          OpenJobsPage
  B  Browse closed jobs   CLOSED_JOBS_WEIGHT  /[locale]/jobs/closed   ClosedJobsPage
  C  Search               SEARCH_WEIGHT       /[locale]/search        SearchForm, SearchRequestOptions,
                                                                      AdvancedFilterOptions, CountTalentRequestMatches,
                                                                      then 0 to MAX_FILTER_CHANGES filter changes,
                                                                      each sending CountTalentRequestMatches

Every journey loads the page the way the browser does (HTML, app shell, page queries), see common.py.

Mixes, set with environment variables, no code changes:
  Realistic public traffic   OPEN_JOBS_WEIGHT=50 CLOSED_JOBS_WEIGHT=20 SEARCH_WEIGHT=30
  Search heavy               OPEN_JOBS_WEIGHT=30 CLOSED_JOBS_WEIGHT=10 SEARCH_WEIGHT=60
  Jobs heavy                 OPEN_JOBS_WEIGHT=70 CLOSED_JOBS_WEIGHT=20 SEARCH_WEIGHT=10

Run locally:
  locust -f public_journeys.py

Environment variables (plus the ones in common.py and search_page.py, these defaults replace theirs):
  OPEN_JOBS_WEIGHT     weight of journey A (default 50)
  CLOSED_JOBS_WEIGHT   weight of journey B (default 20)
  SEARCH_WEIGHT        weight of journey C (default 30)
  THINK_TIME_MIN       seconds between visits, lower bound (default 20)
  THINK_TIME_MAX       seconds between visits, upper bound (default 60)
  MAX_FILTER_CHANGES   most filter changes per search visit (default 2)
  SKIP_TLS_VERIFY      skip TLS certificate checks (default "true", for UAT behind the network's
                       re-signing proxy), "false" for normal certificate checks
"""

import logging
import os

from locust import between, events

from common import PublicPageUser
from search_page import FILTER_PAUSE_MAX, FILTER_PAUSE_MIN, search_visit

logger = logging.getLogger(__name__)

OPEN_JOBS_WEIGHT = int(os.getenv("OPEN_JOBS_WEIGHT", "50"))
CLOSED_JOBS_WEIGHT = int(os.getenv("CLOSED_JOBS_WEIGHT", "20"))
SEARCH_WEIGHT = int(os.getenv("SEARCH_WEIGHT", "30"))
THINK_TIME_MIN = float(os.getenv("THINK_TIME_MIN", "20"))
THINK_TIME_MAX = float(os.getenv("THINK_TIME_MAX", "60"))
MAX_FILTER_CHANGES = int(os.getenv("MAX_FILTER_CHANGES", "2"))
SKIP_TLS_VERIFY = os.getenv("SKIP_TLS_VERIFY", "true").lower() == "true"

# Fail at startup on settings that would otherwise break the run part way through
if min(OPEN_JOBS_WEIGHT, CLOSED_JOBS_WEIGHT, SEARCH_WEIGHT) < 0:
    raise ValueError("Journey weights can't be negative")
if OPEN_JOBS_WEIGHT + CLOSED_JOBS_WEIGHT + SEARCH_WEIGHT == 0:
    raise ValueError("At least one of OPEN_JOBS_WEIGHT, CLOSED_JOBS_WEIGHT or SEARCH_WEIGHT must be above 0")
if not 0 <= THINK_TIME_MIN <= THINK_TIME_MAX:
    raise ValueError("THINK_TIME_MIN must be 0 or more and no more than THINK_TIME_MAX")
if MAX_FILTER_CHANGES < 0:
    raise ValueError("MAX_FILTER_CHANGES can't be negative")


class PublicJourneysUser(PublicPageUser):
    """Anonymous visitor who browses jobs or searches for talent, by journey weight."""

    # Used when no host is given on the command line or in the Azure Load tab
    host = "https://talentcloud-pilot.uat.tbs-sct.gc.ca"
    wait_time = between(THINK_TIME_MIN, THINK_TIME_MAX)
    skip_tls_verify = SKIP_TLS_VERIFY

    def open_jobs(self):
        self.load_page("jobs", f"/{self.locale()}/jobs", [("OpenJobsPage", None, "poolsPaginated")])

    def closed_jobs(self):
        self.load_page("closed_jobs", f"/{self.locale()}/jobs/closed", [("ClosedJobsPage", None, "poolsPaginated")])

    def search(self):
        search_visit(self, MAX_FILTER_CHANGES)

    # A weight of 0 leaves the journey out
    tasks = {open_jobs: OPEN_JOBS_WEIGHT, closed_jobs: CLOSED_JOBS_WEIGHT, search: SEARCH_WEIGHT}


@events.test_start.add_listener
def log_configuration(environment, **_kwargs):
    total = OPEN_JOBS_WEIGHT + CLOSED_JOBS_WEIGHT + SEARCH_WEIGHT
    lines = [
        "",
        "===== Load test configuration =====",
        f"  HOST                 {environment.host or PublicJourneysUser.host}",
        f"  OPEN_JOBS_WEIGHT     {OPEN_JOBS_WEIGHT:<6} ({OPEN_JOBS_WEIGHT / total:.0%} of visits)",
        f"  CLOSED_JOBS_WEIGHT   {CLOSED_JOBS_WEIGHT:<6} ({CLOSED_JOBS_WEIGHT / total:.0%} of visits)",
        f"  SEARCH_WEIGHT        {SEARCH_WEIGHT:<6} ({SEARCH_WEIGHT / total:.0%} of visits)",
        f"  THINK_TIME_MIN       {THINK_TIME_MIN:g}s",
        f"  THINK_TIME_MAX       {THINK_TIME_MAX:g}s",
        f"  MAX_FILTER_CHANGES   {MAX_FILTER_CHANGES}",
        f"  FILTER_PAUSE         {FILTER_PAUSE_MIN:g}s to {FILTER_PAUSE_MAX:g}s",
        f"  SKIP_TLS_VERIFY      {SKIP_TLS_VERIFY}",
    ]
    logger.info("\n".join(lines))
