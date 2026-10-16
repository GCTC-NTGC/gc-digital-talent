"""
Load test for the Search page (/[locale]/search).

Each visit loads the page the way the browser does (HTML, app shell, SearchForm,
SearchRequestOptions, AdvancedFilterOptions and the default CountTalentRequestMatches),
then narrows the search a few times. Every filter change sends CountTalentRequestMatches,
which is the expensive query on this page.

Filter values are picked from the page's own option queries, so they always exist on the target.

Run locally:
  locust -f search_page.py --config locust.conf

Environment variables (plus the ones in common.py):
  MAX_FILTER_CHANGES     most filter changes per visit (default 4)
"""

import os
import random
from typing import Optional

import gevent
from locust import task

from common import PublicPageUser

MAX_FILTER_CHANGES = int(os.getenv("MAX_FILTER_CHANGES", "4"))

# What SearchForm sends before anything is selected
DEFAULT_FILTER = {"flexibleWorkLocations": ["ONSITE"], "pools": [], "talentSources": ["QUALIFIED_IN_POOL"]}


def values(options: Optional[dict], key: str) -> list:
    return [item["value"] for item in ((options or {}).get(key) or []) if item and item.get("value")]


def narrow(applicant_filter: dict, form: dict, options: dict, advanced: dict) -> dict:
    """Add one filter selection, like a user changing one field in the search form."""
    choices = {
        "classification": lambda: {
            "qualifiedInClassifications": [
                {"group": c["group"], "level": c["level"]} for c in random.sample(form["classifications"], 1)
            ]
        },
        "workStream": lambda: {"qualifiedInWorkStreams": [{"id": random.choice(form["workStreams"])["id"]}]},
        "skills": lambda: {
            "skills": (applicant_filter.get("skills") or [])
            + [{"id": s["id"]} for s in random.sample(form["skills"], random.randint(1, 3))]
        },
        "languageAbility": lambda: {"languageAbility": random.choice(values(options, "languageAbilities"))},
        "locationPreferences": lambda: {
            "locationPreferences": random.sample(values(options, "workRegions"), random.randint(1, 3))
        },
        "flexibleWorkLocations": lambda: {
            "flexibleWorkLocations": sorted(
                set(random.sample(values(options, "flexibleWorkLocations"), random.randint(1, 2))) | {"ONSITE"}
            )
        },
        "talentSources": lambda: {
            "talentSources": random.sample(values(options, "talentSources"), random.randint(1, 2))
        },
        "operationalRequirements": lambda: {
            "operationalRequirements": random.sample(values(advanced, "operationalRequirements"), 1)
        },
    }
    available = [
        name
        for name, enabled in {
            "classification": form.get("classifications"),
            "workStream": form.get("workStreams"),
            "skills": form.get("skills"),
            "languageAbility": values(options, "languageAbilities"),
            "locationPreferences": values(options, "workRegions"),
            "flexibleWorkLocations": values(options, "flexibleWorkLocations"),
            "talentSources": values(options, "talentSources"),
            "operationalRequirements": values(advanced, "operationalRequirements"),
        }.items()
        if enabled
    ]
    if not available:
        return applicant_filter
    return {**applicant_filter, **choices[random.choice(available)]()}


class SearchPageUser(PublicPageUser):
    @task
    def search(self):
        results = self.load_page(
            "search",
            f"/{self.locale()}/search",
            [
                ("SearchForm", None, "skills"),
                ("SearchRequestOptions",),
                ("AdvancedFilterOptions",),
                ("CountTalentRequestMatches", {"where": {"applicantFilter": DEFAULT_FILTER}}),
            ],
        )

        form = results.get("SearchForm")
        if not form:
            return

        applicant_filter = dict(DEFAULT_FILTER)
        for _ in range(random.randint(1, MAX_FILTER_CHANGES)):
            gevent.sleep(random.uniform(2, 6))
            applicant_filter = narrow(
                applicant_filter, form, results.get("SearchRequestOptions"), results.get("AdvancedFilterOptions")
            )
            self.graphql("CountTalentRequestMatches", {"where": {"applicantFilter": applicant_filter}})
