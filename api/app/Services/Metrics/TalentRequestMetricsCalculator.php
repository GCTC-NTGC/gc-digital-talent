<?php

namespace App\Services\Metrics;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Computes the six talent request success metrics defined in
 * documentation/talent-request-success-metrics.sql.
 *
 * This class is the canonical implementation; the .sql file is kept as the
 * readable reference and the Power BI source. Nothing enforces that the two
 * agree, so a change here should be mirrored there.
 *
 * These queries are expensive — activity_log has no index on created_at or
 * event, so metrics 2 and 3 seq-scan it. Nothing should call this on the
 * request path; app:compute-platform-metrics runs it nightly and stores the
 * result in platform_metric_snapshots.
 */
class TalentRequestMetricsCalculator implements MetricsCalculator
{
    /**
     * Start of the reporting window: the date talent_request_tracked_users
     * shipped.
     *
     * Referral and selection data does not exist before this, so including
     * earlier requests would drag metrics 4-6 toward zero for reasons that have
     * nothing to do with performance. Metrics 1-3 could reach further back, but
     * one window for all six keeps them comparable.
     */
    public const WINDOW_START = '2026-06-03';

    public function key(): string
    {
        return 'talentRequests';
    }

    public function windowStart(): CarbonInterface
    {
        return CarbonImmutable::parse(self::WINDOW_START);
    }

    /**
     * Every metric, each split into an overall figure and a per-community
     * breakdown.
     *
     * @return array<string, mixed>
     */
    public function calculate(CarbonInterface $computedAt): array
    {
        return [
            'submittedRequests' => $this->submittedRequests(),
            'timeToReferralSent' => $this->timeToReferralSent(),
            'timeToCompletion' => $this->timeToCompletion($computedAt),
            'fulfillmentRate' => $this->fulfillmentRate(),
            'referralsPerRequest' => $this->referralsPerRequest(),
            'nonHireReasons' => $this->nonHireReasons(),
        ];
    }

    /**
     * Requests in the window, with their community attached.
     *
     * community_id is NOT NULL on talent_requests, so an inner join loses
     * nothing and a NULL community in a grouped result can only mean the
     * totals row.
     *
     * community_key is selected but never stored — it is only a stable
     * tiebreaker for ORDER BY, so equal-valued rows come back in a consistent
     * order rather than an arbitrary one.
     */
    private function requestsCte(): string
    {
        return <<<'SQL'
        requests AS (
            SELECT
                tr.id,
                tr.status,
                tr.completion_details,
                tr.was_empty,
                tr.created_at,
                c.id AS community_id,
                c.key AS community_key,
                c.name AS community_name
            FROM talent_requests tr
            JOIN communities c ON c.id = tr.community_id
            WHERE tr.deleted_at IS NULL
              AND tr.created_at >= CAST(? AS date)
        )
        SQL;
    }

    /**
     * Status and detail changes, one row per change.
     *
     * TalentRequest logs with logOnlyDirty(), so attribute_changes->'attributes'
     * holds only the columns that changed in that event — which is what makes
     * "first transition into X" a plain MIN(created_at).
     *
     * Only subject_type 'App\Models\TalentRequest' is read. app:sync-talent-requests
     * also copies legacy PoolCandidateSearchRequest rows under that subject
     * type, so reading both would double-count.
     */
    private function transitionsCte(string $column): string
    {
        return <<<SQL
        transitions AS (
            SELECT
                subject_id AS talent_request_id,
                created_at,
                attribute_changes->'attributes'->>'{$column}' AS new_value
            FROM activity_log
            WHERE subject_type = 'App\Models\TalentRequest'
              AND event = 'updated'
        )
        SQL;
    }

    /** 1. Number of submitted requests. */
    private function submittedRequests(): array
    {
        $sql = 'WITH '.$this->requestsCte().<<<'SQL'

        SELECT
            grouping(community_id) AS is_total,
            community_id,
            community_key,
            community_name,
            count(*) AS submitted_requests,
            count(*) FILTER (WHERE was_empty) AS submitted_with_no_matches,
            count(*) FILTER (WHERE status = 'NEW') AS status_new,
            count(*) FILTER (WHERE status = 'IN_PROGRESS') AS status_in_progress,
            count(*) FILTER (WHERE status = 'COMPLETED') AS status_completed
        FROM requests
        GROUP BY GROUPING SETS ((community_id, community_key, community_name), ())
        ORDER BY is_total, submitted_requests DESC, community_key
        SQL;

        return $this->split(DB::select($sql, [self::WINDOW_START]), fn (object $row): array => [
            'submittedRequests' => (int) $row->submitted_requests,
            'submittedWithNoMatches' => (int) $row->submitted_with_no_matches,
            'statusNew' => (int) $row->status_new,
            'statusInProgress' => (int) $row->status_in_progress,
            'statusCompleted' => (int) $row->status_completed,
        ]);
    }

