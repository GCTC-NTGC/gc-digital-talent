<?php

use App\Enums\EducationRequirementOption;
use App\Enums\PoolCandidateStatus;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use App\Notifications\PoolCandidateStatusChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
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
                'educationRequirementEducationExperiences' => [
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
                'educationRequirementCommunityExperiences' => [
                    'sync' => $communityExperienceIds,
                ],
                'educationRequirementAwardExperiences' => ['sync' => []],
                'educationRequirementEducationExperiences' => ['sync' => []],
                'educationRequirementPersonalExperiences' => ['sync' => []],
                'educationRequirementWorkExperiences' => ['sync' => []],
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

    /**
     * Test that notifications are generated for status changes
     *
     * @return void
     */
    public function testStatusChangeCausesNotifications()
    {
        if (! config('feature.status_notifications')) {
            $this->markTestSkipped('This test uses features behind the FEATURE_STATUS_NOTIFICATIONS flag.');
        }

        Notification::fake(); // initialize notification facade

        // set up submitted candidate
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->saveQuietly(); // don't generate events during set up

        // simulate screening in
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_IN->name;
        $this->poolCandidate->save();

        // check that notification was fired
        Notification::assertSentTo([$this->candidateUser], PoolCandidateStatusChanged::class);
    }

    /**
     * Test that use can query for notifications
     *
     * @return void
     */
    public function testCanQueryForNotifications()
    {
        if (! config('feature.status_notifications')) {
            $this->markTestSkipped('This test uses features behind the FEATURE_STATUS_NOTIFICATIONS flag.');
        }

        $screenInTime = config('constants.far_past_datetime');

        // set up submitted candidate
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->saveQuietly(); // don't generate events during set up

        Carbon::setTestNow($screenInTime);

        // simulate screening in
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_IN->name;
        $this->poolCandidate->save();

        // gather expected notification ID
        $notificationId = $this->candidateUser->notifications()->sole()->id;

        // check for a notification
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                query myNotifications {
                    me {
                        notifications {
                            data {
                                id
                                readAt
                                createdAt
                                updatedAt
                                ... on PoolCandidateStatusChangedNotification {
                                    oldStatus
                                    newStatus
                                    poolId
                                    poolName {
                                        en
                                        fr
                                    }
                                }
                        }
                    }
                    }
                }
            '
            )
            ->assertJson([
                'data' => [
                    'me' => [
                        'notifications' => [
                            'data' => [
                                [
                                    'id' => $notificationId,
                                    'readAt' => null,
                                    'createdAt' => $screenInTime,
                                    'updatedAt' => $screenInTime,
                                    'oldStatus' => PoolCandidateStatus::NEW_APPLICATION->name,
                                    'newStatus' => $this->poolCandidate->pool_candidate_status,
                                    'poolId' => $this->poolCandidate->pool->id,
                                    'poolName' => [
                                        'en' => $this->poolCandidate->pool->name['en'],
                                        'fr' => $this->poolCandidate->pool->name['fr'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test that use can dismiss notifications
     *
     * @return void
     */
    public function testCanDismissNotifications()
    {
        if (! config('feature.status_notifications')) {
            $this->markTestSkipped('This test uses features behind the FEATURE_STATUS_NOTIFICATIONS flag.');
        }

        $screenInTime = config('constants.far_past_datetime');
        $dismissNotificationTime = config('constants.past_datetime');

        // set up submitted candidate
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->saveQuietly(); // don't generate events during set up

        Carbon::setTestNow($screenInTime);

        // simulate screening in
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_IN->name;
        $this->poolCandidate->save();

        $notificationId = $this->candidateUser->notifications()->sole()->id;

        Carbon::setTestNow($dismissNotificationTime);

        // dismiss notification
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                mutation readNotifications($id: UUID!) {
                    markNotificationAsRead(id: $id) { id }
                  }
                ',
                [
                    'id' => $notificationId,
                ]
            );

        // check for notifications
        $this->actingAs($this->candidateUser, 'api')
            ->graphQL(/** @lang GraphQL */ '
                query myNotifications {
                    me {
                        notifications { data { id, readAt } }
                        unreadNotifications { id, readAt }
                    }
                }
            ')->assertJson([
                'data' => [
                    'me' => [
                        'notifications' => [
                            'data' => [
                                [
                                    'id' => $notificationId,
                                    'readAt' => $dismissNotificationTime,
                                ],
                            ],
                        ],
                        'unreadNotifications' => [],
                    ],
                ],
            ]);
    }
}
