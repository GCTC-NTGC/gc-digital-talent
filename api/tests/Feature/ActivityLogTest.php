<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateSearchPositionType;
use App\Enums\PoolCandidateSearchRequestReason;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
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

    protected Community $community;

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
        $this->community = Community::factory()->create(['name' => 'test-community']);
        $this->adminUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
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

        $this->actingAs($this->adminUser, 'api')->graphQL(<<<'GRAPHQL'
            mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                updateUserSub(updateUserSubInput:$updateUserSubInput) {
                    sub
               }
            }
            GRAPHQL,
            [
                'updateUserSubInput' => [
                    'userId' => $this->adminUser->id,
                    'sub' => 'admin-2.0',
                ],
            ]
        )->assertSuccessful();

        $testClassiciation = Classification::factory()->create();
        $testDepartment = Department::factory()->create();

        $this->actingAs($this->adminUser, 'api')->graphQL(<<<'GRAPHQL'
            mutation createPool($userId: ID!, $communityId: ID!, $pool: CreatePoolInput!){
                createPool(userId: $userId, communityId: $communityId, pool: $pool) {
                    id
                }
            }
            GRAPHQL,
            [
                'userId' => $this->adminUser->id,
                'communityId' => $this->community->id,
                'pool' => [
                    'department' => ['connect' => $testDepartment->id],
                    'classification' => ['connect' => $testClassiciation->id],
                ],
            ]
        )->assertSuccessful();

        // three activity instances, two for pool candidate as application creation logs a create and update event
        $activityUser = Activity::where('subject_type', 'App\Models\User')->get();
        $activityPool = Activity::where('subject_type', 'App\Models\Pool')->get();
        assertEquals(3, Activity::count());
        assertEquals(1, count($activityUser));
        assertEquals(1, count($activityPool));

        $activityCreatePool = Activity::where('subject_type', 'App\Models\Pool')->where('description', 'created')->sole();

        // assert values on pool candidate creation event
        assertEquals($this->adminUser->id, $activityCreatePool->causer_id);
        assertEquals($testDepartment->id, $activityCreatePool->properties['attributes']['department_id']);
        assertEquals($testClassiciation->id, $activityCreatePool->properties['attributes']['classification_id']);
        assertEquals($this->community->id, $activityCreatePool->properties['attributes']['community_id']);
        assertEquals($this->adminUser->id, $activityCreatePool->properties['attributes']['user_id']);
    }

    // test activity log actions undertaken by a specific user
    public function testActivityLogByUser(): void
    {
        $testClassiciation = Classification::factory()->create();
        $testDepartment = Department::factory()->create();
        $testCommunity = Community::factory()->create();
        Activity::truncate();

        $this->actingAs($this->adminUser, 'api')->graphQL(<<<'GRAPHQL'
            mutation updateUserSub($updateUserSubInput:UpdateUserSubInput!) {
                updateUserSub(updateUserSubInput:$updateUserSubInput) {
                    sub
                }
            }
            GRAPHQL,
            [
                'updateUserSubInput' => [
                    'userId' => $this->adminUser->id,
                    'sub' => 'admin-2.0',
                ],
            ]
        )->assertSuccessful();

        $this->actingAs($this->adminUser, 'api')->graphQL(<<<'GRAPHQL'
            mutation createPool($userId: ID!, $communityId: ID!, $pool: CreatePoolInput!){
                createPool(userId: $userId, communityId: $communityId, pool: $pool) {
                    id
                }
            }
            GRAPHQL,
            [
                'userId' => $this->adminUser->id,
                'communityId' => $this->community->id,
                'pool' => [
                    'department' => ['connect' => $testDepartment->id],
                    'classification' => ['connect' => $testClassiciation->id],
                ],
            ]
        )->assertSuccessful();

        $this->actingAs($this->adminUser, 'api')->graphQL(<<<'GRAPHQL'
            mutation createPoolCandidateSearchRequest($poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!){
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $poolCandidateSearchRequest) {
                    id
                }
            }
            GRAPHQL,
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

        Log::debug(Activity::all());

        // four events, one to update user, two for pool candidate, one to submit request
        assertEquals(4, Activity::count());

        // quick assertion the above search request was created successfully and stored value from applicant filter
        $requestEvent = Activity::where('subject_type', 'App\Models\PoolCandidateSearchRequest')->sole();
        assertEquals(true, $requestEvent->properties['attributes']['applicantFilter.has_diploma']);

        // assert can query all the actions undertaken or caused by a user
        $actingUser = User::where('email', 'admin-user@test.com')->sole();
        $actions = $actingUser->actions;
        assertEquals(4, count($actions)); // total
        assertEquals(1, count($actions->where('description', 'updated'))); // two update actions
        assertEquals(1, count($actions->where('subject_type', 'App\Models\Pool'))); // two events on Pool
        assertEquals(1, count($actions->where('description', 'created')->where('subject_type', 'App\Models\Pool'))); // narrow to updating
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
                            subjectType
                            subjectId
                        }
                    }
                }
                GRAPHQL,
                ['id' => $expected->id]);

        $rows = $res->json('data.pool.activities');

        foreach ($rows as $row) {
            // Only want pools the user is assigned to
            $this->assertEquals($row, [
                'subjectType' => 'App\Models\Pool',
                'subjectId' => $expected->id,
            ]);
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
                            subjectType
                            subjectId
                        }
                    }
                }
                GRAPHQL,
                ['id' => $expected->id]);

        $rows = $res->json('data.pool.activities');

        foreach ($rows as $row) {
            // Only want pools the user is assigned to
            $this->assertEquals($row, [
                'subjectType' => 'App\Models\Pool',
                'subjectId' => $expected->id,
            ]);
        }

    }
}
