<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\GeneralQuestion;
use App\Models\Pool;
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

    protected $processOperator;

    protected $community;

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
        $this->community = Community::factory()->create(['name' => 'test-community-application']);
        $this->pool = Pool::factory()->draft()
            ->withPoolSkills(2, 2)
            ->withGeneralQuestions(3)
            ->withScreeningQuestions(1)
            ->create([
                'community_id' => $this->community->id,
            ]); // this seeds 3 questions onto the pool
        $this->processOperator = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->pool->id)
            ->create([
                'email' => 'process-operator@test.com',
                'sub' => 'process-operator@test.com',
            ]);

    }

    public function testCreatingGeneralQuestions(): void
    {
        // create a question and assert it appears in the response

        $this->actingAs($this->processOperator, 'api')->graphQL($this->updatePoolMutation, [
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

        $this->actingAs($this->processOperator, 'api')->graphQL($this->updatePoolMutation, [
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

        $this->actingAs($this->processOperator, 'api')->graphQL($this->updatePoolMutation, [
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
