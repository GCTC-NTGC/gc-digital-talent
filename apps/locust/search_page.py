"""
Load test for the Search page (/[locale]/search).

Each visit loads the page the way the browser does (HTML, app shell, SearchForm,
SearchRequestOptions, AdvancedFilterOptions and the default CountTalentRequestMatches),
then narrows the search up to MAX_FILTER_CHANGES times. Every filter change sends CountTalentRequestMatches,
which is the expensive query on this page.

Filter values are picked from the page's own option queries, so they always exist on the target.

Run locally:
  locust -f search_page.py --config locust.conf

Environment variables (plus the ones in common.py):
  MAX_FILTER_CHANGES     most filter changes per visit (default 4)
  FILTER_PAUSE_MIN       seconds before each filter change, lower bound (default 2)
  FILTER_PAUSE_MAX       seconds before each filter change, upper bound (default 6)
"""

import os
import random
from typing import Optional

import gevent
from locust import task

from common import PublicPageUser

MAX_FILTER_CHANGES = int(os.getenv("MAX_FILTER_CHANGES", "4"))
FILTER_PAUSE_MIN = float(os.getenv("FILTER_PAUSE_MIN", "2"))
FILTER_PAUSE_MAX = float(os.getenv("FILTER_PAUSE_MAX", "6"))

# What SearchForm sends before anything is selected
DEFAULT_FILTER = {
    "flexibleWorkLocations": ["ONSITE"],
    "pools": [],
    "talentSources": ["QUALIFIED_IN_POOL", "ADVANCEMENT", "LATERAL_MOVEMENT"],
}


def values(options: Optional[dict], key: str) -> list:
    return [item["value"] for item in ((options or {}).get(key) or []) if item and item.get("value")]


def some(items: list, most: int) -> list:
    return random.sample(items, random.randint(1, min(most, len(items))))


def narrow(applicant_filter: dict, form: dict, options: dict, advanced: dict) -> dict:
    """Add one filter selection, like a user changing one field in the search form."""
    # field: (items to pick from, change built from those items)
    fields = {
        "classification": (
            form.get("classifications"),
            lambda items: {
                "qualifiedInClassifications": [{"group": c["group"], "level": c["level"]} for c in some(items, 1)]
            },
        ),
        "workStream": (
            form.get("workStreams"),
            lambda items: {"qualifiedInWorkStreams": [{"id": random.choice(items)["id"]}]},
        ),
        "skills": (
            form.get("skills"),
            lambda items: {
                "skills": [
                    {"id": skill_id}
                    for skill_id in dict.fromkeys(
                        [s["id"] for s in applicant_filter.get("skills") or []] + [s["id"] for s in some(items, 3)]
                    )
                ]
            },
        ),
        "languageAbility": (
            values(options, "languageAbilities"),
            lambda items: {"languageAbility": random.choice(items)},
        ),
        "locationPreferences": (
            values(options, "workRegions"),
            lambda items: {"locationPreferences": some(items, 3)},
        ),
        "flexibleWorkLocations": (
            values(options, "flexibleWorkLocations"),
            lambda items: {"flexibleWorkLocations": sorted(set(some(items, 2)) | {"ONSITE"})},
        ),
        "talentSources": (
            values(options, "talentSources"),
            lambda items: {"talentSources": some(items, 2)},
        ),
        "operationalRequirements": (
            values(advanced, "operationalRequirements"),
            lambda items: {"operationalRequirements": some(items, 1)},
        ),
    }
    available = [field for field, (items, _change) in fields.items() if items]
    if not available:
        return applicant_filter
    items, change = fields[random.choice(available)]
    return {**applicant_filter, **change(items)}


def search_visit(user: PublicPageUser, max_filter_changes: int):
    """Load the search page, then make 0 to max_filter_changes filter changes."""
    results = user.load_page(
        "search",
        f"/{user.locale()}/search",
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

    applicant_filter = DEFAULT_FILTER
    for _ in range(random.randint(0, max_filter_changes)):
        gevent.sleep(random.uniform(FILTER_PAUSE_MIN, FILTER_PAUSE_MAX))
        applicant_filter = narrow(
            applicant_filter, form, results.get("SearchRequestOptions"), results.get("AdvancedFilterOptions")
        )
        user.graphql("CountTalentRequestMatches", {"where": {"applicantFilter": applicant_filter}})


class SearchPageUser(PublicPageUser):
    @task
    def search(self):
        search_visit(self, MAX_FILTER_CHANGES)
