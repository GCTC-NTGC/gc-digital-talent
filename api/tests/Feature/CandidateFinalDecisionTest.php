<?php

namespace Tests\Feature;

use App\Enums\FinalDecision;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CandidateFinalDecisionTest extends TestCase
{
    use RefreshDatabase;

    protected $candidate;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([RolePermissionSeeder::class]);

        $this->candidate = PoolCandidate::factory()->create([
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);

    }

    /**
     * @dataProvider statusProvider
     */
    public function testFinalDecisionComputation($status, $expected): void
    {

        $this->candidate->pool_candidate_status = $status;
        $decision = $this->candidate->computeFinalDecision();
        $this->assertEquals($expected, $decision);

    }

    /**
     * @dataProvider pendingStepProvider
     */
    public function testPendingFinalDecisionComputation($step, $overallStatus, $expected)
    {
        $this->candidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->candidate->computed_assessment_status = [
            'currentStep' => $step,
            'overallAssessmentStatus' => $overallStatus,
        ];
        $decision = $this->candidate->computeFinalDecision();
        $this->assertEquals($expected, $decision);
    }

    public static function pendingStepProvider()
    {
        return [
            'To assess step 1' => [1, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 50,
            ]],
            'To assess step 2' => [2, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 60,
            ]],
            'To assess step 3' => [3, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 70,
            ]],
            'To assess step 4' => [4, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 80,
            ]],
            'To assess step 5' => [5, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 90,
            ]],
            'To assess step 6' => [6, OverallAssessmentStatus::TO_ASSESS->name, [
                'decision' => FinalDecision::TO_ASSESS->name,
                'weight' => 100,
            ]],
            'Disqualified' => [1, OverallAssessmentStatus::DISQUALIFIED->name, [
                'decision' => FinalDecision::DISQUALIFIED_PENDING->name,
                'weight' => 200,
            ]],
            'Qualified' => [null, OverallAssessmentStatus::QUALIFIED->name, [
                'decision' => FinalDecision::QUALIFIED_PENDING->name,
                'weight' => 20,
            ]],
        ];
    }

    public static function statusProvider()
    {

        $qualified = [
            'decision' => FinalDecision::QUALIFIED->name,
            'weight' => 10,
        ];

        $toAssess = [
            'decision' => FinalDecision::TO_ASSESS->name,
            'weight' => 40,
        ];

        $qualifiedPlaced = [
            'decision' => FinalDecision::QUALIFIED_PLACED->name,
            'weight' => 30,
        ];

        $disqualified = [
            'decision' => FinalDecision::DISQUALIFIED->name,
            'weight' => 210,
        ];

        $qualifiedRemoved = [
            'decision' => FinalDecision::QUALIFIED_REMOVED->name,
            'weight' => 220,
        ];

        $toAssesRemoved = [
            'decision' => FinalDecision::TO_ASSESS_REMOVED->name,
            'weight' => 230,
        ];

        $removed = [
            'decision' => FinalDecision::REMOVED->name,
            'weight' => 240,
        ];

        $qualifiedExpired = [
            'decision' => FinalDecision::QUALIFIED_EXPIRED->name,
            'weight' => 250,
        ];

        return [
            // Qualified
            'Qualified available' => [PoolCandidateStatus::QUALIFIED_AVAILABLE->name, $qualified],
            // To assess
            'New application' => [PoolCandidateStatus::NEW_APPLICATION->name, $toAssess],
            'Application review' => [PoolCandidateStatus::APPLICATION_REVIEW->name, $toAssess],
            'Under assessment' => [PoolCandidateStatus::UNDER_ASSESSMENT->name, $toAssess],
            'Screened in' => [PoolCandidateStatus::SCREENED_IN->name, $toAssess],

            // Qualified - Placed
            'Placed casual' => [PoolCandidateStatus::PLACED_CASUAL->name, $qualifiedPlaced],
            'Placed indeterminate' => [PoolCandidateStatus::PLACED_INDETERMINATE->name, $qualifiedPlaced],
            'Placed term' => [PoolCandidateStatus::PLACED_TERM->name, $qualifiedPlaced],
            'Placed tentative' => [PoolCandidateStatus::PLACED_TENTATIVE->name, $qualifiedPlaced],

            // Disqualified
            'Screened out assessment' => [PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name, $disqualified],
            'Screened out application' => [PoolCandidateStatus::SCREENED_OUT_APPLICATION->name, $disqualified],

            // Qualified - Removed
            'Qualified unavailable' => [PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name, $qualifiedRemoved],
            'Qualified withdrew' => [PoolCandidateStatus::QUALIFIED_WITHDREW->name, $qualifiedRemoved],

            // To assess - Removed
            'Screened out not interested' => [PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name, $toAssesRemoved],
            'Screened out not responsive' => [PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name, $toAssesRemoved],

            // Removed
            'Removed' => [PoolCandidateStatus::REMOVED->name, $removed],

            // Qualified - Expired
            'Expired' => [PoolCandidateStatus::EXPIRED->name, $qualifiedExpired],
        ];
    }
}
