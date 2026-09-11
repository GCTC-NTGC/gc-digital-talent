<?php

namespace Tests\Feature;

use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestStatus;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Models\Community;
use App\Models\PlatformMetricSnapshot;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Services\Metrics\PlatformMetricsCollector;
use App\Services\Metrics\TalentRequestMetricsCalculator;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Covers the six talent request success metrics.
 *
 * The fixture is deliberately hand-built rather than faked: these metrics turn
 * on exact timestamps and on which rows are excluded, and random data cannot
 * assert a median.
 *
 * Three communities, each carrying a different shape of result, so that a bug
 * which ignored the community grouping — returning the overall figure for every
 * community, say — cannot pass:
 *
 *   digital  four requests, two genuine completions, one of them a hire
 *   atip     three requests, two genuine completions, no hires
 *   finance  one open request, nothing else
 *
 * Every per-community expectation below therefore differs from the overall one.
 */
class PlatformMetricsTest extends TestCase
{
    use RefreshDatabase;

    protected Community $digital;

    protected Community $atip;

    protected Community $finance;

    /** Treated as "now" by the calculator, so open-request ages are deterministic. */
    protected Carbon $computedAt;

    protected TalentRequest $hired;

    protected TalentRequest $noLongerRequired;

    protected TalentRequest $stillOpen;

    protected TalentRequest $duplicate;

    protected TalentRequest $atipNoCandidates;

    protected TalentRequest $atipUnresponsive;

    protected TalentRequest $atipOpen;

    protected TalentRequest $financeOpen;

    protected function setUp(): void
    {
        parent::setUp();

        // UserFactory assigns roles, so the role tables have to exist.
        $this->seed(RolePermissionSeeder::class);

        // The observer emails a confirmation on create; nothing here needs it.
        Notification::fake();

        $this->computedAt = Carbon::parse('2026-07-10 09:00:00');

        $this->digital = Community::factory()->create([
            'key' => 'digital',
            'name' => ['en' => 'Digital Community', 'fr' => 'Communauté numérique'],
        ]);
        $this->atip = Community::factory()->create([
            'key' => 'atip',
            'name' => ['en' => 'ATIP Community', 'fr' => 'Communauté AIPRP'],
        ]);
        $this->finance = Community::factory()->create([
            'key' => 'finance',
            'name' => ['en' => 'Finance Community', 'fr' => 'Communauté des finances'],
        ]);

        $this->digitalRequests();
        $this->atipRequests();

        // One open request and nothing else — the community that must still be
        // reported despite having no completions and no tracked users.
        $this->financeOpen = $this->request($this->finance, '2026-06-25 09:00:00');

        // Before the window opens, so it must not appear anywhere. Deliberately a
        // hire, so leaking it in would move the fulfillment rate.
        $outOfWindow = $this->request($this->digital, '2026-05-01 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::HIRE_MADE->name,
        ]);
        $this->transition($outOfWindow, ['status' => 'COMPLETED'], '2026-05-02 09:00:00');

