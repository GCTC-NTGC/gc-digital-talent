<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\ClaimVerificationResult;
use App\Enums\DisqualificationReason;
use App\Enums\EducationRequirementOption;
use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Facades\Notify;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;

class PoolCandidateUpdateTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $guestUser;

    protected $applicantUser;

    protected $candidateUser;

    protected $adminUser;

    protected $community;

    protected $pool;

    protected $poolCandidate;

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $unauthorizedMessage;

    protected $manualStatusUpdateMutation;

    protected $placeCandidateMutation;

    protected $revertPlaceCandidateMutation;

    protected $qualifyCandidateMutation;

    protected $disqualifyCandidateMutation;

    protected $revertFinalDecisionMutation;

    protected $removeMutationDocument;

    protected $reinstateMutationDocument;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create(['name' => 'test-community']);
        $this->pool = Pool::factory()->create([
            'community_id' => $this->community->id,
        ]);

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

        $this->processOperatorUser = User::factory()
            ->asProcessOperator($this->pool->id)
            ->create([
                'email' => 'process-operator-user@test.com',
            ]);

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdminUser = User::factory()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->pool->id,
        ]);

        $this->unauthorizedMessage = 'This action is unauthorized.';

        $this->placeCandidateMutation =
        /** @lang GraphQL */
        '
        mutation placeCandidate($id: UUID!, $poolCandidate: PlaceCandidateInput!) {
            placeCandidate(id: $id, poolCandidate: $poolCandidate) {
                id
                status { value }
                placementType { value }
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
                status { value }
                placementType { value }
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
        mutation qualifyCandidate($id: UUID!, $poolCandidate: QualifyCandidateInput!) {
            qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
              id
              status { value }
              expiryDate
            }
          }
    ';

        $this->disqualifyCandidateMutation =
        /** @lang GraphQL */
        '
        mutation disqualifyCandidate($id: UUID!, $reason: DisqualificationReason!) {
            disqualifyCandidate(id: $id, reason: $reason) {
              id
              status { value }
              disqualificationReason { value }
            }
          }
    ';

        $this->revertFinalDecisionMutation =
        /** @lang GraphQL */
        '
        mutation revertFinalDecision($id: UUID!) {
            revertFinalDecision(id: $id) {
              id
              status { value }
              expiryDate
            }
          }
    ';

        $this->removeMutationDocument =
            /** @lang GraphQL */
            '
        mutation removeTest($id: UUID!, $removalReason: CandidateRemovalReason!, $removalReasonOther: String) {
            removeCandidate (
                id: $id,
                removalReason: $removalReason,
                removalReasonOther: $removalReasonOther
            ){
                status { value }
                removalReason { value }
                removalReasonOther
            }
        }
    ';

        $this->reinstateMutationDocument =
            /** @lang GraphQL */
            '
        mutation reinstateTest($id: UUID!) {
            reinstateCandidate (id: $id){
                status { value }
                removalReason { value }
                removalReasonOther
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

        // process operator can't add a step
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' => [
                    ['message' => 'This action is unauthorized.'],
                ],
            ]);

        // community recruiter can't add a step
        $this->actingAs($this->communityRecruiterUser, 'api')
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
                    educationRequirementOption { value }
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
                'educationRequirementEducationExperiences' => [
                    'sync' => [$educationExperienceIds[0]],
                ],
            ],
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => [
            'value' => EducationRequirementOption::EDUCATION->name,
        ]]);
        $response->assertJsonFragment([
            ['id' => $educationExperienceIds[0]],
        ]);

        // assert educationRequirementOption updated again, education experience was disconnected, and 3 community experiences synced
        $response = $this->actingAs($this->candidateUser, 'api')->graphQL($updateApplication, [
            'id' => $this->poolCandidate->id,
            'application' => [
                'educationRequirementOption' => EducationRequirementOption::APPLIED_WORK->name,
                'educationRequirementCommunityExperiences' => [
                    'sync' => $communityExperienceIds,
                ],
                'educationRequirementAwardExperiences' => ['sync' => []],
                'educationRequirementEducationExperiences' => ['sync' => []],
                'educationRequirementPersonalExperiences' => ['sync' => []],
                'educationRequirementWorkExperiences' => ['sync' => []],
            ],
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => [
            'value' => EducationRequirementOption::APPLIED_WORK->name,
        ]]);
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
        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
        $this->poolCandidate->placement_type = PlacementType::PLACED_INDETERMINATE->name;
        $this->poolCandidate->save();

        // candidate may not update own status with the ROD status mutations
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'department' => ['connect' => $department->id],
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

        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->save();

        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                    ],
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

        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
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
        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->placed_at = null;
        $this->poolCandidate->save();

        // cannot place candidate due to status
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'department' => ['connect' => $department->id],
                    ],
                ]
            )
            ->assertGraphQLErrorMessage(ErrorCode::INVALID_STATUS_PLACING->name);

        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
        $this->poolCandidate->placement_type = PlacementType::NOT_PLACED->name;
        $this->poolCandidate->save();

        // candidate was placed successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->placeCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'placementType' => PlacementType::PLACED_CASUAL->name,
                        'department' => ['connect' => $department->id],
                    ],
                ]
            )->json('data.placeCandidate');

        assertSame($response['placementType']['value'], PlacementType::PLACED_CASUAL->name);
        assertNotNull($response['placedAt']);
        assertSame($response['placedDepartment']['id'], $department->id);
    }

    public function testRevertPlaceCandidateMutation(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->placement_type = PlacementType::NOT_PLACED->name;
        $this->poolCandidate->placed_department_id = $department->id;
        $this->poolCandidate->placed_at = config('constants.far_past_date');
        $this->poolCandidate->save();

        // cannot execute mutation due to candidate not being placed
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage(ErrorCode::CANDIDATE_NOT_PLACED->name);

        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
        $this->poolCandidate->placement_type = PlacementType::PLACED_CASUAL->name;
        $this->poolCandidate->save();

        // mutation was successful
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertPlaceCandidate');

        assertSame($response['status']['value'], ApplicationStatus::QUALIFIED->name);
        assertNull($response['placedAt']);
        assertNull($response['placedDepartment']);
        assertNull($response['placementType']);
    }

    public function testQualifyCandidateMutation(): void
    {
        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
        $this->poolCandidate->status_updated_at = null;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->save();

        // cannot qualify candidate due to status
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                    ],
                ]
            )
            ->assertGraphQLErrorMessage(ErrorCode::INVALID_STATUS_QUALIFICATION->name);

        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->save();

        // cannot qualify candidate due to expiry date validation
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.past_date'),
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('Validation failed for the field [qualifyCandidate].');

        // candidate was qualified successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                    ],
                ]
            )->json('data.qualifyCandidate');

        assertSame($response['status']['value'], ApplicationStatus::QUALIFIED->name);
        assertSame($response['expiryDate'], config('constants.far_future_date'));
    }

    public function testDisqualifyCandidateMutation(): void
    {
        $this->poolCandidate->application_status = ApplicationStatus::QUALIFIED->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->save();

        // cannot disqualify candidate due to status
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )
            ->assertGraphQLErrorMessage(ErrorCode::INVALID_STATUS_DISQUALIFICATION->name);

        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->save();

        // candidate was disqualified successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )->json('data.disqualifyCandidate');

        assertSame($response['status']['value'], ApplicationStatus::DISQUALIFIED->name);
        assertSame($response['disqualificationReason']['value'], DisqualificationReason::SCREENED_OUT_APPLICATION->name);
    }

    public function testRevertFinalDecisionMutation(): void
    {
        $this->poolCandidate->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->poolCandidate->screening_stage = ScreeningStage::UNDER_ASSESSMENT->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->save();

        // candidate was qualified successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'poolCandidate' => [
                        'expiryDate' => config('constants.far_future_date'),
                    ],
                ]
            )
            ->json('data.qualifyCandidate');

        assertSame($response['status']['value'], ApplicationStatus::QUALIFIED->name);
        assertSame($response['expiryDate'], config('constants.far_future_date'));

        // candidate reverted successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertFinalDecision');

        assertSame($response['status']['value'], ApplicationStatus::TO_ASSESS->name);
        assertNull($response['expiryDate']);

        // cannot revert again due to status changes
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage(ErrorCode::INVALID_STATUS_REVERT_FINAL_DECISION->name);
    }

    public function testPoolCandidateReinstatement(): void
    {
        // Create a removed candidate with all removed fields set
        $candidate = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::REMOVED->name,
            'removal_reason' => CandidateRemovalReason::OTHER->name,
            'user_id' => $this->applicantUser->id,
        ]);

        $this->assertNotNull($candidate->removal_reason);
        $this->assertNotNull($candidate->removal_reason_other);

        // Applicant can't reinstate their own application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Assert reinstating as admin succeeds
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
            ->assertSuccessful()
            ->assertJsonFragment([
                'removalReason' => null,
                'removalReasonOther' => null,
            ]);

        // Invalid statuses throw an error
        $statusesThatShouldFail = [
            ApplicationStatus::DRAFT->name,
            ApplicationStatus::TO_ASSESS->name,
            ApplicationStatus::QUALIFIED->name,
            ApplicationStatus::DISQUALIFIED->name,
        ];

        foreach ($statusesThatShouldFail as $status) {
            $candidate = PoolCandidate::factory()->create([
                'application_status' => $status,
                'user_id' => $this->applicantUser->id,
            ]);

            $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
                ->assertGraphQLErrorMessage(ErrorCode::CANDIDATE_UNEXPECTED_STATUS->name);
        }
    }

    public function testUpdatePoolCandidateClaimVerification(): void
    {
        $user = User::factory()->create([
            'armed_forces_status' => ArmedForcesStatus::VETERAN->name,
            'has_priority_entitlement' => true,

        ]);
        $candidate = PoolCandidate::factory()->create([
            'user_id' => $user->id,
            'pool_id' => $this->pool->id,
            'veteran_verification' => ClaimVerificationResult::UNVERIFIED->name,
            'veteran_verification_expiry' => null,
            'priority_verification' => ClaimVerificationResult::UNVERIFIED->name,
            'priority_verification_expiry' => null,
        ]);

        $updateClaimVerificationDocument =
            /** @lang GraphQL */
            '
        mutation updatePoolCandidateClaimVerification($id: UUID!, $poolCandidate: UpdatePoolCandidateClaimVerificationInput!) {
            updatePoolCandidateClaimVerification (id: $id, poolCandidate: $poolCandidate){
                id
                veteranVerification
                veteranVerificationExpiry
                priorityVerification
                priorityVerificationExpiry
            }
        }
    ';

        // user can't update own claim
        $this->actingAs($user, 'api')
            ->graphQL(
                $updateClaimVerificationDocument,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'veteranVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'veteranVerificationExpiry' => '',
                        'priorityVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'priorityVerificationExpiry' => '2099-01-01',
                    ],
                ]
            )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // community recruiter successfully updates claim verification
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $updateClaimVerificationDocument,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'veteranVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'veteranVerificationExpiry' => config('constants.far_future_date'),
                        'priorityVerification' => ClaimVerificationResult::REJECTED->name,
                        'priorityVerificationExpiry' => '',
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
                'veteranVerification' => ClaimVerificationResult::ACCEPTED->name,
                'veteranVerificationExpiry' => config('constants.far_future_date'),
                'priorityVerification' => ClaimVerificationResult::REJECTED->name,
                'priorityVerificationExpiry' => null,
            ]);
    }

    public function testUpdatePoolCandidateClaimVerificationValidation(): void
    {
        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'veteran_verification' => ClaimVerificationResult::UNVERIFIED->name,
            'veteran_verification_expiry' => null,
            'priority_verification' => ClaimVerificationResult::UNVERIFIED->name,
            'priority_verification_expiry' => null,
        ]);

        $updateClaimVerificationDocument =
            /** @lang GraphQL */
            '
        mutation updatePoolCandidateClaimVerification($id: UUID!, $poolCandidate: UpdatePoolCandidateClaimVerificationInput!) {
            updatePoolCandidateClaimVerification (id: $id, poolCandidate: $poolCandidate){
                id
            }
        }
    ';

        // veteran expiry not required, priority expiration not required, mutation successful
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $updateClaimVerificationDocument,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'veteranVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'veteranVerificationExpiry' => null,
                        'priorityVerification' => ClaimVerificationResult::REJECTED->name,
                        'priorityVerificationExpiry' => null,
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
            ]);

        // priority expiry is required, mutation fails
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $updateClaimVerificationDocument,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'veteranVerification' => null,
                        'veteranVerificationExpiry' => null,
                        'priorityVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'priorityVerificationExpiry' => null,
                    ],
                ]
            )
            ->assertGraphQLErrorMessage('Validation failed for the field [updatePoolCandidateClaimVerification].');

        // priority expiry included, succeeds
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $updateClaimVerificationDocument,
                [
                    'id' => $candidate->id,
                    'poolCandidate' => [
                        'veteranVerification' => null,
                        'veteranVerificationExpiry' => null,
                        'priorityVerification' => ClaimVerificationResult::ACCEPTED->name,
                        'priorityVerificationExpiry' => config('constants.far_future_date'),
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $candidate->id,
            ]);
    }
}
