# Background

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Tests can run against a local Docker environment or the live UAT environment.

Playwright signs in with dummy auth, so the API under test must run with `AUTH_PROVIDER=dummy` (see [How Authentication Works](#how-authentication-works)).

# Running Locally

CI sets up dummy auth automatically. For a local Docker environment, edit `api/.env`:

```
AUTH_PROVIDER=dummy
OAUTH_API_CLIENT_ID=
OAUTH_API_CLIENT_SECRET=
```

and set `OAUTH_LOGOUT_URI="http://localhost:8000/api/dummy-auth/logout"` in `apps/web/.env`. Then run `php artisan optimize:clear` and rebuild the frontend. Revert those changes to go back to signing in through the mock OAuth server.

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
PLAYWRIGHT_TARGET=uat
PLAYWRIGHT_PLATFORM_ADMIN_SUB=<sub of any UAT account with the Platform Admin role>
PLAYWRIGHT_COMMUNITY_ADMIN_SUB=<sub of any UAT account with the Community Admin role>
PLAYWRIGHT_APPLICANT_SUB=<sub of any UAT account with the Applicant role only>
PLAYWRIGHT_NO_ROLES_SUB=<sub of any UAT account having no roles at all>
```

All values must be filled in. The `_SUB` values are the `sub` UUID of existing UAT users with the respective roles — use Laravel tinker on the App Service Kudu console to look them up.

**Important:** `PLAYWRIGHT_APPLICANT_SUB` must point to a user with **only** the applicant role and no team memberships. Use this tinker query (single line) to find one:

```php
App\Models\User::whereNotNull('sub')->whereNull('deleted_at')->whereHas('roles', function($q) { $q->where('name', 'applicant'); })->whereDoesntHave('roles', function($q) { $q->whereIn('name', ['platform_admin', 'community_admin', 'community_recruiter', 'process_operator']); })->whereDoesntHave('teamUsers')->limit(5)->get(['id', 'first_name', 'last_name', 'email', 'sub']);
```

## Step 2 — Run the tests

All commands run from `apps/playwright/`:

| Goal                                        | Command                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| All UAT tests                               | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test`                                |
| UAT projects only (auth, smoke, regression) | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --project=uat-*`                |
| Integration tests only                      | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --project=chromium --grep @uat` |
| Re-run last failures                        | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --last-failed`                  |
| Run by name                                 | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --grep "test title"`            |
| UI mode (interactive, watch/debug)          | `PLAYWRIGHT_ENV_FILE=.env.uat pnpm exec playwright test --ui`                           |
| Open HTML report                            | `pnpm exec playwright show-report`                                                      |

## How Authentication Works

Playwright needs the API to run with dummy auth (`AUTH_PROVIDER=dummy`), which lets anyone sign in as any `sub` with no external auth provider:

- `loginBySub` fills in the dummy sign in form at `/login`.
- `getTokenForSub` (used by `graphql.newContext()`) calls `POST /api/dummy-auth/token` with `{ "sub": "<sub>", "claims": { ... } }`.

Both create the user if the `sub` doesn't exist yet and apply any claims, the same way a CanadaLogin sign in does. Dummy tokens never expire, so the token refresh tests skip themselves when a global setup detects dummy auth.

If tests fail with a 404 or HTML response from the token route, check the API's App Service settings:

- `AUTH_PROVIDER=dummy`
- `APP_ENV_VERTICAL` is set to something other than `production`
- `OAUTH_API_CLIENT_ID` and `OAUTH_API_CLIENT_SECRET` are empty

The API refuses to start in dummy mode if either of the last two is wrong. If env vars were changed after the last deployment, run `php artisan optimize:clear` in the Kudu console. The config and route caches persist across restarts and must be cleared manually.

To switch UAT back to CanadaLogin, remove `AUTH_PROVIDER` (or set it to `canadalogin`), restore the OAuth client settings and `OAUTH_LOGOUT_URI`, and redeploy. Playwright won't run against UAT while it uses CanadaLogin.

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
