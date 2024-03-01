<?php

use App\Enums\PoolStatus;
use App\Enums\SkillCategory;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertSame;

class PoolTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $team;

    protected $poolOperator;

    protected $adminUser;

    protected $guestUser;

    protected $baseUser;

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
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::PUBLISHED->name,
                ],
            ],
        ]);

        // Assert query with pool 2 will return accessor as closed
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::CLOSED->name,
                ],
            ],
        ]);

        // Assert query with pool 3 will return accessor as draft
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13") {
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::DRAFT->name,
                ],
            ],
        ]);

        // Assert query with pool 4 will return accessor as draft
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14") {
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::DRAFT->name,
                ],
            ],
        ]);

        // Assert query with pool 5 will return accessor as archived
        $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15") {
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::ARCHIVED->name,
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
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::PUBLISHED->name,
                ],
            ],
        ]);

        // Assert query with pool 2 will return as closed
        $this->graphQL(
            /** @lang GraphQL */
            '
        query pool {
            pool(id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12") {
                status
            }
        }
    '
        )->assertJson([
            'data' => [
                'pool' => [
                    'status' => PoolStatus::CLOSED->name,
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
            pools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.pools')
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
            pools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.pools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    public function testListPoolsReturnsOnlyPublishedAsBaseRoleUser(): void
    {
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);

        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        // Assert query will return only the published pool as base role user
        $this->actingAs($this->baseUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            pools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.pools')
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
            pools {
                id
            }
        }
        '
        )
            ->assertJsonCount(1, 'data.pools')
            ->assertJsonFragment(['id' => $publishedPool->id]);
    }

    // This error is not desired behavior, but is expected due to current implementation.
    public function testListPoolsReturnsAuthErrorAsNoRoleUser(): void
    {
        $publishedPool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
        ]);

        $draftPool = Pool::factory()->create([
            'published_at' => null,
        ]);

        $noRoleUser = User::factory()->create();
        $noRoleUser->syncRoles([]);
        // Assert query will return only the published pool as guest user
        $this->actingAs($noRoleUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
        query browsePools {
            pools {
                id
            }
        }
        '
        )->assertGraphQLErrorMessage('This action is unauthorized.');
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
                        status
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertJsonFragment(['status' => PoolStatus::ARCHIVED->name]);
    }

    public function testCantArchiveActive(): void
    {
        $pool = Pool::factory()->published()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation ArchivePool($id: ID!) {
                    archivePool(id: $id) {
                        status
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
                        status
                    }
                }
        ',
            [
                'id' => $pool->id,
            ]
        )
            ->assertJsonFragment(['status' => PoolStatus::CLOSED->name]);
    }

    public function testCantUnarchiveClosed(): void
    {
        $pool = Pool::factory()->closed()->create(['team_id' => $this->team->id]);

        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                mutation UnarchivePool($id: ID!) {
                    unarchivePool(id: $id) {
                        status
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
        $classification = Classification::factory()->create();
        $pool = Pool::factory()->published()->create([
            'published_at' => null,
            'closing_date' => config('constants.far_future_datetime'),
        ]);
        $pool->classifications()->sync([$classification->id]);
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create(['deleted_at' => config('constants.past_datetime')]);
        $pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);

        // assert cannot publish due to soft deleted essential skill $skill2
        $this->actingAs($this->adminUser, 'api')->graphQL(
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
        $this->actingAs($this->adminUser, 'api')->graphQL(
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
                mutation changePoolClosingDate($id: ID!, $newClosingDate: DateTime!) {
                    changePoolClosingDate(id: $id, newClosingDate: $newClosingDate) {
                        id
                    }
                }
        ',
            [
                'id' => $pool->id,
                'newClosingDate' => config('constants.far_future_datetime'),
            ]
        )
            ->assertGraphQLErrorMessage('CannotReopenUsingDeletedSkill');

        $pool->setEssentialPoolSkills([$skill1->id]);

        // assert can reopen now with the deleted skill gone
        $this->actingAs($this->poolOperator, 'api')->graphQL(
            /** @lang GraphQL */
            '
                        mutation changePoolClosingDate($id: ID!, $newClosingDate: DateTime!) {
                            changePoolClosingDate(id: $id, newClosingDate: $newClosingDate) {
                                id
                            }
                        }
                ',
            [
                'id' => $pool->id,
                'newClosingDate' => config('constants.far_future_datetime'),
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

        $activePools = Pool::where((function ($query) {
            Pool::scopeCurrentlyActive($query);
        }))->get();
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

        $completePool = Pool::factory()->published()->create([
            'closing_date' => config('constants.far_future_date'),
        ]);
        $incompletePool = Pool::factory()->create([
            'closing_date' => null,
        ]);
        $clearedRelationsPool = Pool::factory()->create();
        $clearedRelationsPool->essentialSkills()->sync([]);
        $clearedRelationsPool->classifications()->sync([]);

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

    public function testAssessmentStepValidation(): void
    {
        if (! config('feature.record_of_decision')) {
            $this->markTestSkipped('record_of_decision is off');
        }

        Classification::factory()->create();
        Skill::factory()->count(5)->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        $completePool = Pool::factory()->published()->create([
            'closing_date' => config('constants.far_future_date'),
            'published_at' => null,
        ]);

        // assert cannot publish due to the additional assessment step not having any pool skills
        // Note: Default factory has no pool skills attached to Screening question step
        $this->actingAs($this->adminUser, 'api')->graphQL(
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

        // assert can now publish as all steps have attached skills
        $this->actingAs($this->adminUser, 'api')->graphQL(
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
        if (! config('feature.record_of_decision')) {
            $this->markTestSkipped('record_of_decision is off');
        }

        Classification::factory()->create();
        Skill::factory()->create([
            'category' => SkillCategory::TECHNICAL->name,
        ]);
        Skill::factory()->create([
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $completePool = Pool::factory()->published()->create([
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

        // assert cannot publish due to the one pool skill lacking an assessment
        $this->actingAs($this->adminUser, 'api')->graphQL(
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

        // assert successful now that all pool skills have an assessment
        $this->actingAs($this->adminUser, 'api')->graphQL(
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
}
