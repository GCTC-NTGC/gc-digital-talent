<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Models\Community;
use App\Models\GeneralQuestionResponse;
use App\Models\Pool;
use App\Models\PoolCandidate;
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

    protected $processOperator;

    protected $community;

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
        $this->community = Community::factory()->create(['name' => 'test-community-application']);
        $this->pool = Pool::factory()
            ->draft()
            ->withPoolSkills()
            ->withGeneralQuestions()
            ->withScreeningQuestions()
            ->create([
                'community_id' => $this->community->id,
            ]);
        $this->processOperator = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->pool->id)
            ->create([
                'email' => 'process-operator@test.com',
                'sub' => 'process-operator@test.com',
            ]);

        $this->questionId = $this->pool->generalQuestions()->pluck('id')->toArray()[0];
    }

    public function testCreatingGeneralQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'application_status' => ApplicationStatus::DRAFT->name,
            'user_id' => $this->processOperator->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        // assert response is successfully created
        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
            'application_status' => ApplicationStatus::DRAFT->name,
            'user_id' => $this->processOperator->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
            'application_status' => ApplicationStatus::DRAFT->name,
            'user_id' => $this->processOperator->id,
        ]);
        GeneralQuestionResponse::all()->each->delete();

        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
        $this->actingAs($this->processOperator, 'api')->graphQL($this->updateApplication, [
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
