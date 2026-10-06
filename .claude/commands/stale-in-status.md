---
description: List GitHub Project board items stuck in a given Status for longer than N days, sorted oldest-first. Use when the user asks which issues/PRs have been sitting in a status (e.g. "In review", "Ready for Estimate") too long, or wants to build a review/standup list.
---

Find items on the "GC Digital Talent" GitHub Project board (owner `GCTC-NTGC`, project number `8`, repo `GCTC-NTGC/gc-digital-talent`) that have been sitting in a given Status column for more than N days.

Arguments: $ARGUMENTS

Parse the status name and, optionally, the day threshold (default **7**) from the arguments — e.g. "In Review", "In Review 10", "Ready for Estimate, more than 3 days". If the arguments name a different project board, use that project number/owner instead of the defaults above (use `gh project list --owner GCTC-NTGC` to look it up, and `gh project field-list` for its Status options).

## Board reference (project 8)

These rarely change; if a query returns nothing unexpectedly, re-check with `gh project field-list 8 --owner GCTC-NTGC --format json`.

- Project node ID: `PVT_kwDOAg6wTs4ADcx6`
- Status field ID: `PVTSSF_lADOAg6wTs4ADcx6zgB_Clo`
- Status options (exact label, emoji included → option ID):
  - `🧊 Icebox` → `0cae1d54`
  - `🏭 Ready for Estimate` → `ea0a37c4`
  - `📋 Ready for Dev` → `010c5cf5`
  - `🏃 Prioritized for Dev` → `c21592b9`
  - `🏗 In progress` → `0c59b8b3`
  - `👀 In review` → `2d193f16`
  - `✅ Done` → `6fdf60f2`

Map the user's wording (case-insensitive, emoji optional) onto one of these labels. The emoji is part of the label: `status:"Ready for Estimate"` matches nothing, `status:"🏭 Ready for Estimate"` works.

## Method

**1. Fetch the column and when each item entered it, in one query.**

Don't pull the whole board with `gh project item-list` — it takes ~30 s and can trip the GraphQL rate limit. Instead pass the board's filter syntax to the project's `items(query:)` connection so GitHub filters server-side, and read each item's Status field value, whose `updatedAt` is when the Status was last set:

```
gh api graphql -f q='status:"👀 In review"' -f query='
query($q: String!) {
  node(id: "PVT_kwDOAg6wTs4ADcx6") {
    ... on ProjectV2 {
      items(first: 100, query: $q) {
        totalCount
        pageInfo { hasNextPage endCursor }
        nodes {
          status: fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { name updatedAt }
          }
          content {
            ... on Issue { __typename number title url }
            ... on PullRequest { __typename number title url }
          }
        }
      }
    }
  }
}'
```

The `query` argument accepts the same filter syntax as the board's filter bar, so other qualifiers (e.g. `is:open`) can be combined with `status:`. Each page returns at most 100 items; if `hasNextPage` is true, repeat with `after: "<endCursor>"`.

**2. Determine how long each item has been in that status.**

Use `status.updatedAt` as the moment the item entered the status. Don't use the issue/PR timeline's `ProjectV2ItemStatusChangedEvent`s or `AddedToProjectV2Event`: most items have no status-change event for their move into the column, and the date an item was added to the board says nothing about when it reached its current status (it can be years off).

**3. Compute age, filter, sort, present.**

- `age_days = (now_utc - transition_timestamp) / 1 day`. Get "now" with `date -u +"%Y-%m-%dT%H:%M:%SZ"` rather than assuming — don't rely on a cached value from earlier in the conversation.
- Keep only items with `age_days > threshold`.
- Sort descending by age (oldest/longest-stuck first).
- Output a numbered markdown list, each line: bold linked title, then age in days (one decimal place) and the date it entered the status, e.g.:

  ```
  1. **[#17589 – 🛠️ External link checker: verify failures with a scheduled Playwright recheck](https://github.com/GCTC-NTGC/gc-digital-talent/issues/17589)** — 35.0 days (since 2026-07-29)
  ```

- Briefly list the remaining in-status items that fell under the threshold (number/title/age only, no links needed), so the reader can see the full column at a glance.
- Note PRs distinctly from issues if the column contains both.
- Add a one-line footnote reminding that age is measured from when the Status field was last set (its `updatedAt`), not from creation or the issue's last update.
