<?php

namespace Tests\Feature;

use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertSame;

class GeneralQuestionTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $teamUser;

    protected $team;

    protected $teamName = 'application-test-team';

    protected $pool;

    protected $updatePoolMutation =
        /** @lang GraphQL */
        '
        mutation updatePool($id: ID! ,$pool: UpdatePoolInput!) {
            updatePool(id: $id, pool: $pool) {
                generalQuestions {
                    id
                    question {
                        en
                        fr
                    }
                }
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();
        $this->team = Team::factory()->create([
            'name' => $this->teamName,
        ]);
        $this->pool = Pool::factory()->draft()->WithPoolSkills(2, 2)->WithQuestions(3, 1)->create([
            'team_id' => $this->team->id,
        ]); // this seeds 3 questions onto the pool
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
    }

    public function testCreatingGeneralQuestions(): void
    {
        // create a question and assert it appears in the response

        $this->actingAs($this->teamUser, 'api')->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'generalQuestions' => [
                    'create' => [
                        [
                            'question' => [
                                'en' => 'hardcoded english',
                                'fr' => 'hardcoded french',
                            ],
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'en' => 'hardcoded english',
        ]);

        // assert question count for pool went from 3 -> 4

        $poolQuestions = $this->pool->generalQuestions()->pluck('id')->toArray();
        assertSame(4, count($poolQuestions));
    }

    public function testUpdatingGeneralQuestions(): void
    {
        $questionId = GeneralQuestion::first()->id;

        // update a question and assert it changed in the response

        $this->actingAs($this->teamUser, 'api')->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'generalQuestions' => [
                    'update' => [
                        [
                            'id' => $questionId,
                            'question' => [
                                'en' => 'hardcoded english',
                                'fr' => 'hardcoded french',
                            ],
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'en' => 'hardcoded english',
        ]);

        // assert question count remained the same at 3

        $poolQuestions = $this->pool->generalQuestions()->pluck('id')->toArray();
        assertSame(3, count($poolQuestions));
    }

    public function testDeletingGeneralQuestion(): void
    {
        $questionId = GeneralQuestion::first()->id;

        // delete a question and assert it isn't present in the response

        $this->actingAs($this->teamUser, 'api')->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'generalQuestions' => [
                    'delete' => [
                        'id' => $questionId,
                    ],
                ],
            ],
        ])->assertJsonMissing([
            'id' => $questionId,
        ]);

        // assert question count went down from 3 -> 2

        $poolQuestions = $this->pool->generalQuestions()->pluck('id')->toArray();
        assertSame(2, count($poolQuestions));
    }
}
