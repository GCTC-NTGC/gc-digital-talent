<?php

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use App\Models\ScreeningQuestionResponse;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

class ScreeningQuestionResponsesTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    protected $teamUser;
    protected $team;
    protected $teamName = "application-test-team";
    protected $pool;
    protected $questionId;

    protected $updateApplication =
    /** @lang GraphQL */
    '
        mutation updateApplication($id: ID!, $application: UpdateApplicationInput!) {
            updateApplication(id: $id, application: $application) {
                screeningQuestionResponses {
                    id
                    answer
                    screeningQuestion {
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
        $this->pool = Pool::factory()->draft()->create([
            'team_id' => $this->team->id,
        ]);
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
        $this->questionId = $this->pool->screeningQuestions()->pluck('id')->toArray()[0];
    }

    public function testCreatingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => $this->teamUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();

        // assert response is successfully created
        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' =>
                    [
                        [
                            'screeningQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        // assert attempting to create another response to the same question fails
        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' =>
                    [
                        [
                            'screeningQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer 2',
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'updateApplication' => null,
        ]);
    }

    public function testUpdatingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => $this->teamUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();

        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' =>
                    [
                        [
                            'screeningQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = ScreeningQuestionResponse::sole()['id'];

        // assert updating works
        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'update' =>
                    [
                        [
                            'id' => $createdResponseId,
                            'answer' => 'the new answer',
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'answer' => 'the new answer',
        ]);
    }

    public function testDeletingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => $this->teamUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();

        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' =>
                    [
                        [
                            'screeningQuestion' => [
                                'connect' => $this->questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ]
                ],
            ]
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = ScreeningQuestionResponse::sole()['id'];

        // assert deleting works
        $this->actingAs($this->teamUser, "api")->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'delete' =>
                    [
                        $createdResponseId,
                    ]
                ],
            ]
        ])->assertJsonMissing([
            'answer' => 'the answer',
        ]);
    }
}
