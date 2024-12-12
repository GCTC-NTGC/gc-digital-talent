<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Models\GeneralQuestionResponse;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class GeneralQuestionResponsesTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $teamUser;

    protected $team;

    protected $teamName = 'application-test-team';

    protected $pool;

    protected $questionId;

    protected $updateApplication =
        /** @lang GraphQL */
        '
        mutation updateApplication($id: ID!, $application: UpdateApplicationInput!) {
            updateApplication(id: $id, application: $application) {
                generalQuestionResponses {
                    id
                    answer
                    generalQuestion {
                        id
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
        $this->pool = Pool::factory()->draft()->WithPoolSkills(2, 2)->WithQuestions(2, 2)->create([
            'team_id' => $this->team->id,
        ]);
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
        $this->questionId = $this->pool->generalQuestions()->pluck('id')->toArray()[0];
    }

    public function testCreatingGeneralQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->teamUser->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        // assert response is successfully created
        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'create' => [
                        [
                            'generalQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        // assert attempting to create another response to the same question fails
        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'create' => [
                        [
                            'generalQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer 2',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'updateApplication' => null,
        ]);
    }

    public function testUpdatingGeneralQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->teamUser->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'create' => [
                        [
                            'generalQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = GeneralQuestionResponse::sole()['id'];

        // assert updating works
        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'update' => [
                        [
                            'id' => $createdResponseId,
                            'answer' => 'the new answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the new answer',
        ]);
    }

    public function testDeletingGeneralQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->teamUser->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'create' => [
                        [
                            'generalQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = GeneralQuestionResponse::sole()['id'];

        // assert deleting works
        $this->actingAs($this->teamUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'generalQuestionResponses' => [
                    'delete' => [
                        $createdResponseId,
                    ],
                ],
            ],
        ])->assertJsonMissing([
            'answer' => 'the answer',
        ]);
    }
}