        $this->trackedUsers();
    }

    public function testCountsSubmittedRequests(): void
    {
        $metric = $this->metric('submittedRequests');

        $this->assertSame([
            'submittedRequests' => 8,
            'submittedWithNoMatches' => 1,
            'statusNew' => 3,
            'statusInProgress' => 0,
            'statusCompleted' => 5,
        ], $metric['overall']);

        $this->assertSame(4, $this->community($metric, $this->digital)['submittedRequests']);
        $this->assertSame(3, $this->community($metric, $this->atip)['submittedRequests']);
        $this->assertSame(1, $this->community($metric, $this->finance)['submittedRequests']);

        // Only ATIP submitted a request that matched nobody.
        $this->assertSame(0, $this->community($metric, $this->digital)['submittedWithNoMatches']);
        $this->assertSame(1, $this->community($metric, $this->atip)['submittedWithNoMatches']);
    }

    public function testMedianTimeToReferralSentAcceptsFollowUpSent(): void
    {
        $metric = $this->metric('timeToReferralSent');

        // Overall spans all four: 2, 4, 6 and 8 days.
        $this->assertSame(5.0, $metric['overall']['medianDaysToReferralSent']);
        $this->assertSame(4, $metric['overall']['requestsWithReferralSent']);
        $this->assertSame(8, $metric['overall']['totalRequests']);

        // Digital's 6-day figure comes from a request that only ever reached
        // FOLLOW_UP_SENT, and its 2-day figure from one whose later follow-up
        // must not displace the earlier TALENT_SENT.
        $this->assertSame(4.0, $this->community($metric, $this->digital)['medianDaysToReferralSent']);
        $this->assertSame(6.0, $this->community($metric, $this->atip)['medianDaysToReferralSent']);

        // Finance never sent talent, so it has no median but still reports its total.
        $finance = $this->community($metric, $this->finance);
        $this->assertNull($finance['medianDaysToReferralSent']);
        $this->assertSame(0, $finance['requestsWithReferralSent']);
        $this->assertSame(1, $finance['totalRequests']);
    }

    public function testMedianTimeToCompletionExcludesDuplicatesAndReportsOpenAge(): void
    {
        $metric = $this->metric('timeToCompletion');

        // Completions are 10, 12, 16 and 20 days. The duplicate closed after one
        // day is excluded — including it would drag the overall median to 12.
        $this->assertSame(14.0, $metric['overall']['medianDaysToCompletion']);
        $this->assertSame(4, $metric['overall']['completionsMeasured']);
        $this->assertSame(4, $metric['overall']['completedRequests']);

        $this->assertSame(15.0, $this->community($metric, $this->digital)['medianDaysToCompletion']);
        $this->assertSame(14.0, $this->community($metric, $this->atip)['medianDaysToCompletion']);
        $this->assertNull($this->community($metric, $this->finance)['medianDaysToCompletion']);

        // Open requests are 30, 20 and 15 days old.
        $this->assertSame(3, $metric['overall']['stillOpen']);
        $this->assertSame(20.0, $metric['overall']['medianAgeOfOpenRequests']);
        $this->assertSame(30.0, $this->community($metric, $this->digital)['medianAgeOfOpenRequests']);
        $this->assertSame(20.0, $this->community($metric, $this->atip)['medianAgeOfOpenRequests']);
        $this->assertSame(15.0, $this->community($metric, $this->finance)['medianAgeOfOpenRequests']);
    }

    public function testFulfillmentRate(): void
    {
        $metric = $this->metric('fulfillmentRate');

        // One hire out of four genuine attempts; the duplicate is excluded.
        $this->assertSame(1, $metric['overall']['hires']);
        $this->assertSame(4, $metric['overall']['eligibleCompletions']);
        $this->assertSame(25.0, $metric['overall']['fulfillmentRatePct']);
        $this->assertSame(1, $metric['overall']['excludedFromDenominator']);
        $this->assertSame(0, $metric['overall']['completedWithoutDetail']);

        // Same number of attempts either side, different outcomes — so a rate
        // computed without regard to community would be visibly wrong.
        $this->assertSame(50.0, $this->community($metric, $this->digital)['fulfillmentRatePct']);
        $this->assertSame(0.0, $this->community($metric, $this->atip)['fulfillmentRatePct']);

        // Requests closed for reasons other than a hire still count as attempts.
        $this->assertSame(2, $this->community($metric, $this->atip)['eligibleCompletions']);
        $this->assertSame(0, $this->community($metric, $this->atip)['hires']);
    }

    /**
     * Regression: an earlier version filtered to completed requests before
     * grouping, which made a community with no completions vanish from the
     * breakdown rather than reading zero.
     */
    public function testCommunityWithNoCompletionsStillAppearsInFulfillmentRate(): void
    {
        $finance = $this->community($this->metric('fulfillmentRate'), $this->finance);

        $this->assertNotNull($finance, 'a community with no completions must still be reported');
        $this->assertSame(0, $finance['hires']);
        $this->assertSame(0, $finance['eligibleCompletions']);
        // Null, not zero: no completions is not a 0% fulfillment rate. ATIP is
        // the genuine 0.0 — the two must not collapse into each other.
        $this->assertNull($finance['fulfillmentRatePct']);
    }

    public function testReferralsPerRequest(): void
    {
        $metric = $this->metric('referralsPerRequest');

        $this->assertSame(8, $metric['overall']['requests']);
        // Two digital requests, one atip and one finance were never worked.
        $this->assertSame(4, $metric['overall']['requestsWithNoTrackedUsers']);
        $this->assertSame(8, $metric['overall']['totalReviewed']);
        // A selected candidate is also a referred one.
        $this->assertSame(6, $metric['overall']['totalReferred']);
        $this->assertSame(75.0, $metric['overall']['referredShareOfReviewedPct']);

        $digital = $this->community($metric, $this->digital);
        $this->assertSame(5, $digital['totalReviewed']);
        $this->assertSame(4, $digital['totalReferred']);
        $this->assertSame(1.25, $digital['meanReviewedPerRequest']);
        $this->assertSame(80.0, $digital['referredShareOfReviewedPct']);

        // ATIP reviewed three candidates but referred only two of them.
        $atip = $this->community($metric, $this->atip);
        $this->assertSame(3, $atip['totalReviewed']);
        $this->assertSame(2, $atip['totalReferred']);
        $this->assertSame(0.67, $atip['meanReferredPerRequest']);
        $this->assertSame(66.7, $atip['referredShareOfReviewedPct']);

        // Nothing reviewed at all, so there is no share to report.
        $finance = $this->community($metric, $this->finance);
        $this->assertSame(1, $finance['requestsWithNoTrackedUsers']);
        $this->assertSame(0, $finance['totalReviewed']);
        $this->assertNull($finance['referredShareOfReviewedPct']);
    }

    public function testNonHireReasonsSeparatesNoReasonFromNotRecorded(): void
    {
        $metric = $this->metric('nonHireReasons');

        $overall = $this->reasons($metric['overall']);

        $this->assertSame(2, $overall[TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name]['candidates']);
        $this->assertSame(40.0, $overall[TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name]['pctOfNotSelected']);

        // NO_REASON is a choice the admin made; a null reason means the field was
        // never filled in. Collapsing them would hide non-adoption as a decision.
        $this->assertSame(1, $overall[TalentRequestTrackedUserNotSelectedReason::NO_REASON->name]['candidates']);
        $this->assertSame(1, $overall['NOT_RECORDED']['candidates']);
        $this->assertNull($overall['NOT_RECORDED']['reason']);
    }

    public function testNonHireReasonsAreSlicedByCommunity(): void
    {
        $metric = $this->metric('nonHireReasons');

        // Percentages are within the community, so each breakdown sums to 100.
        $digital = $this->reasons($this->community($metric, $this->digital));
        $this->assertSame(
            [TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name, 'NO_REASON', 'NOT_RECORDED'],
            array_keys($digital)
        );
        $this->assertSame(33.3, $digital[TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name]['pctOfNotSelected']);

        $atip = $this->reasons($this->community($metric, $this->atip));
        $this->assertSame(50.0, $atip[TalentRequestTrackedUserNotSelectedReason::REQUIREMENT_MISMATCH->name]['pctOfNotSelected']);
        $this->assertSame(50.0, $atip[TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name]['pctOfNotSelected']);

        // Unlike the other five metrics, a community with nothing to break down
        // produces no rows at all rather than a row of zeros.
        $this->assertNull($this->community($metric, $this->finance));
    }

    public function testExcludesRequestsSubmittedBeforeTheWindow(): void
    {
        // Nine requests exist; only the eight inside the window are counted, and
        // the excluded one was a hire that would otherwise change every metric.
        $this->assertSame(9, TalentRequest::count());
        $this->assertSame(8, $this->metric('submittedRequests')['overall']['submittedRequests']);
        $this->assertSame(1, $this->metric('fulfillmentRate')['overall']['hires']);
    }

    public function testExcludesSoftDeletedRequests(): void
    {
        $this->stillOpen->delete();

        $metric = $this->metric('submittedRequests');
        $this->assertSame(7, $metric['overall']['submittedRequests']);
        $this->assertSame(2, $metric['overall']['statusNew']);
        $this->assertSame(3, $this->community($metric, $this->digital)['submittedRequests']);
    }

    public function testCollectorKeysEachGroupAndCarriesItsOwnWindow(): void
    {
        $metrics = app(PlatformMetricsCollector::class)->collect($this->computedAt);

        // Groups are keyed by the calculator, so adding one is additive rather
        // than a change to the surrounding structure.
        $this->assertSame(['talentRequests'], array_keys($metrics));

        // The window belongs to the group, not the snapshot.
        $this->assertSame(
            TalentRequestMetricsCalculator::WINDOW_START,
            $metrics['talentRequests']['windowStart']
        );
        $this->assertArrayHasKey('submittedRequests', $metrics['talentRequests']);
    }

    public function testCommandWritesAVersionedSnapshot(): void
    {
        $this->artisan('app:compute-platform-metrics')->assertSuccessful();

        $snapshot = PlatformMetricSnapshot::latestReadable();

        $this->assertNotNull($snapshot);
        $this->assertSame(PlatformMetricSnapshot::SHAPE_VERSION, $snapshot->version);

        $talentRequests = $snapshot->metrics['talentRequests'];
        $this->assertSame(TalentRequestMetricsCalculator::WINDOW_START, $talentRequests['windowStart']);
        $this->assertSame(8, $talentRequests['submittedRequests']['overall']['submittedRequests']);
        $this->assertCount(3, $talentRequests['submittedRequests']['byCommunity']);

        // Community identity is copied in, so the snapshot stands alone.
        $community = $talentRequests['submittedRequests']['byCommunity'][0]['community'];
        $this->assertSame(['id', 'name'], array_keys($community));
        $this->assertSame(['en', 'fr'], array_keys($community['name']));
    }

    public function testLatestReadableIgnoresSnapshotsOfAnUnknownShape(): void
    {
        $this->artisan('app:compute-platform-metrics')->assertSuccessful();

        // A newer snapshot written by code with a different shape must not be
        // handed to a caller that cannot map it.
        PlatformMetricSnapshot::create([
            'version' => PlatformMetricSnapshot::SHAPE_VERSION + 1,
            'computed_at' => Carbon::now()->addDay(),
            'metrics' => ['somethingElse' => true],
        ]);

        $this->assertSame(
            PlatformMetricSnapshot::SHAPE_VERSION,
            PlatformMetricSnapshot::latestReadable()->version
        );
    }

    /** Digital: two genuine completions, one a hire, plus an open and a duplicate. */
    private function digitalRequests(): void
    {
        // Referral sent on day 2, completed on day 10, closed as a hire.
        $this->hired = $this->request($this->digital, '2026-06-10 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::HIRE_MADE->name,
        ]);
        $this->transition($this->hired, ['in_progress_details' => 'TALENT_SENT'], '2026-06-12 09:00:00');
        // A later follow-up must not displace the earlier TALENT_SENT.
        $this->transition($this->hired, ['in_progress_details' => 'FOLLOW_UP_SENT'], '2026-06-18 09:00:00');
        $this->transition($this->hired, ['status' => 'COMPLETED'], '2026-06-20 09:00:00');

        // Never marked TALENT_SENT — only FOLLOW_UP_SENT, on day 6.
        $this->noLongerRequired = $this->request($this->digital, '2026-06-10 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::NO_LONGER_REQUIRED->name,
        ]);
        $this->transition($this->noLongerRequired, ['in_progress_details' => 'FOLLOW_UP_SENT'], '2026-06-16 09:00:00');
        $this->transition($this->noLongerRequired, ['status' => 'COMPLETED'], '2026-06-30 09:00:00');

        // Open for 30 days as at computedAt, with an edit that touched no status field.
        $this->stillOpen = $this->request($this->digital, '2026-06-10 09:00:00');
        $this->transition($this->stillOpen, ['admin_notes' => 'called them'], '2026-06-11 09:00:00');

        // Excluded from the completion median and the fulfillment denominator.
        $this->duplicate = $this->request($this->digital, '2026-06-10 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::DUPLICATE_REQUEST->name,
        ]);
        $this->transition($this->duplicate, ['status' => 'COMPLETED'], '2026-06-11 09:00:00');
    }

    /** ATIP: two genuine completions, neither a hire, plus an open request. */
    private function atipRequests(): void
    {
        // Referral sent on day 4, completed on day 12.
        $this->atipNoCandidates = $this->request($this->atip, '2026-06-15 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::NO_CANDIDATES_FOUND->name,
        ]);
        $this->transition($this->atipNoCandidates, ['in_progress_details' => 'TALENT_SENT'], '2026-06-19 09:00:00');
        $this->transition($this->atipNoCandidates, ['status' => 'COMPLETED'], '2026-06-27 09:00:00');

        // Referral sent on day 8, completed on day 16.
        $this->atipUnresponsive = $this->request($this->atip, '2026-06-15 09:00:00', [
            'status' => TalentRequestStatus::COMPLETED->name,
            'completion_details' => TalentRequestCompletionDetail::HIRING_MANAGER_NOT_RESPONSIVE->name,
        ]);
        $this->transition($this->atipUnresponsive, ['in_progress_details' => 'TALENT_SENT'], '2026-06-23 09:00:00');
        $this->transition($this->atipUnresponsive, ['status' => 'COMPLETED'], '2026-07-01 09:00:00');

        // Open for 20 days, and matched nobody when it was submitted.
        $this->atipOpen = $this->request($this->atip, '2026-06-20 09:00:00', ['was_empty' => true]);
    }

    /** Run the calculator and return one metric. */
    private function metric(string $name): array
    {
        $metrics = app(TalentRequestMetricsCalculator::class)->calculate($this->computedAt);

        return $metrics[$name];
    }

    /** The per-community entry's values, or null if the community is absent. */
    private function community(array $metric, Community $community): ?array
    {
        foreach ($metric['byCommunity'] as $entry) {
            if ($entry['community']['id'] === $community->id) {
                return $entry['values'];
            }
        }

        return null;
    }

    /** Reason breakdown keyed by reason name, with nulls under NOT_RECORDED. */
    private function reasons(array $values): array
    {
        return collect($values['reasons'])
            ->keyBy(fn (array $reason): string => $reason['reason'] ?? 'NOT_RECORDED')
            ->all();
    }

    private function request(Community $community, string $createdAt, array $attributes = []): TalentRequest
    {
        return TalentRequest::factory()->create(array_merge([
            'community_id' => $community->id,
            'created_at' => Carbon::parse($createdAt),
            'updated_at' => Carbon::parse($createdAt),
            'status' => TalentRequestStatus::NEW->name,
            'in_progress_details' => null,
            'completion_details' => null,
            'was_empty' => false,
        ], $attributes));
    }

    /**
     * Write an activity_log row in the shape spatie produces for an update.
     *
     * Inserted directly rather than driven through the model so the timestamps
     * are exact — the real rows are written whenever an admin happens to act.
     */
    private function transition(TalentRequest $request, array $changed, string $at): void
    {
        DB::table('activity_log')->insert([
            'id' => Str::uuid()->toString(),
            'log_name' => 'default',
            'description' => 'updated',
            'subject_type' => TalentRequest::class,
            'subject_id' => $request->id,
            'event' => 'updated',
            'properties' => null,
            'attribute_changes' => json_encode(['attributes' => $changed, 'old' => []]),
            'created_at' => Carbon::parse($at),
            'updated_at' => Carbon::parse($at),
        ]);
    }

    private function trackedUsers(): void
    {
        $referred = TalentRequestTrackedUserReferralDecision::REFERRED->name;
        $notReferred = TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name;
        $notSelected = TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name;

        // Digital's hired request: one selected, one rejected, one never referred.
        $this->trackedUser($this->hired, [
            'referral_decision' => $referred,
            'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
        ]);
        $this->trackedUser($this->hired, [
            'referral_decision' => $referred,
            'selection_decision' => $notSelected,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name,
        ]);
        $this->trackedUser($this->hired, ['referral_decision' => $notReferred]);

        // One rejected with a deliberate NO_REASON, one with the reason left blank.
        $this->trackedUser($this->noLongerRequired, [
            'referral_decision' => $referred,
            'selection_decision' => $notSelected,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::NO_REASON->name,
        ]);
        $this->trackedUser($this->noLongerRequired, [
            'referral_decision' => $referred,
            'selection_decision' => $notSelected,
            'not_selected_reason' => null,
        ]);

        // ATIP referred two candidates and rejected both, for different reasons.
        $this->trackedUser($this->atipNoCandidates, [
            'referral_decision' => $referred,
            'selection_decision' => $notSelected,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::REQUIREMENT_MISMATCH->name,
        ]);
        $this->trackedUser($this->atipNoCandidates, [
            'referral_decision' => $referred,
            'selection_decision' => $notSelected,
            'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::LACKS_EXPERIENCE->name,
        ]);

        // Reviewed but never referred, so it counts toward reviewed only.
        $this->trackedUser($this->atipUnresponsive, ['referral_decision' => $notReferred]);
    }

    private function trackedUser(TalentRequest $request, array $attributes): void
    {
        TalentRequestTrackedUser::factory()->create(array_merge([
            'talent_request_id' => $request->id,
            'user_id' => User::factory()->create()->id,
        ], $attributes));
    }
}
