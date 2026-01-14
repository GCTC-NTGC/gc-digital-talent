<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\CandidateInterest;
use App\Enums\CandidateRemovalReason;
use App\Enums\CandidateStatus;
use App\Enums\DisqualificationReason;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class CandidateFacingStatusTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected User $user;

    protected PoolCandidate $candidate;

    protected string $query = <<<'GRAPHQL'
        query CandidateStatusTestQuery($id: UUID!) {
            poolCandidate(id: $id) {
                candidateStatus {
                    value
                }
                candidateInterest {
                    value
                }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create();

        $this->candidate = PoolCandidate::factory()
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
                'user_id' => $this->user->id,
            ]);
    }

    #[DataProvider('candidateStatusProvider')]
    public function testCandidateStatus($expected, $attributes): void
    {
        foreach ($attributes as $k => $v) {
            $this->candidate->$k = $v;
        }

        $this->candidate->save();

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, ['id' => $this->candidate->id])
            ->assertJsonFragment([
                'candidateStatus' => [
                    'value' => $expected,
                ],
            ]);
    }

    #[DataProvider('candidateInterestProvider')]
    public function testCandidateInterest($expected, $attributes): void
    {

        foreach ($attributes as $k => $v) {
            $this->candidate->$k = $v;
        }

        $this->candidate->save();

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, ['id' => $this->candidate->id])
            ->assertJsonFragment([
                'candidateInterest' => [
                    'value' => $expected,
                ],
            ]);
    }

    public static function candidateStatusProvider()
    {
        $past = '2021-01-01 00:00:00';
        $future = '2050-01-01 00:00:00';

        $submitted = [
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            'submitted_at' => $past,
        ];

        $removed = [
            ...$submitted,
            'application_status' => ApplicationStatus::REMOVED->name,
            'removed_at' => $past,
            'screening_stage' => null,
        ];

        return [
            // Draft
            'draft (no expiry date)' => [CandidateStatus::DRAFT->name, [
                'application_status' => ApplicationStatus::DRAFT->name,
                'expiry_date' => null,
            ]],
            'draft (expiry date future)' => [CandidateStatus::DRAFT, [
                'application_status' => ApplicationStatus::DRAFT->name,
                'expiry_date' => $future,
            ]],
            'draft (expiry date past)' => [CandidateStatus::EXPIRED->name, [
                'application_status' => ApplicationStatus::DRAFT->name,
                'expiry_date' => $past,
            ]],

            // Submitted
            'screening stage (new application)' => [CandidateStatus::RECEIVED->name, [
                ...$submitted,
                'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
            ]],
            'screening stage (application review)' => [CandidateStatus::UNDER_REVIEW->name, [
                ...$submitted,
                'screening_stage' => ScreeningStage::APPLICATION_REVIEW->name,
            ]],
            'screening stage (screened in)' => [CandidateStatus::APPLICATION_REVIEWED->name, [
                ...$submitted,
                'screening_stage' => ScreeningStage::SCREENED_IN->name,
            ]],
            'screening stage (under assessment)' => [CandidateStatus::UNDER_ASSESSMENT->name, [
                ...$submitted,
                'screening_stage' => ScreeningStage::UNDER_ASSESSMENT->name,
            ]],

            // Disqualified
            'disqualified (application)' => [CandidateStatus::UNSUCCESSFUL->name,  [
                'application_status' => ApplicationStatus::DISQUALIFIED->name,
                'disqualification_reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                'screening_stage' => null,
            ]],
            'disqualified (assessment)' => [CandidateStatus::UNSUCCESSFUL->name, [
                'application_status' => ApplicationStatus::DISQUALIFIED->name,
                'disqualification_reason' => DisqualificationReason::SCREENED_OUT_ASSESSMENT->name,
                'screening_stage' => null,
            ]],

            // Removed
            'removed (withdrew)' => [CandidateStatus::WITHDREW->name, [
                ...$removed,
                'removal_reason' => CandidateRemovalReason::REQUESTED_TO_BE_WITHDRAWN->name,
            ]],
            'removed (not responsive)' => [CandidateStatus::NOT_RESPONSIVE->name, [
                ...$removed,
                'removal_reason' => CandidateRemovalReason::NOT_RESPONSIVE->name,
            ]],
            'removed (ineligible)' => [CandidateStatus::INELIGIBLE->name, [
                ...$removed,
                'removal_reason' => CandidateRemovalReason::INELIGIBLE->name,
            ]],
            'removed (other)' => [CandidateStatus::REMOVED->name, [
                ...$removed,
                'removal_reason' => CandidateRemovalReason::OTHER->name,
            ]],

            // Qualified
            'qualified (not placed)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => null,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::NOT_PLACED->name,
            ]],
            'qualified (under consideration)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => null,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::UNDER_CONSIDERATION->name,
            ]],
            'placed (tentative)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => $past,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::PLACED_TENTATIVE->name,
            ]],
            'placed (casual)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => $past,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::PLACED_CASUAL->name,
            ]],
            'placed (term)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => $past,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::PLACED_TERM->name,
            ]],
            'placed (indeterminate)' => [CandidateStatus::QUALIFIED->name, [
                'placed_at' => $past,
                'application_status' => ApplicationStatus::QUALIFIED->name,
                'placement_type' => PlacementType::PLACED_INDETERMINATE->name,
            ]],

        ];
    }

    public static function candidateInterestProvider()
    {
        $past = '2021-01-01 00:00:00';

        $default = [
            'submitted_at' => $past,
            'suspended_at' => null,
            'placed_at' => null,
            'removed_at' => null,
            'expiry_date' => null,
            'application_status' => ApplicationStatus::QUALIFIED->name,
        ];

        return [
            // Not interested
            'suspended' => [CandidateInterest::NOT_INTERESTED->name, [
                ...$default,
                'suspended_at' => $past,
            ]],

            // Expired
            'expired' => [CandidateInterest::EXPIRED->name, [
                ...$default,
                'expiry_date' => $past,
            ]],

            // Open to jobs
            'under consideration' => [CandidateInterest::OPEN_TO_JOBS->name, [
                ...$default,
                'placement_type' => PlacementType::UNDER_CONSIDERATION->name,
            ]],
            'placed tentative' => [CandidateInterest::OPEN_TO_JOBS->name, [
                ...$default,
                'placement_type' => PlacementType::PLACED_TENTATIVE->name,
            ]],

            // Hired
            'placed casual' => [CandidateInterest::HIRED->name, [
                ...$default,
                'placement_type' => PlacementType::PLACED_CASUAL->name,
            ]],
            'placed term' => [CandidateInterest::HIRED->name, [
                ...$default,
                'placement_type' => PlacementType::PLACED_TERM->name,
            ]],
            'placed indeterminate' => [CandidateInterest::HIRED->name, [
                ...$default,
                'placement_type' => PlacementType::PLACED_INDETERMINATE->name,
            ]],

        ];
    }
}
