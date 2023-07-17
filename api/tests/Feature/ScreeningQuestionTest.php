<?php

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use App\Models\ScreeningQuestion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

use function PHPUnit\Framework\assertSame;

class ScreeningQuestionTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $teamUser;
    protected $team;
    protected $teamName = "application-test-team";
    protected $pool;

    protected $updatePoolMutation =
    /** @lang GraphQL */
    '
        mutation updatePool($id: ID! ,$pool: UpdatePoolInput!) {
            updatePool(id: $id, pool: $pool) {
                screeningQuestions {
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
        $this->pool = Pool::factory()->draft()->create([
            'team_id' => $this->team->id,
        ]); // this seeds 3 questions onto the pool
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
    }

    public function testCreatingScreeningQuestions(): void
    {
        // create a question and assert it appears in the response

        $this->actingAs($this->teamUser, "api")->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'screeningQuestions' => [
                    'create' =>
                    [
                        [
                            'question' => [
                                'en' => 'hardcoded english',
                                'fr' => 'hardcoded french',
                            ],
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'en' => 'hardcoded english',
        ]);

        // assert question count for pool went from 3 -> 4

        $poolQuestions = $this->pool->screeningQuestions()->pluck('id')->toArray();
        assertSame(4, count($poolQuestions));
    }

    public function testUpdatingScreeningQuestions(): void
    {
        $questionId = ScreeningQuestion::first()->id;

        // update a question and assert it changed in the response

        $this->actingAs($this->teamUser, "api")->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'screeningQuestions' => [
                    'update' =>
                    [
                        [
                            'id' => $questionId,
                            'question' => [
                                'en' => 'hardcoded english',
                                'fr' => 'hardcoded french',
                            ],
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'en' => 'hardcoded english',
        ]);

        // assert question count remained the same at 3

        $poolQuestions = $this->pool->screeningQuestions()->pluck('id')->toArray();
        assertSame(3, count($poolQuestions));
    }

    public function testDeletingScreeningQuestion(): void
    {
        $questionId = ScreeningQuestion::first()->id;

        // delete a question and assert it isn't present in the response

        $this->actingAs($this->teamUser, "api")->graphQL($this->updatePoolMutation, [
            'id' => $this->pool->id,
            'pool' => [
                'screeningQuestions' => [
                    'delete' =>
                    [
                        'id' => $questionId,
                    ]
                ],
            ]
        ])->assertJsonMissing([
            'id' => $questionId,
        ]);

        // assert question count went down from 3 -> 2

        $poolQuestions = $this->pool->screeningQuestions()->pluck('id')->toArray();
        assertSame(2, count($poolQuestions));
    }
}
