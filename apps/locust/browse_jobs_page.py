"""
Load test for the Browse jobs pages (/[locale]/jobs and /[locale]/jobs/closed).

Each visit loads the page the way the browser does (HTML, app shell, then the page query).
Open jobs gets most of the traffic, closed jobs a smaller share.

Run locally:
  locust -f browse_jobs_page.py --config locust.conf
"""

from locust import task

from common import PublicPageUser


class BrowseJobsPageUser(PublicPageUser):
    @task(4)
    def open_jobs(self):
        self.load_page("jobs", f"/{self.locale()}/jobs", [("OpenJobsPage", None, "poolsPaginated")])

    @task(1)
    def closed_jobs(self):
        self.load_page("closed_jobs", f"/{self.locale()}/jobs/closed", [("ClosedJobsPage", None, "poolsPaginated")])
