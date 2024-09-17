<?php

namespace Tests\Feature;

use App\Enums\PoolStatus;
use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Enums\SkillCategory;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Database\Helpers\ApiErrorEnums;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertSame;

class PoolTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $team;

    protected $poolOperator;

    protected $adminUser;

    protected $guestUser;

    protected $baseUser;

    protected $communityManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();

        $this->seed(RolePermissionSeeder::class);

        $this->team = Team::factory()->create([
            'name' => 'pool-application-test-team',
        ]);

        $this->poolOperator = User::factory()
            ->asPoolOperator($this->team->name)
            ->create([
                'sub' => 'operator@test.com',
            ]);

        $this->communityManager = User::factory()
            ->asCommunityManager()
            ->create([
                'email' => 'community@test.com',
                'sub' => 'community@test.com',
            ]);

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);

        $this->guestUser = User::factory()
            ->asGuest()
            ->create();

        $this->baseUser = User::factory()->create();
    }

    public function testPoolAccessor(): void
    {
        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
        ]);
        $pool2 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.past_date'),
        ]);
        $pool3 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
        ]);
        $pool4 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'published_at' => null,
            'closing_date' => config('constants.past_date'),
        ]);
        $pool5 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'published_at' => Carbon::create(config('constants.past_date'))->addDays(1),
            'closing_date' => Carbon::create(config('constants.past_date'))->addDays(2),
            'archived_at' => Carbon::create(config('constants.past_date'))->addDays(3),
        ]);

        // Assert query with pool 1 will return accessor as published
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::PUBLISHED->name,
                    ],
                ],
            ],
        ]);

        // Assert query with pool 2 will return accessor as closed
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::CLOSED->name,
                    ],
                ],
            ],
        ]);

        // Assert query with pool 3 will return accessor as draft
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::DRAFT->name,
                    ],
                ],
            ],
        ]);

        // Assert query with pool 4 will return accessor as draft
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::DRAFT->name,
                    ],
                ],
            ],
        ]);

        // Assert query with pool 5 will return accessor as archived
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::ARCHIVED->name,
                    ],
                ],
            ],
        ]);
    }

    public function testPoolAccessorTime(): void
    {
        // test that expiry on day of functions as expected, that soon to expire can be applied to and just expired is longer open for application
        $expireInHour = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $expiredLastHour = date('Y-m-d H:i:s', strtotime('-1 hour'));

        $pool1 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'published_at' => config('constants.past_date'),
            'closing_date' => $expireInHour,
        ]);
        $pool2 = Pool::factory()->create([
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'published_at' => config('constants.past_date'),
            'closing_date' => $expiredLastHour,
        ]);

        // Assert query with pool 1 will still be published
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::PUBLISHED->name,
                    ],
                ],
            ],
        ]);

        // Assert query with pool 2 will return as closed
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                status { value }
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => [
                        'value' => PoolStatus::CLOSED->name,
                    ],
                ],
            ],
        ]);
    }

    // The publishedPools query should only return pools that have been published, not draft
    public function testPublishedPoolQueryDoesNotReturnDraft(): void
    {
        // this pool has been published so it should be returned in the publishedPool query
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);
        // this pool is still a draft so it should not be returned in the publishedPool query
        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        // Assert query will return only the published pool
        $this->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            publishedPools {
              id
            }
          }
    '
        )->assertJson([
            'data' => [
                'publishedPools' => [
                    [
                        'id' => $publishedPool->id,
                    ],
                ],
            ],
        ]);
    }

    // The publishedPools query should only return pools that have been published, not archived
    public function testPublishedPoolQueryDoesNotReturnArchived(): void
    {
        // this pool has been published so it should be returned in the publishedPool query
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);
        // this pool is archived so it should not be returned in the publishedPool query
        $archivedPool = Pool::factory()->archived()->create();

        // Assert query will return only the published pool
        $this->graphQL(
            /** @lang GraphQL */
            '
           query browsePools {
               publishedPools {
                 id
               }
             }
       '
        )->assertJson([
            'data' => [
                'publishedPools' => [
                    [
                        'id' => $publishedPool->id,
                    ],
                ],
            ],
        ]);
    }

    public function testListPoolsDoesNotReturnDraftAsAnon(): void
    {
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);

        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        // Assert query will return only the published pool as anonymous user
        $this->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            publishedPools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.publishedPools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    public function testListPoolsDoesNotReturnArchivedAsAnon(): void
    {
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);

        $archivedPool = Pool::factory()->archived()->create();

        // Assert query will return only the published pool as anonymous user
        $this->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            publishedPools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.publishedPools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    public function testListPoolsReturnsOnlyPublishedAsBaseRoleUser(): void
    {
        $publishedPool = Pool::factory()
            ->published()
            ->create();

        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        // Assert query will return only the published pool as base role user
        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            publishedPools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.publishedPools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    public function testListPoolsReturnsOnlyPublishedAsGuestRoleUser(): void
    {
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);

        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        // Assert query will return only the published pool as guest role user
        $this->actingAs($this->guestUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            publishedPools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.publishedPools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    // test filtering closing_date on publishedPools
    public function testPoolQueryClosingDate(): void
    {
        Pool::factory()->create([
            'published_at' => null,
        ]);
        Pool::factory()->count(2)->create([
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
        ]);
        Pool::factory()->count(3)->create([
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.past_date'),
        ]);
        $timeNow = Carbon::now()->toDateTimeString();

        // assert no argument passed in for closingDate returns 5 published pools
        $response = $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
        query browsePools  {
            publishedPools {
                id
            }
        }
        ',
                []
            );
        $responseCount = count($response->json('data.publishedPools'));
        assertSame(5, $responseCount);

        // assert time argument passed in filters out unpublished and closed pools
        $response2 = $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
        query browsePools ($date: DateTime) {
            publishedPools(closingAfter: $date) {
                id
            }
        }
        ',
                ['date' => $timeNow]
            );

        $response2Count = count($response2->json('data.publishedPools'));
        assertSame(2, $response2Count);
    }

    public function testCanArchiveClosed(): void
    {
        $pool = Pool::factory()->closed()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation ArchivePool($id: ID!) {
                    archivePool(id: $id) {
                        status { value }
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertJsonFragment(['status' => ['value' => PoolStatus::ARCHIVED->name]]);
    }

    public function testCantArchiveActive(): void
    {
        $pool = Pool::factory()->published()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation ArchivePool($id: ID!) {
                    archivePool(id: $id) {
                        status { value }
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertGraphQLErrorMessage('ArchivePoolInvalidStatus');
    }

    public function testCanUnarchiveArchived(): void
    {
        $pool = Pool::factory()->archived()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation UnarchivePool($id: ID!) {
                    unarchivePool(id: $id) {
                        status { value }
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertJsonFragment(['status' => [
                'value' => PoolStatus::CLOSED->name,
            ]]);
    }

    public function testCantUnarchiveClosed(): void
    {
        $pool = Pool::factory()->closed()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation UnarchivePool($id: ID!) {
                    unarchivePool(id: $id) {
                        status { value }
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertGraphQLErrorMessage('UnarchivePoolInvalidStatus');
    }

    public function testCannotPublishWithDeletedSkill(): void
    {
        // create complete but unpublished pool with a deleted skill
        $pool = Pool::factory()
            ->published()
            ->create([
                'published_at' => null,
                'closing_date' => config('constants.far_future_datetime'),
            ]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create(['deleted_at' => config('constants.past_datetime')]);
        $pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);

        // assert cannot publish due to soft deleted essential skill $skill2
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation PublishPool($id: ID!) {
                    publishPool(id: $id) {
                        id
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertGraphQLErrorMessage('EssentialSkillsContainsDeleted');

        $pool->setEssentialPoolSkills([$skill1->id]);

        // assert can now publish with $skill2 removed
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation PublishPool($id: ID!) {
                            publishPool(id: $id) {
                                id
                            }
                        }
                ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertSuccessful();
    }

    public function testCannotReopenWithDeletedSkill(): void
    {
        $pool = Pool::factory()->published()->closed()->create(['team_id' => $this->team->id]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create(['deleted_at' => config('constants.past_datetime')]);
        $pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);

        // assert cannot reopen due to soft deleted essential skill $skill2
        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation changePoolClosingDate($id: ID!, $closingDate: DateTime!) {
                    changePoolClosingDate(id: $id, closingDate: $closingDate) {
                        id
                    }
                }
        ',
            [
                'id' => $pool->id,
                'closingDate' => config('constants.far_future_datetime'),
            ]
        )
            ->assertJsonFragment([
                'validation' => [
                    'id' => [ApiErrorEnums::CANNOT_REOPEN_DELETED_SKILL],
                ],
            ]);

        $pool->setEssentialPoolSkills([$skill1->id]);

        // assert can reopen now with the deleted skill gone
        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation changePoolClosingDate($id: ID!, $closingDate: DateTime!) {
                            changePoolClosingDate(id: $id, closingDate: $closingDate) {
                                id
                            }
                        }
                ',
            [
                'id' => $pool->id,
                'closingDate' => config('constants.far_future_datetime'),
            ]
        )
            ->assertSuccessful();
    }

    public function testPoolScopeCurrentlyActive(): void
    {
        Pool::factory()->create([
            'published_at' => null,
            'closing_date' => null,
        ]);
        Pool::factory()->count(2)->create([
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.past_date'),
        ]);
        Pool::factory()->count(4)->create([
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
        ]);

        $allPools = Pool::all();
        assertSame(count($allPools), 7);

        $activePools = Pool::query()->whereCurrentlyActive()->get();
        assertSame(count($activePools), 4); // assert 7 pools present but only 4 are considered "active"
    }

    public function testPoolIsCompleteAccessor(): void
    {
        $queryPool =
            /** @lang GraphQL */
            '
            query pool($id: UUID!){
                pool(id :$id) {
                    isComplete
                }
            }
        ';
        Classification::factory()->create();
        Skill::factory()->create();

        $completePool = Pool::factory()
            ->withPoolSkills(2, 2)
            ->withAssessments(2)
            ->published()
            ->create([
                'closing_date' => config('constants.far_future_date'),
            ]);
        $incompletePool = Pool::factory()->create([
            'closing_date' => null,
        ]);
        $clearedRelationsPool = Pool::factory()->create();
        $clearedRelationsPool->essentialSkills()->sync([]);

        // test complete pool is marked as true, the others marked as false
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                $queryPool,
                [
                    'id' => $completePool->id,
                ]
            )
            ->assertJsonFragment(['isComplete' => true]);
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                $queryPool,
                [
                    'id' => $incompletePool->id,
                ]
            )
            ->assertJsonFragment(['isComplete' => false]);
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                $queryPool,
                [
                    'id' => $clearedRelationsPool->id,
                ]
            )
            ->assertJsonFragment(['isComplete' => false]);
    }

    public function testPoolIsCompleteAccessorSkillLevel(): void
    {
        $queryPool =
            /** @lang GraphQL */
            '
            query pool($id: UUID!){
                pool(id :$id) {
                    isComplete
                }
            }
        ';
        Skill::factory()->create();

        $completePool = Pool::factory()
            ->published()
            ->withPoolSkills(2, 2)
            ->create([
                'closing_date' => config('constants.far_future_date'),
            ]);

        // test complete pool is marked as true, pool skills have required levels
        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                $queryPool,
                [
                    'id' => $completePool->id,
                ]
            )
            ->assertJsonFragment(['isComplete' => true]);

        // a pool skill level was nulled out, now it should be incomplete
        $poolSkill = PoolSkill::first();
        $poolSkill->required_skill_level = null;
        $poolSkill->save();

        $this->actingAs($this->adminUser, 'api')
            ->graphQL(
                $queryPool,
                [
                    'id' => $completePool->id,
                ]
            )
            ->assertJsonFragment(['isComplete' => false]);
    }

    public function testAssessmentStepValidation(): void
    {
        Classification::factory()->create();
        Skill::factory()->count(5)->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $completePool = Pool::factory()
            ->withPoolSkills(2, 2)
            ->published()
            ->withAssessmentStepAndWithoutPoolSkills()
            ->create([
                'closing_date' => config('constants.far_future_date'),
                'published_at' => null,
            ]);

        // assessment plan marked as incomplete due to steps missing skills
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query pool($id: UUID!) {
                pool(id: $id) {
                    assessmentPlanIsComplete
                }
            }
            ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => false,
                ],
            ],
        ]);

        // Note: Default factory has no pool skills attached to Screening question step
        // assert cannot publish due to assessment steps missing skills
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation PublishPool($id: ID!) {
                            publishPool(id: $id) {
                                id
                            }
                        }
                ',
            [
                'id' => $completePool->id,
            ]
        )
            ->assertGraphQLErrorMessage('AssessmentStepMissingSkills');

        $completePool->load(['assessmentSteps', 'poolSkills']);
        foreach ($completePool->assessmentSteps as $assessmentStep) {
            $assessmentStep->poolSkills()->sync($completePool->poolSkills->pluck('id')->toArray());
        }

        // assessment plan now marked as complete
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    query pool($id: UUID!) {
                        pool(id: $id) {
                            assessmentPlanIsComplete
                        }
                    }
                    ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => true,
                ],
            ],
        ]);

        // assessment plan now marked as complete
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    query pool($id: UUID!) {
                        pool(id: $id) {
                            assessmentPlanIsComplete
                        }
                    }
                    ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => true,
                ],
            ],
        ]);

        // assert can now publish as all steps have attached skills
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation PublishPool($id: ID!) {
                            publishPool(id: $id) {
                                id
                            }
                        }
                ',
            [
                'id' => $completePool->id,
            ]
        )
            ->assertJsonFragment(['id' => $completePool->id]);
    }

    public function testPoolSkillValidation(): void
    {

        Classification::factory()->create();
        Skill::factory()->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        Skill::factory()->create([
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $completePool = Pool::factory()
            ->published()
            ->withPoolSkills(2, 2)
            ->create([
                'closing_date' => config('constants.far_future_date'),
                'published_at' => null,
            ]);

        $poolStepSkills = $completePool->assessmentSteps()->first()->poolSkills()->get()->toArray();

        // confirm application screening missing one skill seeded that isn't technical
        assertEquals(1, count($poolStepSkills));

        $completePool->load(['assessmentSteps', 'poolSkills']);
        foreach ($completePool->assessmentSteps as $assessmentStep) {
            $assessmentStep->poolSkills()->sync([$completePool->poolSkills[0]->id]);
        }

        // assessment plan marked as incomplete due to pool skills missing steps
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    query pool($id: UUID!) {
                        pool(id: $id) {
                            assessmentPlanIsComplete
                        }
                    }
                    ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => false,
                ],
            ],
        ]);

        // assessment plan marked as incomplete due to pool skills missing steps
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    query pool($id: UUID!) {
                        pool(id: $id) {
                            assessmentPlanIsComplete
                        }
                    }
                    ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => false,
                ],
            ],
        ]);

        // assert cannot publish due to the one pool skill lacking an assessment
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation PublishPool($id: ID!) {
                            publishPool(id: $id) {
                                id
                            }
                        }
                ',
            [
                'id' => $completePool->id,
            ]
        )
            ->assertGraphQLErrorMessage('PoolSkillsWithoutAssessments');

        $completePool->load(['assessmentSteps', 'poolSkills']);
        foreach ($completePool->assessmentSteps as $assessmentStep) {
            $assessmentStep->poolSkills()->sync($completePool->poolSkills->pluck('id')->toArray());
        }

        // assessment plan now marked as complete
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                            query pool($id: UUID!) {
                                pool(id: $id) {
                                    assessmentPlanIsComplete
                                }
                            }
                            ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => true,
                ],
            ],
        ]);

        // assessment plan now marked as complete
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
                            query pool($id: UUID!) {
                                pool(id: $id) {
                                    assessmentPlanIsComplete
                                }
                            }
                            ',
            [
                'id' => $completePool->id,
            ]
        )->assertJson([
            'data' => [
                'pool' => [
                    'assessmentPlanIsComplete' => true,
                ],
            ],
        ]);

        // assert successful now that all pool skills have an assessment
        $this->actingAs($this->communityManager, 'api')->graphQL(
            /** @lang GraphQL */
            '
                                mutation PublishPool($id: ID!) {
                                    publishPool(id: $id) {
                                        id
                                    }
                                }
                        ',
            [
                'id' => $completePool->id,
            ]
        )
            ->assertJsonFragment(['id' => $completePool->id]);
    }

    // a pool operator can successfully delete a pool that they created but is still in draft
    public function testCanDeleteDraftPool(): void
    {
        $pool = Pool::factory()
            ->for($this->poolOperator)
            ->withAssessments()
            ->draft()
            ->create([
                'team_id' => $this->team,
            ]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '   mutation DeletePool($id: ID!) {
                    deletePool(id: $id) { id }
                } ',
            ['id' => $pool->id]
        )
            ->assertExactJson([
                'data' => [
                    'deletePool' => ['id' => $pool->id],
                ],
            ]);
    }

    /**
     * @group paginated
     */
    public function testPoolNameScope(): void
    {
        $toBeFound = Pool::factory()->published()
            ->create([
                'name' => ['en' => 'Found EN', 'fr' => 'Found FR'],
            ]);

        Pool::factory()->published()->create([
            'name' => ['en' => 'Not EN', 'fr' => 'Not FR'],
        ]);

        $res = $this->graphQL(
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            name { en fr }
                        }
                    }
                }
            ',
            ['where' => ['name' => 'found']]
        )->assertJsonFragment([
            'id' => $toBeFound->id,
            'name' => $toBeFound->name,
        ]);

        assertSame(1, count($res->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testPoolTeamScope(): void
    {
        $toBeFound = Pool::factory()->published()->create([
            'team_id' => $this->team,
        ]);

        Pool::factory()->published()->create([
            'team_id' => Team::factory()->create(),
        ]);

        $res = $this->graphQL(
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            team { id name }
                        }
                    }
                }
            ',
            [
                'where' => [
                    'team' => $this->team->display_name['en'],
                ],
            ]
        )->assertJsonFragment([
            'id' => $toBeFound->id,
            'team' => [
                'id' => $this->team->id,
                'name' => $this->team->name,
            ],
        ]);

        assertSame(1, count($res->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testPoolStreamsScope(): void
    {
        $ATIP = Pool::factory()->published()->create([
            'stream' => PoolStream::ACCESS_INFORMATION_PRIVACY->name,
        ]);

        $BAS = Pool::factory()->published()->create([
            'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
        ]);

        Pool::factory()->published()->create([
            'stream' => PoolStream::DATABASE_MANAGEMENT->name,
        ]);

        $res = $this->graphQL(
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            stream { value }
                        }
                    }
                }
            ',
            [
                'where' => [
                    'streams' => [
                        PoolStream::ACCESS_INFORMATION_PRIVACY->name,
                        PoolStream::BUSINESS_ADVISORY_SERVICES->name,
                    ],
                ],
            ]
        )->assertJsonFragment([
            'data' => [
                [
                    'id' => $ATIP->id,
                    'stream' => [
                        'value' => PoolStream::ACCESS_INFORMATION_PRIVACY->name,
                    ],
                ],
                [
                    'id' => $BAS->id,
                    'stream' => [
                        'value' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
                    ],
                ],
            ],
        ]);

        assertSame(2, count($res->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testPublishingGroupsScope(): void
    {
        $IT = Pool::factory()->published()->create([
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ]);

        $IAP = Pool::factory()->published()->create([
            'publishing_group' => PublishingGroup::IAP->name,
        ]);

        Pool::factory()->published()->create([
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
        ]);

        $res = $this->graphQL(
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            publishingGroup { value }
                        }
                    }
                }
            ',
            [
                'where' => [
                    'publishingGroups' => [
                        PublishingGroup::IT_JOBS->name,
                        PublishingGroup::IAP->name,
                    ],
                ],
            ]
        )->assertJsonFragment([
            'data' => [
                [
                    'id' => $IT->id,
                    'publishingGroup' => [
                        'value' => PublishingGroup::IT_JOBS->name,
                    ],
                ],
                [
                    'id' => $IAP->id,
                    'publishingGroup' => [
                        'value' => PublishingGroup::IAP->name,
                    ],
                ],
            ],
        ]);

        assertSame(2, count($res->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testPoolStatusScope(): void
    {
        $closed = Pool::factory()->closed()->create();
        $published = Pool::factory()->published()->create();
        $draft = Pool::factory()->create();
        $archived = Pool::factory()->archived()->create();

        $query =
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            status { value }
                        }
                    }
                }
            ';

        $closedRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [PoolStatus::CLOSED->name],
                ],
            ])->assertJsonFragment([
                'id' => $closed->id,
                'status' => [
                    'value' => PoolStatus::CLOSED->name,
                ],
            ]);

        assertSame(1, count($closedRes->json('data.poolsPaginated.data')));

        $publishedRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [PoolStatus::PUBLISHED->name],
                ],
            ])->assertJsonFragment([
                'id' => $published->id,
                'status' => [
                    'value' => PoolStatus::PUBLISHED->name,
                ],
            ]);

        assertSame(1, count($publishedRes->json('data.poolsPaginated.data')));

        $draftRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [PoolStatus::DRAFT->name],
                ],
            ])->assertJsonFragment([
                'id' => $draft->id,
                'status' => [
                    'value' => PoolStatus::DRAFT->name,
                ],
            ]);

        assertSame(1, count($draftRes->json('data.poolsPaginated.data')));

        $archivedRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [PoolStatus::ARCHIVED->name],
                ],
            ])->assertJsonFragment([
                'id' => $archived->id,
                'status' => [
                    'value' => PoolStatus::ARCHIVED->name,
                ],
            ]);

        assertSame(1, count($archivedRes->json('data.poolsPaginated.data')));

        // all but archived
        $emptyRequestRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [],
            ])
            ->assertJsonFragment([
                'id' => $closed->id,
                'status' => [
                    'value' => PoolStatus::CLOSED->name,
                ],
            ])
            ->assertJsonFragment([
                'id' => $published->id,
                'status' => [
                    'value' => PoolStatus::PUBLISHED->name,
                ],
            ])
            ->assertJsonFragment([
                'id' => $draft->id,
                'status' => [
                    'value' => PoolStatus::DRAFT->name,
                ],
            ]);

        assertSame(3, count($emptyRequestRes->json('data.poolsPaginated.data')));

        // no results returned
        Pool::destroy($draft->id);
        $noResultsRes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'statuses' => [PoolStatus::DRAFT->name],
                ],
            ]);

        assertSame(0, count($noResultsRes->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testClassificationScope(): void
    {
        $AA1 = Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create([
                'group' => 'AA',
                'level' => 1,
            ]),
        ]);

        $AA2 = Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create([
                'group' => 'AA',
                'level' => 2,
            ]),
        ]);

        Pool::factory()->published()->create([
            'classification_id' => Classification::factory()->create([
                'group' => 'BB',
                'level' => 1,
            ]),
        ]);

        $query =
            /** @lang GraphQL */
            '
                query ScopePoolName($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                            classification {
                                group
                                level
                            }
                        }
                    }
                }
            ';

        $AA1Res = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'classifications' => [['group' => 'AA', 'level' => 1]],
                ],
            ])->assertJsonFragment([
                'id' => $AA1->id,
                'classification' => ['group' => 'AA', 'level' => 1],
            ]);

        assertSame(1, count($AA1Res->json('data.poolsPaginated.data')));

        $AARes = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'classifications' => [
                        ['group' => 'AA', 'level' => 1],
                        ['group' => 'AA', 'level' => 2],
                    ],
                ],
            ])->assertJsonFragment([
                'data' => [
                    [
                        'id' => $AA1->id,
                        'classification' => ['group' => 'AA', 'level' => 1],
                    ],
                    [
                        'id' => $AA2->id,
                        'classification' => ['group' => 'AA', 'level' => 2],
                    ],
                ],
            ]);

        assertSame(2, count($AARes->json('data.poolsPaginated.data')));
    }

    /**
     * @group paginated
     */
    public function testCanAdminScope(): void
    {
        // two published pools
        $teamPool = Pool::factory()->published()->create([
            'team_id' => $this->team,
        ]);
        Pool::factory()->published()->create([
            'team_id' => Team::factory()->create(),
        ]);

        $query =
            /** @lang GraphQL */
            '
                query poolsPaginated($where: PoolFilterInput) {
                    poolsPaginated(where: $where) {
                        data {
                            id
                        }
                    }
                }
            ';

        $totalPoolsCount = count(Pool::all());
        assertSame(2, $totalPoolsCount);

        // admin sees both pools when true
        $adminQuery = $this
            ->actingAs($this->adminUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'canAdmin' => true,
                ],
            ]);
        assertSame(2, count($adminQuery->json('data.poolsPaginated.data')));

        // pool operator sees the one team pool when true
        $poolOperatorQuery = $this
            ->actingAs($this->poolOperator, 'api')
            ->graphQL($query, [
                'where' => [
                    'canAdmin' => true,
                ],
            ])->assertJsonFragment(['id' => $teamPool->id]);
        assertSame(1, count($poolOperatorQuery->json('data.poolsPaginated.data')));

        // base user sees zero pools when true
        $userQuery = $this
            ->actingAs($this->baseUser, 'api')
            ->graphQL($query, [
                'where' => [
                    'canAdmin' => true,
                ],
            ]);
        assertSame(0, count($userQuery->json('data.poolsPaginated.data')));

        // anonymous sees zero pools when true
        $anonymousQuery = $this
            ->graphQL($query, [
                'where' => [
                    'canAdmin' => true,
                ],
            ]);
        assertSame(0, count($anonymousQuery->json('data.poolsPaginated.data')));

        // empty query returns both pools for anonymous
        $emptyQuery = $this
            ->graphQL($query, [
                'where' => [],
            ]);
        assertSame(2, count($emptyQuery->json('data.poolsPaginated.data')));

        // false returns both pools for anonymous
        $falseQuery = $this
            ->graphQL($query, [
                'where' => [
                    'canAdmin' => false,
                ],
            ]);
        assertSame(2, count($falseQuery->json('data.poolsPaginated.data')));
    }

    /**
     * Test updating a published pool
     *
     * @group editing
     */
    public function testPublishedPoolEditing(): void
    {

        $pool = Pool::factory()
            ->for($this->poolOperator)
            ->withAssessments()
            ->published()
            ->create([
                'team_id' => $this->team,
            ]);

        $mutation =
            /** GraphQL */
            '
            mutation UpdatePublishedPool($id: ID!, $pool: UpdatePublishedPoolInput!) {
                updatePublishedPool(id: $id, pool: $pool) {
                    id
                }
            }
        ';

        $vars = [
            'id' => $pool->id,
            'pool' => [
                'aboutUs' => ['en' => 'About us EN', 'fr' => 'About us FR'],
                'changeJustification' => 'Justification',
            ],
        ];

        // Pool operator cannot edit
        $this->actingAs($this->poolOperator, 'api')
            ->graphQL($mutation, $vars)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Community Manager can edit
        $this->actingAs($this->communityManager, 'api')
            ->graphQL($mutation, $vars)
            ->assertExactJson([
                'data' => [
                    'updatePublishedPool' => ['id' => $pool->id],
                ],
            ]);

        // Platform admins cannot edit
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, $vars)
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // Cannot update without justification
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($mutation, [
                'id' => $pool->id,
                'pool' => [
                    'aboutUs' => [
                        'en' => 'About us EN',
                        'fr' => 'About us FR',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'message' => 'Variable "$pool" got invalid value {"aboutUs":{"en":"About us EN","fr":"About us FR"}}; Field "changeJustification" of required type "String!" was not provided.',
            ]);
    }

    /**
     * @group paginated
     */
    public function testPoolBookmarksScope(): void
    {
        $pool1 = Pool::factory(['created_at' => config('constants.past_date')])->create();
        $pool2 = Pool::factory(['created_at' => config('constants.past_date')])->withBookmark($this->adminUser->id)->create();
        $pool3 = Pool::factory()->create();

        $query =
            /** @lang GraphQL */
            '
            query ScopePoolBookmark($where: PoolFilterInput, $orderBy: [QueryPoolsPaginatedOrderByRelationOrderByClause!], $orderByPoolBookmarks: PoolBookmarksOrderByInput) {
                poolsPaginated(where: $where, orderBy: $orderBy, orderByPoolBookmarks: $orderByPoolBookmarks) {
                    data {
                        id
                        createdDate
                    }
                }
            }
        ';
        $vars = [
            'where' => [],
            'orderByPoolBookmarks' => [
                'column' => 'poolBookmarks',
                'order' => 'ASC',
            ],
            'orderBy' => [
                [
                    'column' => 'created_at',
                    'order' => 'ASC',
                ],
            ],
        ];

        $this
            ->actingAs($this->adminUser, 'api')
            ->graphql($query, $vars)
            ->assertJson([
                'data' => [
                    'poolsPaginated' => [
                        'data' => [
                            ['id' => $pool2->id], // Bookmarked
                            ['id' => $pool1->id],
                            ['id' => $pool3->id],
                        ],
                    ],
                ],
            ]);

        // Add another bookmark
        $pool4 = Pool::factory()->withBookmark($this->adminUser->id)->create();
        $this
            ->actingAs($this->adminUser, 'api')
            ->graphql($query, $vars)
            ->assertJson([
                'data' => [
                    'poolsPaginated' => [
                        'data' => [
                            ['id' => $pool2->id], // Bookmarked
                            ['id' => $pool4->id], // Bookmarked
                            ['id' => $pool1->id],
                            ['id' => $pool3->id],
                        ],
                    ],
                ],
            ]);
    }

    public function testCanViewDepartment()
    {
        $department = Department::factory()->create();

        // a published pool should be visible to a regular user
        $publishedPool = Pool::factory()
            ->published()
            ->for($this->adminUser)
            ->for($department)
            ->create();

        $response = $this->actingAs($this->baseUser, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                query Get($id: UUID!) {
                    pool(id: $id) {
                        department {
                            id
                        }
                    }
                } ',
                ['id' => $publishedPool->id]
            );

        $response->assertJsonFragment([
            'department' => ['id' => $department->id],
        ]);
    }

    // test mutation createPool(...)
    public function testCreatePool()
    {
        $community = Community::factory()->create();
        $classification = Classification::factory()->create();
        $department = Department::factory()->create();

        $response = $this->actingAs($this->poolOperator, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
            mutation CreatePool($userId: ID!, $teamId: ID!, $communityId: ID!, $pool: CreatePoolInput!) {
                createPool(userId: $userId, teamId: $teamId, communityId: $communityId, pool: $pool) {
                    id
                    owner {
                        id
                    }
                    team {
                        id
                    }
                    community {
                        id
                    }
                    classification {
                        id
                    }
                    department {
                        id
                    }
                }
            }',
                [
                    'userId' => $this->poolOperator->id,
                    'teamId' => $this->team->id,
                    'communityId' => $community->id,
                    'pool' => [
                        'classification' => [
                            'connect' => $classification->id,
                        ],
                        'department' => [
                            'connect' => $department->id,
                        ],
                    ],
                ]
            );

        $response->assertJsonFragment([
            'owner' => ['id' => $this->poolOperator->id],
        ])->assertJsonFragment([
            'team' => ['id' => $this->team->id],
        ])->assertJsonFragment([
            'community' => ['id' => $community->id],
        ])->assertJsonFragment([
            'classification' => ['id' => $classification->id],
        ])->assertJsonFragment([
            'department' => ['id' => $department->id],
        ]);
    }

    public function testDuplicatePool()
    {
        $this->seed([
            SkillFamilySeeder::class,
            SkillSeeder::class,
        ]);

        $department = Department::factory()->create();

        $original = Pool::factory()
            ->draft()
            ->for($this->poolOperator)
            ->withPoolSkills(3, 3)
            ->create();

        $response = $this->actingAs($this->poolOperator, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                mutation Duplicate($id: ID!, $teamId: ID!, $pool: DuplicatePoolInput!) {
                    duplicatePool(id: $id, teamId: $teamId, pool: $pool) {
                        id
                    }
                }',
                [
                    'id' => $original->id,
                    'teamId' => $this->team->id,
                    'pool' => ['departmentId' => $department->id],
                ]
            );

        $responseJson = $response->json();

        $duplicated = Pool::with('poolSkills.skill')->find($responseJson['data']['duplicatePool']['id']);

        $this->assertStringContainsString($original->name['en'], $duplicated->name['en']);
        $this->assertStringContainsString($original->name['fr'], $duplicated->name['fr']);

        // Check exact copied values
        $keysToPluck = ['operational_requirements', 'key_tasks', 'your_impact', 'security_clearance', 'advertisement_language', 'is_remote', 'what_to_expect', 'special_note', 'opportunity_length', 'what_to_expect_admission', 'about_us', 'classification_id'];

        $originalValues = Arr::only($original->toArray(), $keysToPluck);
        $duplicatedValues = Arr::only($duplicated->toArray(), $keysToPluck);

        $this->assertEquals($originalValues, $duplicatedValues);

        $originalSkills = array_map([$this, 'filterSkillKeys'], $original->poolSkills->toArray());
        $duplicatedSkills = array_map([$this, 'filterSkillKeys'], $duplicated->poolSkills->toArray());

        $this->assertEquals($originalSkills, $duplicatedSkills);
    }

    private function filterSkillKeys(array $poolSkill)
    {
        return Arr::only($poolSkill, ['type', 'required_skill_level', 'skill_id']);
    }
}
