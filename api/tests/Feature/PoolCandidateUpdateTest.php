<?php

use App\Enums\CandidateRemovalReason;
use App\Enums\EducationRequirementOption;
use App\Enums\PoolCandidateStatus;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class PoolCandidateUpdateTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use WithFaker;

    protected $guestUser;

    protected $applicantUser;

    protected $candidateUser;

    protected $poolOperatorUser;

    protected $requestResponderUser;

    protected $adminUser;

    protected $team;

    protected $teamPool;

    protected $poolCandidate;

    protected $unauthorizedMessage = 'This action is unauthorized.';

    protected $removeMutationDocument =
        /** @lang GraphQL */
        '
        mutation removeTest($id: UUID!, $removalReason: CandidateRemovalReason!, $removalReasonOther: String) {
            removeCandidate (
                id: $id,
                removalReason: $removalReason,
                removalReasonOther: $removalReasonOther
            ){
                status
                removedAt
                removalReason
                removalReasonOther
            }
        }
    ';

    protected $reinstateMutationDocument =
        /** @lang GraphQL */
        '
        mutation reinstateTest($id: UUID!) {
            reinstateCandidate (id: $id){
                status
                removedAt
                removalReason
                removalReasonOther
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $baseRoles = ['guest', 'base_user', 'applicant'];

        $this->guestUser = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->poolOperatorUser = User::factory()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'pool-operator-user@test.com',
                'sub' => 'pool-operator-user@test.com',
            ]);

        $this->requestResponderUser = User::factory()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->candidateUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'candidate-user@test.com',
                'sub' => 'candidate-user@test.com',
            ]);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->teamPool->id,
        ]);
    }

    /**
     * Test owner can update draft application
     *
     * @return void
     */
    public function testUpdateDraft()
    {
        // update draft application by updating submitted steps
        $mut =
            /** @lang GraphQL */
            '
            mutation($id: ID!) {
                updateApplication (
                    id: $id
                    application: {insertSubmittedStep: WELCOME}
                ) {
                    submittedSteps
                }
            }
        ';

        // set candidate to draft with no steps
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->submitted_steps = [];
        $this->poolCandidate->save();

        // candidate owner can add a step
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'data' => [
                    'updateApplication' => [
                        'submittedSteps' => ['WELCOME'],
                    ],
                ],
            ]);

        // guest can't add a step
        $this->actingAs($this->guestUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);

        // other applicant can't add a step
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);

        // pool operator can't add a step
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);

        // pool operator can't add a step
        $this->actingAs($this->requestResponderUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);

        // admin can't add a step
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);
    }

    public function testEducationRequirementExperience(): void
    {
        $updateApplication =
            /** @lang GraphQL */
            '
            mutation updateApplication($id: ID!, $application: UpdateApplicationInput!) {
                updateApplication(id: $id, application: $application) {
                    id
                    educationRequirementOption
                    educationRequirementExperiences {
                        id
                    }
                }
            }
        ';

        Skill::factory()->count(5)->create();
        EducationExperience::factory()->count(3)->create(['user_id' => $this->poolCandidate->user_id]);
        CommunityExperience::factory()->count(3)->create(['user_id' => $this->poolCandidate->user_id]);
        $communityExperienceIds = CommunityExperience::all()->pluck('id')->toArray();
        $educationExperienceIds = EducationExperience::all()->pluck('id')->toArray();
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->education_requirement_option = null;
        $this->poolCandidate->save();

        // assert educationRequirementOption updated and that an education experience is successfully connected
        $response = $this->actingAs($this->candidateUser, 'api')->graphQL($updateApplication, [
            'id' => $this->poolCandidate->id,
            'application' => [
                'educationRequirementOption' => EducationRequirementOption::EDUCATION->name,
                'educationRequirementExperiences' => [
                    'sync' => [$educationExperienceIds[0]],
                ],
            ],
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => EducationRequirementOption::EDUCATION->name]);
        $response->assertJsonFragment([
            ['id' => $educationExperienceIds[0]],
        ]);

        // assert educationRequirementOption updated again, education experience was disconnected, and 3 community experiences synced
        $response = $this->actingAs($this->candidateUser, 'api')->graphQL($updateApplication, [
            'id' => $this->poolCandidate->id,
            'application' => [
                'educationRequirementOption' => EducationRequirementOption::APPLIED_WORK->name,
                'educationRequirementExperiences' => [
                    'sync' => $communityExperienceIds,
                ],
            ],
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => EducationRequirementOption::APPLIED_WORK->name]);
        $response->assertJsonMissing([
            ['id' => $educationExperienceIds[0]],
        ]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[0]]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[1]]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[2]]);
        $experiencesAttached = $response->json('data.updateApplication.educationRequirementExperiences');
        assertEquals(3, count($experiencesAttached));
    }

    public function testPoolCandidateRemoval(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
            'user_id' => $this->applicantUser->id,
        ]);

        $variables = [
            'id' => $candidate->id,
            'removalReason' => CandidateRemovalReason::OTHER->name,
            'removalReasonOther' => 'test reason',
        ];

        // Applicant can't remove their own application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->removeMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Assert removing as admin succeeds
        $response = $this->actingAs($this->requestResponderUser, 'api')
            ->graphQL($this->removeMutationDocument, $variables)
            ->assertSuccessful();

        // New fields are updated correctly
        $response->assertJsonFragment([
            'removalReason' => CandidateRemovalReason::OTHER->name,
            'removalReasonOther' => 'test reason',
        ]);

        $removedAt = $response->json('data.removeCandidate.removedAt');

        $this->assertNotNull($removedAt);

        // Statuses are updated correctly
        $statusTransformations = [
            PoolCandidateStatus::NEW_APPLICATION->name => PoolCandidateStatus::REMOVED->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name => PoolCandidateStatus::REMOVED->name,
            PoolCandidateStatus::SCREENED_IN->name => PoolCandidateStatus::REMOVED->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name => PoolCandidateStatus::REMOVED->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name => PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name => PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name => PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
            PoolCandidateStatus::EXPIRED->name => PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
        ];

        foreach ($statusTransformations as $initialStatus => $finalStatus) {
            $candidate = PoolCandidate::factory()->create([
                'pool_candidate_status' => $initialStatus,
                'user_id' => $this->applicantUser->id,
            ]);

            $variables['id'] = $candidate->id;

            $this->actingAs($this->requestResponderUser, 'api')
                ->graphQL($this->removeMutationDocument, $variables)
                ->assertJsonFragment([
                    'status' => $finalStatus,
                ]);
        }

        // Invalid statuses throw an error
        $failingStatusToError = [
            PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name => 'RemoveCandidateAlreadyRemoved',
            PoolCandidateStatus::QUALIFIED_WITHDREW->name => 'RemoveCandidateAlreadyRemoved',
            PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name => 'RemoveCandidateAlreadyRemoved',
            PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name => 'RemoveCandidateAlreadyRemoved',
            PoolCandidateStatus::REMOVED->name => 'RemoveCandidateAlreadyRemoved',
            PoolCandidateStatus::PLACED_TENTATIVE->name => 'RemoveCandidateAlreadyPlaced',
            PoolCandidateStatus::PLACED_CASUAL->name => 'RemoveCandidateAlreadyPlaced',
            PoolCandidateStatus::PLACED_INDETERMINATE->name => 'RemoveCandidateAlreadyPlaced',
            PoolCandidateStatus::PLACED_TERM->name => 'RemoveCandidateAlreadyPlaced',
            PoolCandidateStatus::DRAFT->name => 'CandidateUnexpectedStatus',
            PoolCandidateStatus::DRAFT_EXPIRED->name => 'CandidateUnexpectedStatus',
        ];

        foreach ($failingStatusToError as $status => $error) {
            $candidate = PoolCandidate::factory()->create([
                'pool_candidate_status' => $status,
                'user_id' => $this->applicantUser->id,
            ]);

            $variables['id'] = $candidate->id;

            $this->actingAs($this->requestResponderUser, 'api')
                ->graphQL($this->removeMutationDocument, $variables)
                ->assertJson([
                    'errors' => [[
                        'message' => $error,
                    ]],
                ]);
        }
    }

    public function testPoolCandidateReinstatement(): void
    {
        // Create a removed candidate with all removed fields set
        $candidate = PoolCandidate::factory()->afterCreating(function (PoolCandidate $candidate) {
            $candidate->removed_at = now();
            $candidate->removal_reason = CandidateRemovalReason::OTHER->name;
            $candidate->removal_reason_other = 'test reason';
            $candidate->save();
        })->create([
            'pool_candidate_status' => PoolCandidateStatus::REMOVED->name,
            'user_id' => $this->applicantUser->id,
        ]);

        // Applicant can't reinstate their own application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Assert reinstating as admin succeeds
        $this->actingAs($this->requestResponderUser, 'api')
            ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
            ->assertSuccessful()
            ->assertJsonFragment([
                'removedAt' => null,
                'removalReason' => null,
                'removalReasonOther' => null,
            ]);

        // Statuses are updated correctly
        $statusTransformations = [
            PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name => PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name => PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_WITHDREW->name => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::REMOVED->name => PoolCandidateStatus::NEW_APPLICATION->name,
        ];

        foreach ($statusTransformations as $initialStatus => $finalStatus) {
            $candidate = PoolCandidate::factory()->create([
                'pool_candidate_status' => $initialStatus,
                'user_id' => $this->applicantUser->id,
            ]);

            $this->actingAs($this->requestResponderUser, 'api')
                ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
                ->assertJsonFragment([
                    'status' => $finalStatus,
                ]);
        }

        // Invalid statuses throw an error
        $statusesThatShouldFail = [
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::EXPIRED->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::PLACED_TERM->name,
            PoolCandidateStatus::DRAFT->name,
            PoolCandidateStatus::DRAFT_EXPIRED->name,
        ];

        foreach ($statusesThatShouldFail as $status) {
            $candidate = PoolCandidate::factory()->create([
                'pool_candidate_status' => $status,
                'user_id' => $this->applicantUser->id,
            ]);

            $this->actingAs($this->requestResponderUser, 'api')
                ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
                ->assertJson([
                    'errors' => [[
                        'message' => 'CandidateUnexpectedStatus',
                    ]],
                ]);
        }
    }
}