    /**
     * 2. Median days from submission until talent was sent.
     *
     * FOLLOW_UP_SENT counts as well as TALENT_SENT: a follow-up definitively
     * implies talent already went out, so accepting only TALENT_SENT would drop
     * every request where an admin skipped straight to following up.
     */
    private function timeToReferralSent(): array
    {
        $sql = 'WITH '.$this->requestsCte().','.$this->transitionsCte('in_progress_details').<<<'SQL'
        ,
        referral_sent AS (
            SELECT
                talent_request_id,
                min(created_at) AS referral_sent_at
            FROM transitions
            WHERE new_value IN ('TALENT_SENT', 'FOLLOW_UP_SENT')
            GROUP BY talent_request_id
        )
        SELECT
            grouping(r.community_id) AS is_total,
            r.community_id,
            r.community_key,
            r.community_name,
            round(percentile_cont(0.5) WITHIN GROUP (
                ORDER BY extract(EPOCH FROM (rs.referral_sent_at - r.created_at)) / 86400.0
            )::numeric, 1) AS median_days_to_referral_sent,
            count(rs.talent_request_id) AS requests_with_referral_sent,
            count(*) AS total_requests
        FROM requests r
        LEFT JOIN referral_sent rs ON rs.talent_request_id = r.id
        GROUP BY GROUPING SETS ((r.community_id, r.community_key, r.community_name), ())
        ORDER BY is_total, median_days_to_referral_sent DESC NULLS LAST, r.community_key
        SQL;

        return $this->split(DB::select($sql, [self::WINDOW_START]), fn (object $row): array => [
            // Null when nothing in this group ever reached the state. Read it
            // against requestsWithReferralSent — a median over two of fifty
            // requests describes a fast-moving minority, not the cohort.
            'medianDaysToReferralSent' => $this->nullableFloat($row->median_days_to_referral_sent),
            'requestsWithReferralSent' => (int) $row->requests_with_referral_sent,
            'totalRequests' => (int) $row->total_requests,
        ]);
    }

    /**
     * 3. Median days from submission until the request completed.
     *
     * Duplicate and non-compliant requests are excluded so this agrees with the
     * fulfillment denominator in metric 4.
     */
    private function timeToCompletion(CarbonInterface $computedAt): array
    {
        $sql = 'WITH '.$this->requestsCte().','.$this->transitionsCte('status').<<<'SQL'
        ,
        completed AS (
            SELECT
                talent_request_id,
                min(created_at) AS completed_at
            FROM transitions
            WHERE new_value = 'COMPLETED'
            GROUP BY talent_request_id
        ),
        durations AS (
            SELECT
                r.community_id,
                r.community_key,
                r.community_name,
                r.status,
                extract(EPOCH FROM (c.completed_at - r.created_at)) / 86400.0 AS days_to_completion,
                extract(EPOCH FROM (CAST(? AS timestamp) - r.created_at)) / 86400.0 AS days_open
            FROM requests r
            LEFT JOIN completed c ON c.talent_request_id = r.id
            WHERE r.completion_details IS NULL
               OR r.completion_details NOT IN ('DUPLICATE_REQUEST', 'NON_COMPLIANT')
        )
        SELECT
            grouping(community_id) AS is_total,
            community_id,
            community_key,
            community_name,
            round(percentile_cont(0.5) WITHIN GROUP (
                ORDER BY days_to_completion
            )::numeric, 1) AS median_days_to_completion,
            count(days_to_completion) AS completions_measured,
            count(*) FILTER (WHERE status = 'COMPLETED') AS completed_requests,
            count(*) FILTER (WHERE status <> 'COMPLETED') AS still_open,
            round(percentile_cont(0.5) WITHIN GROUP (
                ORDER BY CASE WHEN status <> 'COMPLETED' THEN days_open END
            )::numeric, 1) AS median_age_of_open_requests
        FROM durations
        GROUP BY GROUPING SETS ((community_id, community_key, community_name), ())
        ORDER BY is_total, median_days_to_completion DESC NULLS LAST, community_key
        SQL;

        $bindings = [self::WINDOW_START, $computedAt->toDateTimeString()];

        return $this->split(DB::select($sql, $bindings), fn (object $row): array => [
            'medianDaysToCompletion' => $this->nullableFloat($row->median_days_to_completion),
            'completionsMeasured' => (int) $row->completions_measured,
            'completedRequests' => (int) $row->completed_requests,
            // A median over completions alone is biased toward fast ones: a
            // request open for a year contributes nothing until it closes.
            // These two make that bias visible rather than hiding it.
            'stillOpen' => (int) $row->still_open,
            'medianAgeOfOpenRequests' => $this->nullableFloat($row->median_age_of_open_requests),
        ]);
    }

