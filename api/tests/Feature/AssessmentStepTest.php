<?php

use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class AssessmentStepTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $teamUser;

    protected $team;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();
        $this->team = Team::factory()->create();
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
    }

    protected $createAssessmentStep =
    /** @lang GraphQL */
    '
        mutation createAssessmentStep($poolId: UUID!, $assessmentStep: AssessmentStepInput!){
            createAssessmentStep(poolId: $poolId, assessmentStep: $assessmentStep) {
                id
                type
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
                type
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

    // test creating an assessment
    public function testCreatingAssessmentStep(): void
    {
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentStep,
                [
                    'poolId' => $this->pool->id,
                    'assessmentStep' => [
                        'type' => 'abc',
                        'sortOrder' => 1,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ]
            )
            ->assertJsonFragment([
                'type' => 'abc',
                'title' => [
                    'en' => 'en',
                    'fr' => 'fr',
                ],
                'sortOrder' => 1,
            ]);
    }

    // test updating an existing assessment
    public function testUpdatingAssessmentStep(): void
    {
        $assessment = AssessmentStep::factory()->create(
            ['pool_id' => $this->pool->id]
        );

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->updateAssessmentStep,
                [
                    'id' => $assessment->id,
                    'assessmentStep' => [
                        'type' => 'abc',
                        'sortOrder' => 1,
                        'title' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ]
            )
            ->assertJsonFragment([
                'id' => $assessment->id,
                'type' => 'abc',
                'title' => [
                    'en' => 'en',
                    'fr' => 'fr',
                ],
                'sortOrder' => 1,
            ]);
    }

    // test an assessment exists before deletion and then is completely gone after
    public function testDeletingAssessmentStep(): void
    {
        $assessment = AssessmentStep::factory()->create(
            ['pool_id' => $this->pool->id]
        );
        assertEquals(1, count(AssessmentStep::all()));

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->deleteAssessmentStep,
                [
                    'id' => $assessment->id,
                ]
            )
            ->assertSuccessful();
        assertEquals(0, count(AssessmentStep::all()));
    }

    // test syncing a pool's skills with its assessment steps
    public function testSyncAssessmentStepPoolSkill(): void
    {
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $this->pool->setEssentialPoolSkills([$skill1->id, $skill2->id]);

        // assert having set two essential pool skills the counts line up
        assertEquals(2, count($this->pool->essentialSkills));
        assertEquals(2, count($this->pool->poolSkills));
        assertEquals(2, count(PoolSkill::all()));

        $poolSkillIds = PoolSkill::all()->pluck('id')->toArray();

        // create an AssessmentStep and sync it to both the pool's skills
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentStep,
                [
                    'poolId' => $this->pool->id,
                    'assessmentStep' => [
                        'type' => 'abc',
                        'sortOrder' => 1,
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

        // assert an assessment step created that through the pivot connected it to two pool skills
        assertEquals(1, count(AssessmentStep::all()));
        assertEquals(2, count(AssessmentStep::first()->poolSkills));

        // assert a pool skill is associated with one assessment step
        assertEquals(1, count(PoolSkill::first()->assessmentSteps));

        // assert the pool has one assessment step it can access
        assertEquals(1, count($this->pool->assessmentSteps));

        // delete the assessment step
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->deleteAssessmentStep,
                [
                    'id' => AssessmentStep::first()->id,
                ]
            )
            ->assertSuccessful();
        $this->pool->refresh();

        // make assertions again now that the assessment was deleted
        assertEquals(0, count(AssessmentStep::all()));
        assertEquals(0, count(PoolSkill::first()->assessmentSteps));
        assertEquals(0, count($this->pool->assessmentSteps));
    }
}
