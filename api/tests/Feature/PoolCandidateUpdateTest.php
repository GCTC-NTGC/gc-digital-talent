<?php

namespace Tests\Feature;

use App\Enums\ArmedForcesStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\ClaimVerificationResult;
use App\Enums\DisqualificationReason;
use App\Enums\EducationRequirementOption;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Facades\Notify;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
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

        $this->manualStatusUpdateMutation = <<<'GRAPHQL'
            mutation updatePoolCandidateStatus($id: UUID!, $candidate: UpdatePoolCandidateStatusInput!) {
                updatePoolCandidateStatus(id: $id, poolCandidate: $candidate) {
                    status { value }
                    finalDecisionAt
                    placedAt
                    removedAt
                }
            }
        GRAPHQL;

        $this->placeCandidateMutation =
        /** @lang GraphQL */
        '
        mutation placeCandidate($id: UUID!, $placeCandidate: PlaceCandidateInput!) {
            placeCandidate(id: $id, placeCandidate: $placeCandidate) {
                id
                status { value }
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
              status { value }
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
              status { value }
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
              status { value }
              expiryDate
              finalDecisionAt
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
                removedAt
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
                removedAt
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
                'educationRequirementExperiences' => [
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
                'educationRequirementExperiences' => [
                    'sync' => $communityExperienceIds,
                ],
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
        $this->actingAs($this->communityRecruiterUser, 'api')
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
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
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

        assertSame($response['status']['value'], PoolCandidateStatus::PLACED_CASUAL->name);
        assertNotNull($response['placedAt']);
        assertSame($response['placedDepartment']['id'], $department->id);
    }

    // placing candidates sets suspended_at automatically or keeps/makes it null appropriately
    public function testPlaceCandidateMutationSuspensionLogic(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $this->poolCandidate->placed_at = null;
        $this->poolCandidate->save();
        $placedDoNotSuspend = [
            PlacementType::PLACED_TENTATIVE->name,
            PlacementType::PLACED_CASUAL->name,
        ];
        $placedDoSuspend = [
            PlacementType::PLACED_TERM->name,
            PlacementType::PLACED_INDETERMINATE->name,
        ];

        foreach ($placedDoNotSuspend as $placementType) {
            $response = $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL(
                    $this->placeCandidateMutation,
                    [
                        'id' => $this->poolCandidate->id,
                        'placeCandidate' => [
                            'placementType' => $placementType,
                            'departmentId' => $department->id,
                        ],
                    ]
                )->json('data.placeCandidate');

            assertSame($response['status']['value'], $placementType);
            assertNotNull($response['placedAt']);
            assertNull($response['suspendedAt']);
        }

        foreach ($placedDoSuspend as $placementType) {
            $response = $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL(
                    $this->placeCandidateMutation,
                    [
                        'id' => $this->poolCandidate->id,
                        'placeCandidate' => [
                            'placementType' => $placementType,
                            'departmentId' => $department->id,
                        ],
                    ]
                )->json('data.placeCandidate');

            assertSame($response['status']['value'], $placementType);
            assertNotNull($response['placedAt']);
            assertNotNull($response['suspendedAt']);
        }
    }

    public function testRevertPlaceCandidateMutation(): void
    {
        $department = Department::factory()->create();
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
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
            ->assertGraphQLErrorMessage('CandidateNotPlaced');

        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::PLACED_CASUAL->name;
        $this->poolCandidate->save();

        // mutation was successful
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertPlaceCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertPlaceCandidate');

        assertSame($response['status']['value'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
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
        $this->actingAs($this->communityRecruiterUser, 'api')
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
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.past_date'),
                ]
            )
            ->assertGraphQLErrorMessage('Validation failed for the field [qualifyCandidate].');

        // candidate was qualified successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )->json('data.qualifyCandidate');

        assertSame($response['status']['value'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
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
        $this->actingAs($this->communityRecruiterUser, 'api')
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
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->disqualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'reason' => DisqualificationReason::SCREENED_OUT_APPLICATION->name,
                ]
            )->json('data.disqualifyCandidate');

        assertSame($response['status']['value'], PoolCandidateStatus::SCREENED_OUT_APPLICATION->name);
        assertNotNull($response['finalDecisionAt']);
    }

    public function testRevertFinalDecisionMutation(): void
    {
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        $this->poolCandidate->expiry_date = null;
        $this->poolCandidate->final_decision_at = null;
        $this->poolCandidate->save();

        // candidate was qualified successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->qualifyCandidateMutation,
                [
                    'id' => $this->poolCandidate->id,
                    'expiryDate' => config('constants.far_future_date'),
                ]
            )->json('data.qualifyCandidate');

        assertSame($response['status']['value'], PoolCandidateStatus::QUALIFIED_AVAILABLE->name);
        assertSame($response['expiryDate'], config('constants.far_future_date'));
        assertNotNull($response['finalDecisionAt']);

        // candidate reverted successfully
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )->json('data.revertFinalDecision');

        assertSame($response['status']['value'], PoolCandidateStatus::UNDER_ASSESSMENT->name);
        assertNull($response['expiryDate']);
        assertNull($response['finalDecisionAt']);

        // cannot revert again due to status changes
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL(
                $this->revertFinalDecisionMutation,
                [
                    'id' => $this->poolCandidate->id,
                ]
            )
            ->assertGraphQLErrorMessage('InvalidStatusForRevertFinalDecision');
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
        $response = $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->removeMutationDocument, $variables)
            ->assertSuccessful();

        // New fields are updated correctly
        $response->assertJsonFragment([
            'removalReason' => [
                'value' => CandidateRemovalReason::OTHER->name,
            ],
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

            $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL($this->removeMutationDocument, $variables)
                ->assertJsonFragment([
                    'status' => [
                        'value' => $finalStatus,
                    ],
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

            $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL($this->removeMutationDocument, $variables)
                ->assertGraphQLErrorMessage($error);
        }
    }

    public function testPoolCandidateReinstatement(): void
    {
        // Create a removed candidate with all removed fields set
        $candidate = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::REMOVED->name,
            'removal_reason' => CandidateRemovalReason::OTHER->name,
            'user_id' => $this->applicantUser->id,
        ]);

        $this->assertNotNull($candidate->removed_at);
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

            $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
                ->assertJsonFragment([
                    'status' => [
                        'value' => $finalStatus,
                    ],
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

            $this->actingAs($this->communityRecruiterUser, 'api')
                ->graphQL($this->reinstateMutationDocument, ['id' => $candidate->id])
                ->assertGraphQLErrorMessage('CandidateUnexpectedStatus');
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

    /**
     * @dataProvider manualStatusProvider
     */
    public function testManualStatusUpdatesTimestamps($status, $timestamp)
    {
        $this->markTestSkipped('Only a pool operator can update applicationStatus.');
        // Ensure timestamps are set to compare against
        // and we are starting from no status
        $past = config('constants.past_datetime');
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->final_decision_at = $past;
        $this->poolCandidate->placed_at = $past;
        $this->poolCandidate->removed_at = $past;
        $this->poolCandidate->save();

        $camelTimestamp = Str::camel($timestamp);
        $original = $this->poolCandidate->$timestamp;

        $response = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => $status],
            ]);

        // Assert the expected timestamp was changed
        $data = $response['data']['updatePoolCandidateStatus'];
        $new = new Carbon($data[$camelTimestamp]);
        $this->assertGreaterThan($original->timestamp, $new->timestamp, sprintf(
            '%s is not greater than %s',
            $new->toDayDateTimeString(),
            $original->toDayDateTimeString()
        ));

        // Ensure other timestamps remain the same
        $unchanged = array_diff(['final_decision_at', 'removed_at', 'placed_at'], [$timestamp]);
        foreach ($unchanged as $unchangedTimestamp) {
            $this->assertEquals($this->poolCandidate->$unchangedTimestamp, $data[Str::camel($unchangedTimestamp)]);
        }

        // Attempt to make change again and assert it does not affect timestamp
        $noChangeResponse = $this->actingAs($this->poolOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => $status],
            ]);

        $unChangeData = $noChangeResponse['data']['updatePoolCandidateStatus'];
        $unchanged = new Carbon($unChangeData[$camelTimestamp]);

        $this->assertEquals($new->timestamp, $unchanged->timestamp);
    }

    public static function manualStatusProvider()
    {
        return [
            // Final decision
            'screened out assessment sets final decision' => [
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                'final_decision_at',
            ],
            'screened out application sets final decision' => [
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                'final_decision_at',
            ],
            'qualified available sets final decision' => [
                PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                'final_decision_at',
            ],

            // Removed
            'screened out not responsive sets removed at' => [
                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                'removed_at',
            ],
            'qualified unavailable sets removed at' => [
                PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
                'removed_at',
            ],
            'qualified withdrew sets removed at' => [
                PoolCandidateStatus::QUALIFIED_WITHDREW->name,
                'removed_at',
            ],
            'removed sets removed at' => [
                PoolCandidateStatus::REMOVED->name,
                'removed_at',
            ],

            // Placed
            'placed tentative sets removed at' => [
                PoolCandidateStatus::PLACED_TENTATIVE->name,
                'placed_at',
            ],
            'placed casual sets placed at' => [
                PoolCandidateStatus::PLACED_CASUAL->name,
                'placed_at',
            ],
            'placed term sets placed at' => [
                PoolCandidateStatus::PLACED_CASUAL->name,
                'placed_at',
            ],
            'placed indeterminate sets placed at' => [
                PoolCandidateStatus::PLACED_INDETERMINATE->name,
                'placed_at',
            ],
        ];
    }

    // test policy correctly allows sample manual status updates to work, when expected and fail otherwise
    public function testManualStatusUpdatePolicy(): void
    {
        $past = config('constants.past_datetime');
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->submitted_at = $past;
        $this->poolCandidate->save();

        // process operator
        // can set to SCREENED IN, QUALIFIED, REMOVED only
        // cannot set PLACED TERM, or DRAFT
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::DRAFT->name],
            ])->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::SCREENED_IN->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::SCREENED_IN->name,
                ],
            ]);
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                ],
            ]);
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::REMOVED->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::REMOVED->name,
                ],
            ]);
        $this->actingAs($this->processOperatorUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::PLACED_TERM->name],
            ])->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // community recruiter
        // can set to SCREENED IN, QUALIFIED, REMOVED, PLACED TERM only
        // cannot set DRAFT
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::DRAFT->name],
            ])->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::SCREENED_IN->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::SCREENED_IN->name,
                ],
            ]);
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                ],
            ]);
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::REMOVED->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::REMOVED->name,
                ],
            ]);
        $this->actingAs($this->communityRecruiterUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::PLACED_TERM->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::PLACED_TERM->name,
                ],
            ]);

        // community admin
        // can set to SCREENED IN, QUALIFIED, REMOVED, PLACED TERM only
        // cannot set DRAFT
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::DRAFT->name],
            ])->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::SCREENED_IN->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::SCREENED_IN->name,
                ],
            ]);
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
                ],
            ]);
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::REMOVED->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::REMOVED->name,
                ],
            ]);
        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->manualStatusUpdateMutation, [
                'id' => $this->poolCandidate->id,
                'candidate' => ['status' => PoolCandidateStatus::PLACED_TERM->name],
            ])->assertJsonFragment([
                'status' => [
                    'value' => PoolCandidateStatus::PLACED_TERM->name,
                ],
            ]);
    }
}
