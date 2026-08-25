# Talent Request success metrics

Spike output for [#17384](https://github.com/GC-Digital-Talent/gc-digital-talent/issues/17384), under the
epic [#16136 Improving request tracking](https://github.com/GC-Digital-Talent/gc-digital-talent/issues/16136).

The queries live in [`talent-request-success-metrics.sql`](./talent-request-success-metrics.sql).
This document covers what each metric means, what it cannot tell us, and the
options for collecting it on a recurring basis.

## The six metrics

| #   | Metric                       | Definition                                                                                     |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Submitted requests           | Count of `talent_requests` in the window, split by current status and by `was_empty`           |
| 2   | Median time to referral sent | Submission → first `in_progress_details` of `TALENT_SENT` **or** `FOLLOW_UP_SENT`              |
| 3   | Median time to completion    | Submission → first transition into `COMPLETED`, excluding duplicate and non-compliant requests |
| 4   | Fulfillment rate             | `completion_details = 'HIRE_MADE'` ÷ completed requests, excluding duplicate and non-compliant |
| 5   | Referrals per request        | Tracked users per request — reviewed, referred, and the ratio between them                     |
| 6   | Non-hire reasons             | `not_selected_reason` breakdown over tracked users marked `NOT_SELECTED`                       |

Metric 2 accepts `FOLLOW_UP_SENT` as well as `TALENT_SENT` because a follow-up
definitively implies talent already went out. Without it, any request where an
admin skipped straight to following up would be silently dropped from the median.

## Where the data comes from

`talent_requests` is the live table. `pool_candidate_search_requests` is legacy
and no longer has an Eloquent model; `app:sync-talent-requests` keeps the new
table populated from it during the transition.

**Durations must come from `activity_log`, not from `talent_requests.status_changed_at`.**
`TalentRequestObserver` rewrites `status_changed_at` on every status _or detail_
change, so it holds only the most recent touch — it cannot tell you when a
request first became `COMPLETED`.

`activity_log` (spatie/laravel-activitylog) stores `attribute_changes` as
`{"attributes": {...}, "old": {...}}`. Because `TalentRequest` logs with
`logOnlyDirty()`, the `attributes` object contains only the columns that changed
in that event, which is what makes "first transition into X" expressible as a
simple `MIN(created_at)`.

Two things to watch:

- Query `subject_type = 'App\Models\TalentRequest'` **only**. `SyncTalentRequests`
  copies legacy `PoolCandidateSearchRequest` log rows under the new subject type
  (de-duplicated on `subject_id` + `created_at`), so querying both would double-count.
- `config/activitylog.php` sets `clean_after_days => 365`. No scheduled
  `activitylog:clean` task exists in this repo, so the pruning may never actually
  run — but that should be confirmed against production before anyone relies on
  history older than a year.

## Limits of these numbers

These are worth stating whenever the metrics are reported, because most of them
make a number look worse or better than reality rather than simply noisy.

**Metrics 2 and 3 only describe requests that reached the state being measured.**
A request open for a year contributes nothing to the completion median until it
closes, so the median is biased toward fast requests. Query 3 reports
`still_open` and `median_age_of_open_requests` alongside for exactly this reason —
if open requests are much older than the median completion time, the median is
understating how long things really take.

**Metric 4 depends entirely on admin discipline.** It counts what the recruiter
declared when closing the request. Nothing in the code cross-checks
`completion_details` against the tracked users, so a request closed as
`HIRE_MADE` with no `SELECTED` candidate, or a `SELECTED` candidate on a request
closed for another reason, are both reachable and neither is flagged.
`completed_without_detail` in query 4 is the canary: those requests sit in the
denominator but can never be in the numerator, so a large count means the rate
is understated.

**Metric 5 measures adoption as much as behaviour.** The candidates matching a
request are computed live from the applicant filter — only users an admin
explicitly acts on get a `talent_request_tracked_users` row. So a request with
zero tracked users means nobody worked it _in the tool_, not that no candidates
matched. `requests_with_no_tracked_users` is the number to watch first; until it
is low, metrics 5 and 6 describe the subset of work being tracked rather than
the work being done.

**Metric 6 distinguishes `NO_REASON` from a blank.** `NO_REASON` is a real enum
value an admin selected. `(not recorded)` means the field was never filled in.
Collapsing them would hide non-adoption as a deliberate choice.

**No slicing.** These are overall totals. At current volumes a per-community or
per-month breakdown would produce cells of two or three requests, where a single
request moves a median by weeks. Add slicing when volume justifies it — the
queries are structured so a `GROUP BY` on the `requests` CTE is a small change.

## Time window

All queries start at **2026-06-03**, when `talent_request_tracked_users` shipped.
Referral and selection data does not exist before that date, so including earlier
requests would drag metrics 4–6 toward zero for reasons that have nothing to do
with performance. Metrics 1–3 could technically reach back further, but using one
window for all six keeps them comparable.

Adjust the date literal in each query, or bind it to a parameter, to move the window.

## Collection options

### Option A — Artisan command

A `app:talent-request-metrics` command running the queries and emitting CSV or JSON.

The repo has a well-worn path for this: seventeen commands in
`api/app/Console/Commands/`, and `app/Console/Kernel.php` already schedules five
of them with `->dailyAt()` and `->appendOutputTo(storage_path(...))`. Adding a
sixth is mechanical. For file output, `api/app/Generators/` (`CsvGenerator`,
`ExcelGenerator`) is the existing precedent.

- **Effort:** low — roughly a day including tests.
- **Strengths:** version-controlled alongside the queries, so a definition change
  goes through review. Runs unattended on a schedule. No new infrastructure.
- **Weaknesses:** output lands in container storage, so someone still has to
  fetch it and put it somewhere people read. It answers "how do we compute this
  regularly", not "how does the team see it". On its own it likely just relocates
  the spreadsheet problem rather than solving it.

### Option B — Power BI

Power BI already has read access to production. There is no path to it from a
development environment, so the deliverable here is the SQL plus setup notes,
not a built report.

Setup, in outline:

1. **Get data → PostgreSQL database**, pointing at the production read replica
   with the existing read-only credentials.
2. Choose **DirectQuery** or **Import**. Import with a scheduled refresh is the
   better fit — these are small aggregates that do not need to be live, and it
   keeps query load off production.
3. Paste each of the six queries as its own advanced-query source. They are
   deliberately standalone (each repeats its own CTEs) so this works without
   sharing state between them.
4. Replace the `DATE '2026-06-03'` literal with a Power BI parameter so the
   window can be moved without editing SQL.
5. Set the refresh schedule to match the reporting cadence below.

- **Effort:** low to moderate, and mostly not engineering effort — the queries
  are done, the work is in the report layer.
- **Strengths:** reaches the people who need the numbers without a deploy. Report
  changes do not require an engineer. Reuses infrastructure that already exists.
- **Weaknesses:** the metric definitions end up living outside the repo, where
  they can drift from the enums they depend on with nothing to catch it — if
  `TalentRequestCompletionDetail` gains a value, the Power BI copy will keep
  computing the old definition silently. Access is limited to whoever has Power BI.
  Worth keeping this file as the canonical definition and treating the report as
  a copy.

### Option C — Admin dashboard UI

Metrics rendered in-app, presumably off `AdminDashboardPage`.

There is a real precedent for the aggregation: `TalentRequestReferralSummary`
and `TalentRequestNotSelectedReasonCount` in `graphql/schema.graphql` already
expose computed aggregates over tracked users, so the pattern is established.

But the work is much wider than the other two options: a new GraphQL type and
resolver per metric, policy work deciding who may see platform-wide aggregates
(`TalentRequestPolicy` currently gates on `view-any-talentRequest`, which is
per-record authorization, not a "see the whole platform's numbers" permission),
front-end components, bilingual copy for every label, and accessibility review.
The `activity_log` scans behind metrics 2 and 3 are also not something to run
synchronously on page load without caching or a materialized rollup.

- **Effort:** high — a multi-ticket feature, not a spike follow-up.
- **Strengths:** the numbers are visible where the work happens, to everyone with
  the right role, with definitions that live in the codebase and cannot drift.
- **Weaknesses:** by far the most expensive, and it would be built before we know
  whether these six metrics are the right six. Premature to commit to while
  metric 5 suggests tracked-user adoption is still ramping.

### Recommendation

**B now, A shortly after, C only if the metrics prove themselves.**

Power BI gets numbers in front of people this week at near-zero engineering cost,
which is the actual point of a spike. Adding the artisan command afterward gives
a reviewable, version-controlled implementation of the same definitions and a
way to spot drift in the Power BI copy.

Hold option C until the metrics have been reported a few times and we know which
ones people actually use. Building a dashboard for six metrics chosen before any
of them had been measured is how you end up maintaining four charts nobody reads.

## When to collect, and how often

**First read: roughly three months after launch**, so around September 2026.
That is not arbitrary — metric 3 cannot produce a meaningful median until a
reasonable number of requests have actually closed, and until then the number
describes only the fastest requests. A first read taken too early will look
flattering and be wrong.

There is one measurement worth taking _immediately_, though, and it is not one of
the six: `requests_with_no_tracked_users` from query 5. If admins are not using
the tracked-users feature, metrics 5 and 6 will be meaningless in three months
and it is much cheaper to find that out now.

**Cadence: monthly.** Weekly is too frequent at current volumes — a single
request would move the medians enough to look like a trend, and the team would
learn to ignore the numbers. Quarterly is too slow to catch a process problem.
Monthly matches the pace at which requests actually move through the pipeline.

Two caveats on trend reading. First, metrics 2–4 are lagging: a request submitted
today may not close for months, so a month's figures keep changing after that
month ends. Report them against submission cohorts, not "requests closed this
month", and expect recent months to fill in. Second, do not read a month-over-month
change as a trend until the underlying counts are in the dozens.
