<?php

use App\Enums\DisqualificationReason;
use App\Enums\EducationRequirementOption;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Models\CommunityExperience;
use App\Models\Department;
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
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;

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

    protected $placeCandidateMutation;

    protected $revertPlaceCandidateMutation;

    protected $qualifyCandidateMutation;

    protected $disqualifyCandidateMutation;

    protected $revertFinalDecisionMutation;

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

        $this->placeCandidateMutation =
        /** @lang GraphQL */
        '
        mutation placeCandidate($id: UUID!, $placeCandidate: PlaceCandidateInput!) {
            placeCandidate(id: $id, placeCandidate: $placeCandidate) {
                id
                status
                placedAt
                placedDepartment {
                    id
                }
            }
        }
    ';

        $this->revertPlaceCandidateMutation =
        /** @lang GraphQL */
        '
        mutation revertPlaceCandidate($id: UUID!) {
            revertPlaceCandidate(id: $id) {
                id
                status
                placedAt
                placedDepartment {
                    id
                }
            }
        }
    ';

        $this->qualifyCandidateMutation =
        /** @lang GraphQL */
        '
        mutation qualifyCandidate($id: UUID!, $expiryDate: Date!) {
            qualifyCandidate(id: $id, expiryDate: $expiryDate) {
              id
              status
              expiryDate
              finalDecisionAt
            }
          }
    ';

        $this->disqualifyCandidateMutation =
        /** @lang GraphQL */
        '
        mutation disqualifyCandidate($id: UUID!, $reason: DisqualificationReason!) {
            disqualifyCandidate(id: $id, reason: $reason) {
              id
              status
              finalDecisionAt
            }
          }
    ';

        $this->revertFinalDecisionMutation =
        /** @lang GraphQL */
        '
        mutation revertFinalDecision($id: UUID!) {
            revertFinalDecision(id: $id) {
              id
              status
              expiryDate
              finalDecisionAt
            }
          }
    ';
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

    public function testRecordDecisionCandidateMutationPermissions(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_CASUAL->name;
        $this->poolCandidate->save();

        // candidate may not update own status with the ROD status mutations
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'placeCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'departmentId' => $department->id,
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->save();

        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->poolCandidate->save();

        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testPlaceCandidateMutation(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->placed_at = null;
        $this->poolCandidate->save();

        // cannot place candidate due to status
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'placeCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'departmentId' => $department->id,
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('InvalidStatusForPlacing');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->poolCandidate->save();

        // candidate was placed successfully
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'placeCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'departmentId' => $department->id,
                    ],
                ]
            )->json('data.placeCandidate');

        assertSame($response['status'], PoolCandidateStatus::PLACED_CASUAL->name);
        assertNotNull($response['placedAt']);
        assertSame($response['placedDepartment']['id'], $department->id);
    }

    public function testRevertPlaceCandidateMutation(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->placed_department_id = $department->id;
        $this->poolCandidate->placed_at = config('constants.far_past_date');
        $this->poolCandidate->save();

        // cannot execute mutation due to candidate not being placed
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage('CandidateNotPlaced');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_CASUAL->name;
        $this->poolCandidate->save();

        // mutation was successful
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertPlaceCandidate');

        assertSame($response['status'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
        assertNull($response['placedAt']);
        assertNull($response['placedDepartment']);
    }

    public function testQualifyCandidateMutation(): void
    {
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->final_decision_at = null;
        $this->poolCandidate->save();

        // cannot qualify candidate due to status
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )
            ->assertGraphQLErrorMessage('InvalidStatusForQualification');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->save();

        // cannot qualify candidate due to expiry date validation
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.past_date'),
                ]
            )
            ->assertJsonFragment(['message' => 'Validation failed for the field [qualifyCandidate].']);

        // candidate was qualified successfully
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )->json('data.qualifyCandidate');

        assertSame($response['status'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
        assertSame($response['expiryDate'], config('constants.far_future_date'));
        assertNotNull($response['finalDecisionAt']);
    }

    public function testDisqualifyCandidateMutation(): void
    {
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->final_decision_at = null;
        $this->poolCandidate->save();

        // cannot disqualify candidate due to status
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )
            ->assertGraphQLErrorMessage('InvalidStatusForDisqualification');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->save();

        // candidate was disqualified successfully
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )->json('data.disqualifyCandidate');

        assertSame($response['status'], PoolCandidateStatus::SCREENED_OUT_APPLICATION->name);
        assertNotNull($response['finalDecisionAt']);
    }

    public function testRevertFinalDecisionMutation(): void
    {
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->final_decision_at = null;
        $this->poolCandidate->save();

        // candidate was qualified successfully
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )->json('data.qualifyCandidate');

        assertSame($response['status'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
        assertSame($response['expiryDate'], config('constants.far_future_date'));
        assertNotNull($response['finalDecisionAt']);

        // candidate reverted successfully
        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertFinalDecision');

        assertSame($response['status'], PoolCandidateStatus::UNDER_ASSESSMENT->name);
        assertNull($response['expiryDate']);
        assertNull($response['finalDecisionAt']);

        // cannot revert again due to status changes
        $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage('InvalidStatusForRevertFinalDecision');
    }
}