    /**
     * 4. Share of completed requests closed as a hire.
     *
     * Grouped over every request rather than only completed ones, so a
     * community with no completions reports zeros instead of dropping out of
     * the breakdown entirely.
     */
    private function fulfillmentRate(): array
    {
        $sql = 'WITH '.$this->requestsCte().<<<'SQL'
        ,
        classified AS (
            SELECT
                community_id,
                community_key,
                community_name,
                completion_details,
                status = 'COMPLETED' AS is_completed,
                -- Eligible for the denominator: a completed request we actually
                -- tried to fill. NO_LONGER_REQUIRED and the rest stay in; they
                -- were genuine attempts that did not end in a hire.
                status = 'COMPLETED'
                    AND (completion_details IS NULL
                         OR completion_details NOT IN ('DUPLICATE_REQUEST', 'NON_COMPLIANT')) AS is_eligible
            FROM requests
        )
        SELECT
            grouping(community_id) AS is_total,
            community_id,
            community_key,
            community_name,
            count(*) FILTER (WHERE is_eligible AND completion_details = 'HIRE_MADE') AS hires,
            count(*) FILTER (WHERE is_eligible) AS eligible_completions,
            round(
                100.0 * count(*) FILTER (WHERE is_eligible AND completion_details = 'HIRE_MADE')
                / nullif(count(*) FILTER (WHERE is_eligible), 0), 1
            ) AS fulfillment_rate_pct,
            count(*) FILTER (WHERE is_eligible AND completion_details IS NULL) AS completed_without_detail,
            count(*) FILTER (WHERE is_completed AND NOT is_eligible) AS excluded_from_denominator
        FROM classified
        GROUP BY GROUPING SETS ((community_id, community_key, community_name), ())
        ORDER BY is_total, fulfillment_rate_pct DESC NULLS LAST, community_key
        SQL;

        return $this->split(DB::select($sql, [self::WINDOW_START]), fn (object $row): array => [
            'hires' => (int) $row->hires,
            'eligibleCompletions' => (int) $row->eligible_completions,
            // Null rather than zero when there is no denominator — "no
            // completions yet" is not a 0% fulfillment rate.
            'fulfillmentRatePct' => $this->nullableFloat($row->fulfillment_rate_pct),
            // Sits in the denominator but can never be in the numerator, so a
            // large count here means the rate is understated.
            'completedWithoutDetail' => (int) $row->completed_without_detail,
            'excludedFromDenominator' => (int) $row->excluded_from_denominator,
        ]);
    }

    /**
     * 5. Tracked users per request, reviewed and referred.
     *
     * Selecting a candidate marks them referred first, so counting referrals by
     * referral_decision correctly includes selected candidates.
     */
    private function referralsPerRequest(): array
    {
        $sql = 'WITH '.$this->requestsCte().<<<'SQL'
        ,
        per_request AS (
            SELECT
                r.id,
                r.community_id,
                r.community_key,
                r.community_name,
                count(tu.id) AS reviewed,
                count(tu.id) FILTER (WHERE tu.referral_decision = 'REFERRED') AS referred
            FROM requests r
            LEFT JOIN talent_request_tracked_users tu ON tu.talent_request_id = r.id
            GROUP BY r.id, r.community_id, r.community_key, r.community_name
        )
        SELECT
            grouping(community_id) AS is_total,
            community_id,
            community_key,
            community_name,
            count(*) AS requests,
            count(*) FILTER (WHERE reviewed = 0) AS requests_with_no_tracked_users,
            round(avg(reviewed), 2) AS mean_reviewed_per_request,
            round(percentile_cont(0.5) WITHIN GROUP (ORDER BY reviewed)::numeric, 1) AS median_reviewed_per_request,
            round(avg(referred), 2) AS mean_referred_per_request,
            round(percentile_cont(0.5) WITHIN GROUP (ORDER BY referred)::numeric, 1) AS median_referred_per_request,
            sum(reviewed) AS total_reviewed,
            sum(referred) AS total_referred,
            round(100.0 * sum(referred) / nullif(sum(reviewed), 0), 1) AS referred_share_of_reviewed_pct
        FROM per_request
        GROUP BY GROUPING SETS ((community_id, community_key, community_name), ())
        ORDER BY is_total, total_referred DESC, community_key
        SQL;

        return $this->split(DB::select($sql, [self::WINDOW_START]), fn (object $row): array => [
            'requests' => (int) $row->requests,
            // Candidates matching a request are computed live from the applicant
            // filter; only users an admin acts on get a tracked row. So this
            // counts requests nobody worked in the tool, not requests with no
            // matches — it is an adoption signal, and metrics 5 and 6 mean
            // little until it is low.
            'requestsWithNoTrackedUsers' => (int) $row->requests_with_no_tracked_users,
            'meanReviewedPerRequest' => $this->nullableFloat($row->mean_reviewed_per_request),
            'medianReviewedPerRequest' => $this->nullableFloat($row->median_reviewed_per_request),
            'meanReferredPerRequest' => $this->nullableFloat($row->mean_referred_per_request),
            'medianReferredPerRequest' => $this->nullableFloat($row->median_referred_per_request),
            'totalReviewed' => (int) $row->total_reviewed,
            'totalReferred' => (int) $row->total_referred,
            'referredShareOfReviewedPct' => $this->nullableFloat($row->referred_share_of_reviewed_pct),
        ]);
    }

