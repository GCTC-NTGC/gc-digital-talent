---
description: List GitHub Project board items stuck in a given Status for longer than N days, sorted oldest-first. Use when the user asks which issues/PRs have been sitting in a status (e.g. "In review", "Ready for Estimate") too long, or wants to build a review/standup list.
---

Find items on the "GC Digital Talent" GitHub Project board (owner `GCTC-NTGC`, project number `8`, repo `GCTC-NTGC/gc-digital-talent`) that have been sitting in a given Status column for more than N days.

Arguments: $ARGUMENTS

Parse the status name and, optionally, the day threshold (default **7**) from the arguments — e.g. "In Review", "In Review 10", "Ready for Estimate, more than 3 days". If the arguments name a different project board, use that project number/owner instead of the defaults above (use `gh project list --owner GCTC-NTGC` to look it up).

## Method

**1. Pull the full board and filter by status.**

Project boards here run well past `gh`'s default item limit, so always pass a high `--limit` and use `--format json` to get the `status` field per item:

```
gh project item-list 8 --owner GCTC-NTGC --format json --limit 2000
```

Filter `items` client-side (e.g. with `python3 -c '...'` or `jq`) for `status` equal to the requested column. Match on the visible label including its emoji prefix (e.g. `👀 In review`, `🏭 Ready for Estimate`) — print the distinct `status` values first if unsure of the exact string. Note each matching item's `content.number`, `content.title`, `content.type` (`Issue` or `PullRequest`), and `content.url`.

**2. Determine how long each item has been in that status.**

`gh project item-list` has no history — it only shows the *current* status. To find when an item most recently moved into that status, query each issue/PR's timeline for `PROJECT_V2_ITEM_STATUS_CHANGED_EVENT` nodes via GraphQL. Batch all items into a single query using aliases, branching on `issue(number: N)` vs `pullRequest(number: N)` per item's type:

```
gh api graphql -f query='
query {
  repository(owner: "GCTC-NTGC", name: "gc-digital-talent") {
    i17294: issue(number: 17294) {
      number title url
      timelineItems(last: 30, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
        nodes {
          ... on ProjectV2ItemStatusChangedEvent { createdAt status previousStatus }
        }
      }
    }
    p17841: pullRequest(number: 17841) {
      number title url
      timelineItems(last: 30, itemTypes: [PROJECT_V2_ITEM_STATUS_CHANGED_EVENT]) {
        nodes {
          ... on ProjectV2ItemStatusChangedEvent { createdAt status previousStatus }
        }
      }
    }
  }
}'
```

For each item, take the **last** node whose `status` matches the target column's label — that `createdAt` is when the current stay in that status began. (An item can cycle through a status more than once; only the most recent entry counts.)

Fallback: if no matching node exists (the item was added to the project already sitting in that status, before any automation fired), fall back to the `ADDED_TO_PROJECT_V2_EVENT` timestamp if needed, or note the age as unknown rather than guessing.

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
- Add a one-line footnote reminding that age is measured from the most recent transition *into* the status (via `ProjectV2ItemStatusChangedEvent`), not from creation or last-updated.
