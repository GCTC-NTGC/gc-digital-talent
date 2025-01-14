<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\ScreeningQuestionResponse;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ScreeningQuestionsTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $team;

    protected $teamName = 'test-team';

    protected $teamUser;

    protected $adminUser;

    protected $applicantUser;

    protected $responderUser;

    protected $communityUser;

    protected $pool;

    protected $poolSkillId;

    protected $publishedPool;

    protected $unauthorizedMessage = 'This action is unauthorized.';

    protected $createOrUpdateScreeningQuestionAssessmentStep =
        /** @lang GraphQL */
        '
        mutation createOrUpdateScreeningQuestionAssessmentStep(
            $poolId: UUID!,
            $screeningQuestions: [SyncScreeningQuestionsInput],
            $assessmentStep: ScreeningQuestionAssessmentStepInput
            ) {
                createOrUpdateScreeningQuestionAssessmentStep(
                    poolId: $poolId,
                    screeningQuestions: $screeningQuestions,
                    assessmentStep: $assessmentStep
                    ) {
                    id
                }
            }
    ';

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

    protected $queryScreeningQuestionAssessmentStep =
        /** @lang GraphQL */
        '
        query pool($id: UUID!) {
            pool(id: $id) {
                id
                screeningQuestions {
                    id
                    assessmentStep {
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
        Skill::factory()->count(3)->create();
        $this->pool = Pool::factory()->draft()->withPoolSkills(2, 2)->create([
            'team_id' => $this->team->id,
        ]);
        $this->poolSkillId = (PoolSkill::all()->pluck('id')->toArray())[0];
        $this->publishedPool = Pool::factory()->published()->WithPoolSkills(2, 2)->WithQuestions(2, 2)->create([
            'team_id' => $this->team->id,
        ]);
        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);
        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);
        $this->responderUser = User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder-user@test.com',
                'sub' => 'request-responder-user@test.com',
            ]);
        $this->communityUser = User::factory()
            ->asApplicant()
            ->asCommunityManager()
            ->create([
                'email' => 'community-user@test.com',
                'sub' => 'community-user@test.com',
            ]);
    }

    public function testScreeningQuestionSyncPermission(): void
    {
        $variables = [
            'poolId' => $this->pool->id,
            'screeningQuestions' => [
                [
                    'question' => [
                        'en' => 'en?',
                        'fr' => 'fr?',
                    ],
                ],
            ],
            'assessmentStep' => [
                'title' => [
                    'en' => 'title en',
                    'fr' => 'title fr',
                ],
                'poolSkills' => [
                    'sync' => [$this->poolSkillId],
                ],
            ],
        ];

        // assert only pool operator may set the screening questions (use the mutation)
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->applicantUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->responderUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->communityUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);
    }

    public function testScreeningQuestionIntoAssessmentStep(): void
    {
        $variables = [
            'id' => $this->publishedPool->id,
        ];

        // assert all except applicant may query screening questions -> assessment step
        $this->actingAs($this->teamUser, 'api')->graphQL(
            $this->queryScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertSuccessful();
        $this->actingAs($this->adminUser, 'api')->graphQL(
            $this->queryScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertSuccessful();
        $this->actingAs($this->applicantUser, 'api')->graphQL(
            $this->queryScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);
        $this->actingAs($this->responderUser, 'api')->graphQL(
            $this->queryScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertSuccessful();
        $this->actingAs($this->communityUser, 'api')->graphQL(
            $this->queryScreeningQuestionAssessmentStep,
            $variables
        )
            ->assertSuccessful();
    }

    public function testCreatingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_id' => $this->publishedPool->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->applicantUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();
        $questionId = $this->publishedPool->screeningQuestions->first()->id;

        // assert response is successfully created
        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' => [
                        [
                            'screeningQuestion' => [
                                'connect' => $questionId,
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
        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' => [
                        [
                            'screeningQuestion' => [
                                'connect' => $questionId,
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

    public function testUpdatingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_id' => $this->publishedPool->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->applicantUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();
        $questionId = $this->publishedPool->screeningQuestions->first()->id;

        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' => [
                        [
                            'screeningQuestion' => [
                                'connect' => $questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = ScreeningQuestionResponse::sole()['id'];

        // assert updating works
        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
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

    public function testDeletingScreeningQuestionResponses(): void
    {
        $application = PoolCandidate::factory()->create([
            'pool_id' => $this->publishedPool->id,
            'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
            'user_id' => $this->applicantUser->id,
        ]);
        ScreeningQuestionResponse::all()->each->delete();
        $questionId = $this->publishedPool->screeningQuestions->first()->id;

        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
                    'create' => [
                        [
                            'screeningQuestion' => [
                                'connect' => $questionId,
                            ],
                            'answer' => 'the answer',
                        ],
                    ],
                ],
            ],
        ])->assertJsonFragment([
            'answer' => 'the answer',
        ]);

        $createdResponseId = ScreeningQuestionResponse::sole()['id'];

        // assert deleting works
        $this->actingAs($this->applicantUser, 'api')->graphQL($this->updateApplication, [
            'id' => $application->id,
            'application' => [
                'screeningQuestionResponses' => [
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
