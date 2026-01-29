<?php

namespace Tests\Feature;

use App\Enums\AssessmentStepType;
use App\Enums\SkillCategory;
use App\Models\AssessmentStep;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\ScreeningQuestion;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;

class AssessmentStepTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $communityUser;

    protected $community;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->community = Community::factory()->create(['name' => 'test-community']);
        $this->pool = Pool::factory()->draft()->create([
            'community_id' => $this->community->id,
        ]);
        $this->communityUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-user@test.com',
                'sub' => 'community-user@test.com',
            ]);

    }

    protected $createAssessmentStep =
        /** @lang GraphQL */
        '
        mutation createAssessmentStep($poolId: UUID!, $assessmentStep: AssessmentStepInput!){
            createAssessmentStep(poolId: $poolId, assessmentStep: $assessmentStep) {
                id
                type { value }
                title {
                    en
                    fr
                }
                sortOrder
                poolSkills {
                    id
                }
            }
        }
    ';

    protected $updateAssessmentStep =
        /** @lang GraphQL */
        '
        mutation updateAssessmentStep($id: UUID!, $assessmentStep: AssessmentStepInput!){
            updateAssessmentStep(id: $id, assessmentStep: $assessmentStep) {
                id
                type { value }
                title {
                    en
                    fr
                }
                sortOrder
                poolSkills {
                    id
                }
            }
        }
    ';

    protected $deleteAssessmentStep =
        /** @lang GraphQL */
        '
        mutation deleteAssessmentStep($id: UUID!){
            deleteAssessmentStep(id: $id) {
                id
            }
        }
    ';

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

    // test creating an assessment
    public function testCreatingAssessmentStep(): void
    {
        $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->createAssessmentStep,
                [
                    'poolId' => $this->pool->id,
                    'assessmentStep' => [
                        'type' => AssessmentStepType::ADDITIONAL_ASSESSMENT->name,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ]
            )
            ->assertJsonFragment([
                'type' => [
                    'value' => AssessmentStepType::ADDITIONAL_ASSESSMENT->name,
                ],
                'title' => [
                    'en' => 'en',
                    'fr' => 'fr',
                ],
                'sortOrder' => 2,
            ]);
    }

    // test updating an existing assessment
    public function testUpdatingAssessmentStep(): void
    {
        $assessment = AssessmentStep::factory()->create(
            [
                'pool_id' => $this->pool->id,
                'type' => AssessmentStepType::ADDITIONAL_ASSESSMENT->name,
            ]
        );

        $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->updateAssessmentStep,
                [
                    'id' => $assessment->id,
                    'assessmentStep' => [
                        'type' => AssessmentStepType::PSC_EXAM->name,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $assessment->id,
                'type' => [
                    'value' => AssessmentStepType::PSC_EXAM->name,
                ],
                'title' => [
                    'en' => 'en',
                    'fr' => 'fr',
                ],
                'sortOrder' => 2,
            ]);
    }

    // test an assessment exists before deletion and then is completely gone after
    public function testDeletingAssessmentStep(): void
    {
        $assessment = AssessmentStep::factory()->create(
            ['pool_id' => $this->pool->id]
        );
        assertNotNull(AssessmentStep::all()->find($assessment->id));

        $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->deleteAssessmentStep,
                [
                    'id' => $assessment->id,
                ]
            )
            ->assertSuccessful();
        assertNull(AssessmentStep::all()->find($assessment->id));
    }

    // test syncing a pool's skills with its assessment steps
    public function testSyncAssessmentStepPoolSkill(): void
    {
        // avoid creating technical skills to prevent them
        // syncing with the pools APPLICATION_SCREENING step
        $skill1 = Skill::factory()->create([
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $skill2 = Skill::factory()->create([
            'category' => SkillCategory::BEHAVIOURAL->name,
        ]);
        $this->pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);

        // assert having set two essential pool skills the counts line up
        assertEquals(2, count($this->pool->essentialSkills));
        assertEquals(2, count($this->pool->poolSkills));
        assertEquals(2, count(PoolSkill::all()));

        $poolSkillIds = PoolSkill::all()->pluck('id')->toArray();

        // create an AssessmentStep and sync it to both the pool's skills
        $response = $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->createAssessmentStep,
                [
                    'poolId' => $this->pool->id,
                    'assessmentStep' => [
                        'type' => AssessmentStepType::PSC_EXAM->name,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                        'poolSkills' => [
                            'sync' => $poolSkillIds,
                        ],
                    ],
                ]
            )
            ->assertSuccessful();
        $this->pool->refresh();
        $assessmentStep = AssessmentStep::all()->find($response->json('data.createAssessmentStep.id'));

        // assert an assessment step created that through the pivot connected it to two pool skills
        assertNotNull($assessmentStep);
        $assessmentStep->load('poolSkills');
        assertEquals(2, count($assessmentStep->poolSkills));

        // assert a pool skill is associated with one assessment step
        assertEquals(1, count(PoolSkill::first()->assessmentSteps));

        // assert the pool can access the new assessment step
        assertNotNull($this->pool->assessmentSteps->find($assessmentStep->id));

        // delete the assessment step
        $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->deleteAssessmentStep,
                [
                    'id' => $assessmentStep->id,
                ]
            )
            ->assertSuccessful();
        $this->pool->refresh();

        // make assertions again now that the assessment was deleted
        assertNull(AssessmentStep::all()->find($assessmentStep->id));
        assertEquals(0, count(PoolSkill::first()->assessmentSteps));
    }

    // test that you cannot add screening or application related assessment steps
    public function testAssessmentStepTypeValidation(): void
    {
        $this->actingAs($this->communityUser, 'api')
            ->graphQL(
                $this->createAssessmentStep,
                [
                    'poolId' => $this->pool->id,
                    'assessmentStep' => [
                        'type' => AssessmentStepType::APPLICATION_SCREENING->name,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ]
            )
            ->assertGraphQLValidationError('assessmentStep.type', 'InvalidAssessmentTypeSelection');
    }

    // test screening questions and pool skills
    public function testScreeningQuestionsAndSkills(): void
    {
        Skill::factory()->count(3)->create();
        $testPool = Pool::factory()
            ->draft()
            ->withPoolSkills(2, 2)
            ->withGeneralQuestions(2)
            ->withScreeningQuestions(2)
            ->create([
                'community_id' => $this->community->id,
            ]);
        $screeningQuestion = $testPool->screeningQuestions[0]; // first factory created question
        $poolSkillId = (PoolSkill::all()->pluck('id')->toArray())[0];

        // fails if no pool skills attached
        $this->actingAs($this->communityUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            [
                'poolId' => $testPool->id,
                'screeningQuestions' => [
                    [
                        'id' => $screeningQuestion->id,
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
                        'sync' => null,
                    ],
                ],
            ])
            ->assertJsonFragment([
                'message' => 'Variable "$assessmentStep" got invalid value null at "assessmentStep.poolSkills.sync"; Expected non-nullable type "[UUID!]!" not to be null.',
            ]);

        // successful now that pool skills is non-null
        $this->actingAs($this->communityUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            [
                'poolId' => $testPool->id,
                'screeningQuestions' => [
                    [
                        'id' => $screeningQuestion->id,
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
                        'sync' => [$poolSkillId],
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $testPool->id]);

        // only one screening question now attached
        $testPool->refresh();
        assertEquals(1, count($testPool->screeningQuestions));

        $totalSteps = AssessmentStep::where('pool_id', $testPool->id)->get();
        $screeningStep = AssessmentStep::where('pool_id', $testPool->id)
            ->where('type', AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name)
            ->with('poolSkills')
            ->first();

        // assert two assessments steps exist, and the screening question step is attached to one skill
        assertEquals(2, count($totalSteps));
        assertEquals(1, count($screeningStep->poolSkills));
    }

    // test screening questions mutation creates the associated assessment step
    public function testScreeningQuestionsCreatingAssessmentStep(): void
    {
        Skill::factory()->count(3)->create();
        $testPool = Pool::factory()
            ->draft()
            ->withPoolSkills(2, 2)
            ->withGeneralQuestions(2)
            ->withScreeningQuestions(2)
            ->create([
                'community_id' => $this->community->id,
            ]);
        AssessmentStep::truncate();
        $poolSkillId = (PoolSkill::all()->pluck('id')->toArray())[0];

        $this->actingAs($this->communityUser, 'api')->graphQL(
            $this->createOrUpdateScreeningQuestionAssessmentStep,
            [
                'poolId' => $testPool->id,
                'screeningQuestions' => [
                    [
                        'question' => [
                            'en' => 'en?',
                            'fr' => 'fr?',
                        ],
                        'sortOrder' => 2,
                    ],
                ],
                'assessmentStep' => [
                    'title' => [
                        'en' => 'title en',
                        'fr' => 'title fr',
                    ],
                    'poolSkills' => [
                        'sync' => [$poolSkillId],
                    ],
                ],
            ])
            ->assertJsonFragment(['id' => $testPool->id]);

        // single assessment step created of screening questions type
        $assessmentSteps = AssessmentStep::all();
        $assessmentStep = $assessmentSteps[0];
        assertEquals(1, count($assessmentSteps));
        assertEquals(AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name, $assessmentStep->type);

        // single screening question exists with correct sort order value
        $screeningQuestions = ScreeningQuestion::all();
        $screeningQuestion = $screeningQuestions[0];
        assertEquals(1, count($screeningQuestions));
        assertEquals(2, $screeningQuestion->sort_order);
    }
}
