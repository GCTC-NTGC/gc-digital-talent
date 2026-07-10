# Playwright Test Categories

## `uat-persistent` — read-only, existing UAT users

Use this pattern when:
- The test only **asserts** — it never creates, updates, or deletes records
- It logs in as a **real, pre-seeded UAT user** (via `PLAYWRIGHT_PLATFORM_ADMIN_SUB`, `PLAYWRIGHT_APPLICANT_SUB`, etc.)
- Failure means something that previously worked has broken in the live environment

**File naming:** `*-smoke.spec.ts` or `*-regression.spec.ts`
**Runs in:** UAT pipeline only (`--project=uat-persistent` via `--project=uat-*`)

Examples:
- Applicant dashboard renders key sections
- Admin can reach the admin dashboard
- Existing talent requests display correctly after a refactor

---

## Integration (dynamic data) — `chromium @uat`

Use this pattern when:
- The test **creates, modifies, or deletes** records
- It needs a **fresh, isolated user** with a specific role/state
- It should be safe to run in any environment (local, CI, UAT)

**Structure:** `createUserWithRoles` + test logic + `deleteUser` in `afterEach`
**Tag:** `@uat` on the `test.describe` block
**Runs in:** all environments

Examples:
- Submitting a full application end-to-end
- Assessing a candidate and recording a decision
- Completing a talent request (create request via API → act via UI → delete in teardown)

---

## Rule of thumb

> If the test would leave UAT data in a different state after running, it belongs in the **integration pattern** with dynamic data and teardown. If it only reads, it belongs in **`uat-persistent`**.
