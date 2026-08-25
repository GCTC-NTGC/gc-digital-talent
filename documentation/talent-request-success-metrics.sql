/* Talent Request success metrics — GitHub issue #17384
 *
 * Six metrics for the talent request improvements delivered under epic #16136.
 * See talent-request-success-metrics.md for what these numbers mean, how often
 * to collect them, and the options for automating them.
 *
 * Each query below is standalone — it repeats the CTEs it needs so it can be
 * pasted into Power BI (or psql) on its own.
 *
 * Conventions used throughout:
 *
 *   - talent_requests is soft-deleted, so every query filters deleted_at IS NULL.
 *   - The window starts 2026-06-03, when talent_request_tracked_users shipped.
 *     Referral and selection data does not exist before that date, so earlier
 *     requests would silently drag metrics 4-6 toward zero. Change the date in
 *     each query (or bind it to a Power BI parameter) to move the window.
 *   - Durations come from activity_log, NOT from talent_requests.status_changed_at.
 *     The observer overwrites status_changed_at on every status *or detail*
 *     change, so it only ever holds the most recent touch.
 *   - activity_log is queried with subject_type = 'App\Models\TalentRequest'
 *     only. app:sync-talent-requests copies legacy PoolCandidateSearchRequest
 *     rows under the new subject type (de-duplicated on subject_id +
 *     created_at), so querying both subject types would double-count.
 *   - TalentRequest logs with logOnlyDirty(), so attribute_changes->'attributes'
 *     contains only the columns that changed in that event. That means
 *     ->>'status' is NULL unless status itself changed, which is exactly what
 *     "first transition into X" needs.
 */

/* ------------------------------------------------------------------
 * 1. Number of submitted requests
 *
 * The headline count, with the current pipeline shape behind it. was_empty
 * flags requests submitted when the search returned no matches at all — those
 * are demand signals rather than fillable requests, and they cannot produce a
 * hire, so they are worth watching separately.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
)
SELECT
    count(*) AS submitted_requests,
    count(*) FILTER (WHERE was_empty) AS submitted_with_no_matches,
    count(*) FILTER (WHERE status = 'NEW') AS status_new,
    count(*) FILTER (WHERE status = 'IN_PROGRESS') AS status_in_progress,
    count(*) FILTER (WHERE status = 'COMPLETED') AS status_completed
FROM requests;

/* ------------------------------------------------------------------
 * 2. Median time until referral sent
 *
 * Measured from submission to the first time in_progress_details became
 * TALENT_SENT or FOLLOW_UP_SENT. FOLLOW_UP_SENT is included because it
 * definitively implies talent already went out — it covers requests where an
 * admin moved straight to following up without setting TALENT_SENT first.
 *
 * Caveat: the median only describes requests that actually reached that state.
 * requests_with_referral_sent vs total_requests shows how much of the cohort
 * that is — a low ratio means the median describes a fast-moving minority.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
),
transitions AS (
    SELECT
        subject_id AS talent_request_id,
        created_at,
        attribute_changes->'attributes'->>'in_progress_details' AS new_in_progress_details
    FROM activity_log
    WHERE subject_type = 'App\Models\TalentRequest'
      AND event = 'updated'
),
referral_sent AS (
    SELECT
        talent_request_id,
        min(created_at) AS referral_sent_at
    FROM transitions
    WHERE new_in_progress_details IN ('TALENT_SENT', 'FOLLOW_UP_SENT')
    GROUP BY talent_request_id
)
SELECT
    round(percentile_cont(0.5) WITHIN GROUP (
        ORDER BY extract(EPOCH FROM (rs.referral_sent_at - r.created_at)) / 86400.0
    )::numeric, 1) AS median_days_to_referral_sent,
    count(rs.talent_request_id) AS requests_with_referral_sent,
    count(*) AS total_requests
FROM requests r
LEFT JOIN referral_sent rs ON rs.talent_request_id = r.id;

/* ------------------------------------------------------------------
 * 3. Median time until request completes
 *
 * Measured from submission to the first transition into COMPLETED. Duplicate
 * and non-compliant requests are excluded so this agrees with the fulfillment
 * denominator in metric 4.
 *
 * Caveat: a median over completed requests alone is biased toward fast ones —
 * a request open for a year contributes nothing until it closes. still_open
 * and median_age_of_open_requests are reported alongside so that bias is
 * visible. If the open requests are much older than the median completion
 * time, the completion median is understating reality.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
),
transitions AS (
    SELECT
        subject_id AS talent_request_id,
        created_at,
        attribute_changes->'attributes'->>'status' AS new_status
    FROM activity_log
    WHERE subject_type = 'App\Models\TalentRequest'
      AND event = 'updated'
),
completed AS (
    SELECT
        talent_request_id,
        min(created_at) AS completed_at
    FROM transitions
    WHERE new_status = 'COMPLETED'
    GROUP BY talent_request_id
),
durations AS (
    SELECT
        r.status,
        extract(EPOCH FROM (c.completed_at - r.created_at)) / 86400.0 AS days_to_completion,
        extract(EPOCH FROM (now() - r.created_at)) / 86400.0 AS days_open
    FROM requests r
    LEFT JOIN completed c ON c.talent_request_id = r.id
    WHERE r.completion_details IS NULL
       OR r.completion_details NOT IN ('DUPLICATE_REQUEST', 'NON_COMPLIANT')
)
SELECT
    round(percentile_cont(0.5) WITHIN GROUP (
        ORDER BY days_to_completion
    )::numeric, 1) AS median_days_to_completion,
    count(days_to_completion) AS completions_measured,
    count(*) FILTER (WHERE status = 'COMPLETED') AS completed_requests,
    count(*) FILTER (WHERE status <> 'COMPLETED') AS still_open,
    /* CASE yields NULL for completed rows, and percentile_cont ignores NULLs,
     * so this medians only the still-open requests. */
    round(percentile_cont(0.5) WITHIN GROUP (
        ORDER BY CASE WHEN status <> 'COMPLETED' THEN days_open END
    )::numeric, 1) AS median_age_of_open_requests
