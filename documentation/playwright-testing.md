# Background

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Tests can run against a local Docker environment or the live UAT environment.

# Running Against UAT

## Prerequisites

You need the repo checked out and dependencies installed. Playwright browsers also need to be installed once:

```
pnpm --filter @gc-digital-talent/playwright exec playwright install
```

## Step 1 — Create the env file

Create `apps/playwright/.env.uat` (gitignored) with the following content:

```
BASE_URL=https://uat-talentcloud.tbs-sct.gc.ca
TESTING_ENDPOINT_SECRET=<ask a team member with Azure access>
PLAYWRIGHT_PLATFORM_ADMIN_SUB=<sub of any UAT account with the Platform Admin role>
PLAYWRIGHT_COMMUNITY_ADMIN_SUB=<sub of any UAT account with the Community Admin role>
PLAYWRIGHT_APPLICANT_SUB=<sub of any UAT account with the Applicant role only>
```

All values must be filled in. `TESTING_ENDPOINT_SECRET` is stored in Azure Key Vault. The `_SUB` values are the `sub` UUID of existing UAT users with the respective roles — use Laravel tinker on the App Service Kudu console to look them up.

**Important:** `PLAYWRIGHT_APPLICANT_SUB` must point to a user with **only** the applicant role and no team memberships. Use this tinker query (single line) to find one:

```php
App\Models\User::whereNotNull('sub')->whereNull('deleted_at')->whereHas('roles', function($q) { $q->where('name', 'applicant'); })->whereDoesntHave('roles', function($q) { $q->whereIn('name', ['platform_admin', 'community_admin', 'community_recruiter', 'process_operator']); })->whereDoesntHave('teamUsers')->limit(5)->get(['id', 'first_name', 'last_name', 'email', 'sub']);
```

## Step 2 — Run the tests

All commands run from `apps/playwright/`:

| Goal | Command |
|---|---|
| All UAT tests | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test` |
| UAT projects only (auth, smoke, regression) | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --project=uat-*` |
| Integration tests only | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --project=chromium --grep @uat` |
| Re-run last failures | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --last-failed` |
| Run by name | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --grep "test title"` |
| Open HTML report | `pnpm exec playwright show-report` |

## How Authentication Works

Tests call `/refresh?sub=<uuid>` on the UAT app with an `X-Testing-Secret` header. The app returns JWT tokens which are injected into `localStorage`. No Canada Login browser flow is required.

If tests fail with a 400 or HTML response from the token endpoint:

- Check that `TESTING_TOKEN_ENABLED=true` is set in the App Service environment settings.
- Check that `APP_ENV_VERTICAL=uat` is set — it defaults to `production` if unset, which blocks the test token path.
- If env vars were changed after the last deployment, run `php artisan config:clear` in the Kudu console — Laravel's config cache persists across restarts and must be cleared manually.

# Test Categories

## `uat-persistent` — read-only, existing UAT users

Use this pattern when:
- The test only **asserts** — it never creates, updates, or deletes records
- It logs in as a **real, pre-seeded UAT user** via one of the `PLAYWRIGHT_*_SUB` env vars
- Failure means something that previously worked has broken in the live environment

**File naming:** `*-smoke.spec.ts` or `*-regression.spec.ts`  
**Runs in:** UAT pipeline only (matched by `--project=uat-*`)

Examples:
- Applicant dashboard renders key sections
- Admin can reach the admin dashboard
- Existing talent requests display correctly after a refactor

## Integration (dynamic data) — `chromium @uat`

Use this pattern when:
- The test **creates, modifies, or deletes** records
- It needs a **fresh, isolated user** with a specific role/state
- It must be safe to run in any environment (local, CI, UAT)

**Structure:** `createUserWithRoles` + test logic + `deleteUser` in `afterEach`  
**Tag:** `@uat` on the `test.describe` block  
**Runs in:** all environments

Examples:
- Submitting a full application end-to-end
- Assessing a candidate and recording a decision
- Completing a talent request (create via API → act via UI → delete in teardown)

## Rule of Thumb

If the test would leave UAT data in a different state after running, it belongs in the **integration pattern** with dynamic data and teardown. If it only reads, it belongs in **`uat-persistent`**.
