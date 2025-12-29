<?php

namespace Tests\Feature;

use App\Enums\ActivityLog;
use App\Enums\PoolCandidateSearchPositionType;
use App\Enums\PoolCandidateSearchRequestReason;
use App\Enums\PoolCandidateStatus;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Spatie\Activitylog\Models\Activity;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class ActivityLogTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $adminUser;

    protected $baseUser;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->baseUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'base-user@test.com',
                'sub' => 'base-user@test.com',
            ]);
        $community = Community::factory()->create(['name' => 'test-community']);
        $this->adminUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($community->id)
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    // cause an event to be logged, assert some of its values
    public function testActivityLogCreation(): void
    {
        Activity::truncate();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                    updateUserSub(updateUserSubInput:$updateUserSubInput) {
                        sub
                    }
                    }
                ',
            [
                'updateUserSubInput' => [
                    'userId' => $this->baseUser->id,
                    'sub' => 'new-sub',
                ],
            ]
        )->assertSuccessful();

        // assert logging happened and the values are as expected
        $activity = Activity::first();
        assertEquals('updated', $activity->description);
        assertEquals('App\Models\User', $activity->subject_type);
        assertEquals($this->baseUser->id, $activity->subject_id);
        assertEquals('App\Models\User', $activity->causer_type);
        assertEquals($this->adminUser->id, $activity->causer_id);
        // updated_at also changes, making comparison a little trickier
        assertEquals(
            'new-sub',
            $activity->properties->toArray()['attributes']['sub']
        );
        assertEquals(
            'base-user@test.com',
            $activity->properties->toArray()['old']['sub']
        );
    }

    // admin changes sub then creates a pool candidate, should log changes on two models
    public function testLoggingMultipleEvents(): void
    {
        $testPool = Pool::factory()->published()->create();
        Activity::truncate();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                        updateUserSub(updateUserSubInput:$updateUserSubInput) {
                            sub
                        }
                        }
                    ',
            [
                'updateUserSubInput' => [
                    'userId' => $this->adminUser->id,
                    'sub' => 'admin-2.0',
                ],
            ]
        )->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createApplication($userId: ID!, $poolId: ID!){
                    createApplication(userId: $userId, poolId: $poolId) {
                        id
                    }
                    }
                ',
            [
                'userId' => $this->adminUser->id,
                'poolId' => $testPool->id,
            ]
        )->assertSuccessful();

        // three activity instances, two for pool candidate as application creation logs a create and update event
        $activityAll = Activity::all();
        $activityUser = Activity::where('subject_type', 'App\Models\User')->get();
        $activityPoolCandidate = Activity::where('subject_type', 'App\Models\PoolCandidate')->get();
        assertEquals(3, count($activityAll));
        assertEquals(1, count($activityUser));
        assertEquals(2, count($activityPoolCandidate));

        $activityCreatePoolCandidate = Activity::where('subject_type', 'App\Models\PoolCandidate')->where('description', 'created')->sole();
        $activityUpdatePoolCandidate = Activity::where('subject_type', 'App\Models\PoolCandidate')->where('description', 'updated')->sole();

        // assert values on pool candidate creation event
        assertEquals($this->adminUser->id, $activityCreatePoolCandidate->causer_id);
        assertEquals($testPool->id, $activityCreatePoolCandidate->properties['attributes']['pool_id']);
        assertEquals($this->adminUser->id, $activityCreatePoolCandidate->properties['attributes']['user_id']);

        // assert values on pool candidate update event
        assertEquals($this->adminUser->id, $activityUpdatePoolCandidate->causer_id);
        assertEquals(PoolCandidateStatus::DRAFT->name, $activityUpdatePoolCandidate->properties['attributes']['pool_candidate_status']);
    }

    // test activity log actions undertaken by a specific user
    public function testActivityLogByUser(): void
    {
        $testPool = Pool::factory()->published()->create();
        $testDepartment = Department::factory()->create();
        $testCommunity = Community::factory()->create();
        Activity::truncate();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                        updateUserSub(updateUserSubInput:$updateUserSubInput) {
                            sub
                        }
                        }
                    ',
            [
                'updateUserSubInput' => [
                    'userId' => $this->adminUser->id,
                    'sub' => 'admin-2.0',
                ],
            ]
        )->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createApplication($userId: ID!, $poolId: ID!){
                    createApplication(userId: $userId, poolId: $poolId) {
                        id
                    }
                    }
                ',
            [
                'userId' => $this->adminUser->id,
                'poolId' => $testPool->id,
            ]
        )->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation createPoolCandidateSearchRequest(
                    $poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!){
                    createPoolCandidateSearchRequest(poolCandidateSearchRequest: $poolCandidateSearchRequest) {
                        id
                    }
                    }
                ',
            [
                'poolCandidateSearchRequest' => [
                    'fullName' => 'Full Name',
                    'email' => 'test@test.com',
                    'department' => [
                        'connect' => $testDepartment->id,
                    ],
                    'community' => [
                        'connect' => $testCommunity->id,
                    ],
                    'jobTitle' => 'CEO',
                    'managerJobTitle' => 'Manager',
                    'positionType' => PoolCandidateSearchPositionType::INDIVIDUAL_CONTRIBUTOR->name,
                    'reason' => PoolCandidateSearchRequestReason::GENERAL_INTEREST->name,
                    'applicantFilter' => [
                        'create' => [
                            'hasDiploma' => true,
                            'community' => [
                                'connect' => $testCommunity->id,
                            ],
                        ],
                    ],
                ],
            ]
        )->assertSuccessful();

        // four events, one to update user, two for pool candidate, one to submit request
        assertEquals(4, count(Activity::all()));

        // quick assertion the above search request was created successfully and stored value from applicant filter
        $requestEvent = Activity::where('subject_type', 'App\Models\PoolCandidateSearchRequest')->sole();
        assertEquals(true, $requestEvent->properties['attributes']['applicantFilter.has_diploma']);

        // assert can query all the actions undertaken or caused by a user
        $actingUser = User::where('email', 'admin-user@test.com')->sole();
        $actions = $actingUser->actions;
        assertEquals(4, count($actions)); // total
        assertEquals(2, count($actions->where('description', 'updated'))); // two update actions
        assertEquals(2, count($actions->where('subject_type', 'App\Models\PoolCandidate'))); // two events on PoolCandidate
        assertEquals(1, count($actions->where('description', 'updated')->where('subject_type', 'App\Models\PoolCandidate'))); // narrow to updating
    }

    public function testProcessOperatorCanViewPoolActivity()
    {
        Pool::factory()->create(); // unexpected

        $expected = Pool::factory()->create();

        $user = User::factory()
            ->asProcessOperator($expected->id)
            ->create();

        $res = $this->actingAs($user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query PoolActivity($id: UUID!) {
                    pool(id: $id) {
                        activities {
                            data {
                                subjectType
                                subjectId
                                logName
                                properties {
                                    attributes
                                }
                            }
                        }
                    }
                }
                GRAPHQL,
                ['id' => $expected->id]);

        $rows = $res->json('data.pool.activities.data');

        foreach ($rows as $row) {
            // Only want pools the user is assigned to
            $this->assertEquals(ActivityLog::PROCESS->value, $row['logName']);
            if ($row['subjectType'] === Pool::class) {
                $this->assertEquals($expected->id, $row['subjectId']);
            } else {
                if ($atts = json_decode($row['properties']['attributes'])) {
                    $this->assertEquals($expected->id, $atts->pool_id);
                }
            }
        }

    }

    public function testCommunityRecruiterCanViewPoolActivity()
    {
        Pool::factory()->create(); // unexpected

        $expected = Pool::factory()->create();

        $user = User::factory()
            ->asCommunityRecruiter($expected->community_id)
            ->create();

        $res = $this->actingAs($user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query PoolActivity($id: UUID!) {
                    pool(id: $id) {
                        activities {
                            data {
                                subjectType
                                subjectId
                                logName
                                properties {
                                    attributes
                                }
                            }
                        }
                    }
                }
                GRAPHQL,
                ['id' => $expected->id]);

        $rows = $res->json('data.pool.activities.data');

        foreach ($rows as $row) {
            // Only want pools the user is assigned to
            $this->assertEquals(ActivityLog::PROCESS->value, $row['logName']);
            if ($row['subjectType'] === Pool::class) {
                $this->assertEquals($expected->id, $row['subjectId']);
            } else {
                if ($atts = json_decode($row['properties']['attributes'])) {
                    $this->assertEquals($expected->id, $atts->pool_id);
                }
            }
        }
    }
}