FROM durations;

/* ------------------------------------------------------------------
 * 4. Fulfillment rate (hire made?)
 *
 * The share of completed requests the recruiter closed as HIRE_MADE.
 * DUPLICATE_REQUEST and NON_COMPLIANT are excluded from the denominator —
 * those were never requests we attempted to fill. Everything else stays in,
 * including NO_LONGER_REQUIRED and HIRING_MANAGER_NOT_RESPONSIVE, since those
 * are genuine attempts that did not end in a hire.
 *
 * Caveat: completed_without_detail counts requests closed with no
 * completion_details at all. They sit in the denominator (we cannot prove they
 * were duplicates) but can never be in the numerator, so a large number here
 * means this rate is understated.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
)
SELECT
    count(*) FILTER (WHERE completion_details = 'HIRE_MADE') AS hires,
    count(*) AS eligible_completions,
    round(
        100.0 * count(*) FILTER (WHERE completion_details = 'HIRE_MADE')
        / nullif(count(*), 0), 1
    ) AS fulfillment_rate_pct,
    count(*) FILTER (WHERE completion_details IS NULL) AS completed_without_detail,
    (
        SELECT count(*)
        FROM requests
        WHERE status = 'COMPLETED'
          AND completion_details IN ('DUPLICATE_REQUEST', 'NON_COMPLIANT')
    ) AS excluded_from_denominator
FROM requests
WHERE status = 'COMPLETED'
  AND (completion_details IS NULL
       OR completion_details NOT IN ('DUPLICATE_REQUEST', 'NON_COMPLIANT'));

/* ------------------------------------------------------------------
 * 5. Number of referrals per request
 *
 * "Reviewed" is every tracked user attached to the request; "referred" is
 * those with referral_decision = 'REFERRED'. Selecting a candidate marks them
 * referred first (TalentRequestTrackedUser::selected calls referred), so
 * selected candidates are correctly counted as referrals.
 *
 * requests_with_no_tracked_users is the adoption signal: candidates matching a
 * request are computed live from the applicant filter and only get a tracked
 * row once an admin acts on them, so a request with zero rows means nobody
 * worked it in the tool — not that no candidates matched.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
),
per_request AS (
    SELECT
        r.id,
        count(tu.id) AS reviewed,
        count(tu.id) FILTER (WHERE tu.referral_decision = 'REFERRED') AS referred
    FROM requests r
    LEFT JOIN talent_request_tracked_users tu ON tu.talent_request_id = r.id
    GROUP BY r.id
)
SELECT
    count(*) AS requests,
    count(*) FILTER (WHERE reviewed = 0) AS requests_with_no_tracked_users,
    round(avg(reviewed), 2) AS mean_reviewed_per_request,
    round(percentile_cont(0.5) WITHIN GROUP (ORDER BY reviewed)::numeric, 1) AS median_reviewed_per_request,
    round(avg(referred), 2) AS mean_referred_per_request,
    round(percentile_cont(0.5) WITHIN GROUP (ORDER BY referred)::numeric, 1) AS median_referred_per_request,
    sum(reviewed) AS total_reviewed,
    sum(referred) AS total_referred,
    round(100.0 * sum(referred) / nullif(sum(reviewed), 0), 1) AS referred_share_of_reviewed_pct
FROM per_request;

/* ------------------------------------------------------------------
 * 6. Breakdown of reasons referrals are not hired
 *
 * Over tracked users the admin explicitly marked NOT_SELECTED. Note that
 * NO_REASON is a real enum value the admin chose, and is reported separately
 * from '(not recorded)', which means the field was never filled in.
 * ------------------------------------------------------------------ */
WITH requests AS (
    SELECT *
    FROM talent_requests
    WHERE deleted_at IS NULL
      AND created_at >= DATE '2026-06-03'
)
SELECT
    coalesce(tu.not_selected_reason, '(not recorded)') AS not_selected_reason,
    count(*) AS candidates,
    round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_of_not_selected
FROM talent_request_tracked_users tu
JOIN requests r ON r.id = tu.talent_request_id
WHERE tu.selection_decision = 'NOT_SELECTED'
GROUP BY tu.not_selected_reason
ORDER BY candidates DESC, not_selected_reason;