    /**
     * 6. Why referred candidates were not hired.
     *
     * A null reason means the field was never filled in, which is different
     * from the NO_REASON enum value an admin deliberately chose. They are kept
     * apart because collapsing them would hide non-adoption as a decision.
     *
     * Unlike the other five, a community with no NOT_SELECTED candidates simply
     * has no rows here — there is no breakdown to show.
     *
     * @return array<string, mixed>
     */
    private function nonHireReasons(): array
    {
        $sql = 'WITH '.$this->requestsCte().<<<'SQL'
        ,
        not_selected AS (
            SELECT
                r.community_id,
                r.community_key,
                r.community_name,
                tu.not_selected_reason
            FROM talent_request_tracked_users tu
            JOIN requests r ON r.id = tu.talent_request_id
            WHERE tu.selection_decision = 'NOT_SELECTED'
        ),
        grouped AS (
            SELECT
                grouping(community_id) AS is_total,
                community_id,
                community_key,
                community_name,
                not_selected_reason,
                count(*) AS candidates
            FROM not_selected
            GROUP BY GROUPING SETS ((community_id, community_key, community_name, not_selected_reason), (not_selected_reason))
        )
        SELECT
            is_total,
            community_id,
            community_key,
            community_name,
            not_selected_reason,
            candidates,
            round(100.0 * candidates / sum(candidates) OVER (PARTITION BY is_total, community_id), 1) AS pct_of_not_selected
        FROM grouped
        ORDER BY is_total, community_key, candidates DESC, not_selected_reason
        SQL;

        $overall = [];
        $byCommunity = [];

        foreach (DB::select($sql, [self::WINDOW_START]) as $row) {
            $reason = [
                'reason' => $row->not_selected_reason,
                'candidates' => (int) $row->candidates,
                'pctOfNotSelected' => $this->nullableFloat($row->pct_of_not_selected),
            ];

            if ((int) $row->is_total === 1) {
                $overall[] = $reason;

                continue;
            }

            $key = $row->community_id;
            $byCommunity[$key] ??= [
                'community' => $this->community($row),
                'values' => ['reasons' => []],
            ];
            $byCommunity[$key]['values']['reasons'][] = $reason;
        }

        return [
            'overall' => ['reasons' => $overall],
            'byCommunity' => array_values($byCommunity),
        ];
    }

    /**
     * Split GROUPING SETS output into the totals row and the per-community rows.
     *
     * The empty grouping set always produces exactly one row, even over no
     * input, so `overall` is never missing for metrics 1-5.
     *
     * @param  array<int, object>  $rows
     * @param  callable(object): array<string, mixed>  $values
     * @return array<string, mixed>
     */
    private function split(array $rows, callable $values): array
    {
        $overall = null;
        $byCommunity = [];

        foreach ($rows as $row) {
            if ((int) $row->is_total === 1) {
                $overall = $values($row);

                continue;
            }

            $byCommunity[] = [
                'community' => $this->community($row),
                'values' => $values($row),
            ];
        }

        return [
            'overall' => $overall,
            'byCommunity' => $byCommunity,
        ];
    }

    /**
     * The community identity copied into the snapshot.
     *
     * Stored rather than joined at read time so the snapshot is a
     * self-contained historical record: a later rename does not rewrite past
     * numbers. The id is kept so a row can still be linked back to the live
     * community, accepting that it may no longer resolve.
     *
     * @return array<string, mixed>
     */
    private function community(object $row): array
    {
        return [
            'id' => $row->community_id,
            'name' => json_decode($row->community_name, true),
        ];
    }

    /** Keep "no value" distinct from zero — an absent median is not a median of 0. */
    private function nullableFloat(mixed $value): ?float
    {
        return $value === null ? null : (float) $value;
    }
}
