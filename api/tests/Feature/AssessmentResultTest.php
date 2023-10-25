<?php

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\PoolSkillType;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertNull;

class AssessmentResultTest extends TestCase
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

    protected $createAssessmentResult =
    /** @lang GraphQL */
    '
        mutation createAssessmentResult($createAssessmentResult: CreateAssessmentResultInput!){
            createAssessmentResult(createAssessmentResult: $createAssessmentResult) {
                id
                assessmentStep {
                    id
                }
                poolCandidate {
                    id
                }
                poolSkill {
                    id
                }
                assessmentResultType
            }
        }
    ';

    protected $updateAssessmentResult =
    /** @lang GraphQL */
    '
        mutation updateAssessmentResult($id: UUID!, $updateAssessmentResult: UpdateAssessmentResultInput!){
            updateAssessmentResult(id: $id, updateAssessmentResult: $updateAssessmentResult) {
                id
                assessmentResultType
                assessmentDecision
                justifications
            }
        }
    ';

    protected $deleteAssessmentResult =
    /** @lang GraphQL */
    '
        mutation deleteAssessmentResult($id: UUID!){
            deleteAssessmentResult(id: $id) {
                id
            }
        }
    ';

    // test creating assessment results
    public function testCreatingAssessmentResult(): void
    {
        $skill = Skill::factory()->create();
        $parentAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $this->pool->id,
        ]);
        $parentPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
        ]);
        DB::table('pool_skill')->insert([
            'pool_id' => $this->pool->id,
            'skill_id' => $skill->id,
            'type' => PoolSkillType::ESSENTIAL->name,
        ]);
        $poolSkillModel = PoolSkill::first();

        // can create assessment result without pool skill
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'assessmentResultType' => AssessmentResultType::SKILL->name,
                    ],
                ]
            )
            ->assertJsonFragment([
                'assessmentStep' => [
                    'id' => $parentAssessmentStep->id,
                ],
                'poolCandidate' => [
                    'id' => $parentPoolCandidate->id,
                ],
                'poolSkill' => null,
                'assessmentResultType' => AssessmentResultType::SKILL->name,
            ]);

        // can create assessment result with pool skill
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'poolSkillId' => $poolSkillModel->id,
                        'assessmentResultType' => AssessmentResultType::SKILL->name,
                    ],
                ]
            )
            ->assertJsonFragment([
                'assessmentStep' => [
                    'id' => $parentAssessmentStep->id,
                ],
                'poolCandidate' => [
                    'id' => $parentPoolCandidate->id,
                ],
                'poolSkill' => [
                    'id' => $poolSkillModel->id,
                ],
                'assessmentResultType' => AssessmentResultType::SKILL->name,
            ]);
    }

    // test updating assessment results
    public function testUpdatingAssessmentResult(): void
    {
        $parentAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $this->pool->id,
        ]);
        $parentPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
        ]);

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'assessmentResultType' => AssessmentResultType::SKILL->name,
                    ],
                ]
            )
            ->assertSuccessful();

        $assessmentResult = AssessmentResult::first();

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->updateAssessmentResult,
                [
                    'id' => $assessmentResult->id,
                    'updateAssessmentResult' => [
                        'assessmentResultType' => AssessmentResultType::EDUCATION->name,
                        'assessmentDecision' => AssessmentDecision::UNSUCCESSFUL->name,
                        'justifications' => [AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name],
                    ],
                ]
            )
            ->assertJsonFragment([
                'assessmentResultType' => AssessmentResultType::EDUCATION->name,
                'assessmentDecision' => AssessmentDecision::UNSUCCESSFUL->name,
                'justifications' => [AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name],
            ]);
    }

    // test deleting assessment results
    public function testDeletingAssessmentResult(): void
    {
        $parentAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $this->pool->id,
        ]);
        $parentPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
        ]);

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                    ],
                ]
            )
            ->assertSuccessful();

        $assessmentResult = AssessmentResult::first();

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->deleteAssessmentResult,
                [
                    'id' => $assessmentResult->id,
                ]
            )
            ->assertSuccessful();
        assertNull(AssessmentStep::all()->find($assessmentResult->id));
    }
}
