<?php

namespace Tests\Feature;

use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\PoolSkillType;
use App\Facades\Notify;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolSkill;
use App\Models\Skill;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertNull;

class AssessmentResultTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $teamUser;

    protected $team;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        $this->seed(RolePermissionSeeder::class);
        $this->bootRefreshesSchemaCache();
        $this->team = Team::factory()->create();
        $this->pool = Pool::factory()->create([
            'team_id' => $this->team->id,
        ]);
        $this->teamUser = User::factory()
            ->asApplicant()
            ->asProcessOperator($this->team->name)
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
        mutation updateAssessmentResult($updateAssessmentResult: UpdateAssessmentResultInput!){
            updateAssessmentResult(updateAssessmentResult: $updateAssessmentResult) {
                id
                assessmentResultType
                assessmentDecision { value }
                justifications { value }
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

        // can create education assessment result without pool skill
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'assessmentResultType' => AssessmentResultType::EDUCATION->name,
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
                'assessmentResultType' => AssessmentResultType::EDUCATION->name,
            ]);

        // can create skill assessment result with pool skill
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
                        'assessmentResultType' => AssessmentResultType::EDUCATION->name,
                    ],
                ]
            )
            ->assertSuccessful();

        $assessmentResult = AssessmentResult::first();

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->updateAssessmentResult,
                [
                    'updateAssessmentResult' => [
                        'id' => $assessmentResult->id,
                        'assessmentDecision' => AssessmentDecision::UNSUCCESSFUL->name,
                        'justifications' => [AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name],
                    ],
                ]
            )
            ->assertJsonFragment([
                'assessmentResultType' => AssessmentResultType::EDUCATION->name,
                'assessmentDecision' => [
                    'value' => AssessmentDecision::UNSUCCESSFUL->name,
                ],
                'justifications' => [[
                    'value' => AssessmentResultJustification::EDUCATION_FAILED_NOT_RELEVANT->name,
                ]],
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

    // test validation of input belongsTo relations when creating
    public function testAssessmentResultPoolValidation(): void
    {
        Skill::factory()->create();
        PoolSkill::truncate();

        $parentAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $this->pool->id,
        ]);
        $parentPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
        ]);

        // unrelated models
        $randomPool = Pool::factory()->withPoolSkills(2, 2)->withQuestions(2, 2)->create();
        $randomAssessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $randomPool->id,
        ]);
        $randomPoolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $randomPool->id,
        ]);
        $randomPoolSkillModel = PoolSkill::first(); // filled when calling pool factory above, this happens when calling it after skills seeded

        // trying combinations of pools and assert they fail, with and without pool skill
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $randomPoolCandidate->id,
                    ],
                ]
            )
            ->assertGraphQLValidationError('createAssessmentResult.assessmentStepId', 'AssessmentResultReferencesMultiplePools');
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $randomAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                    ],
                ]
            )
            ->assertGraphQLValidationError('createAssessmentResult.assessmentStepId', 'AssessmentResultReferencesMultiplePools');
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'poolSkillId' => $randomPoolSkillModel->id,
                    ],
                ]
            )
            ->assertGraphQLValidationError('createAssessmentResult.assessmentStepId', 'AssessmentResultReferencesMultiplePools');

        // success when all three reference one pool
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $randomAssessmentStep->id,
                        'poolCandidateId' => $randomPoolCandidate->id,
                        'poolSkillId' => $randomPoolSkillModel->id,
                    ],
                ]
            )
            ->assertSuccessful();
    }

    // test validation of updating assessment result
    public function testAssessmentResultUpdatingValidation(): void
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

        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->createAssessmentResult,
                [
                    'createAssessmentResult' => [
                        'assessmentStepId' => $parentAssessmentStep->id,
                        'poolCandidateId' => $parentPoolCandidate->id,
                        'poolSkillId' => $poolSkillModel->id,
                        'assessmentResultType' => AssessmentResultType::SKILL->name,
                        'assessmentDecision' => AssessmentDecision::SUCCESSFUL->name,
                    ],
                ]
            )
            ->assertSuccessful();

        $assessmentResult = AssessmentResult::first();

        // assert validation blocks some update combinations
        // cannot have skill type with education justifications, validation draws from saved model
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->updateAssessmentResult,
                [
                    'updateAssessmentResult' => [
                        'id' => $assessmentResult->id,
                        'justifications' => [AssessmentResultJustification::EDUCATION_ACCEPTED_INFORMATION->name],
                    ],
                ]
            )
            ->assertGraphQLValidationError('updateAssessmentResult.justifications', 'EducationJustificationsForSkillAssessment');

        // cannot have skill decision level for unsuccessful, input changes it from successful
        $this->actingAs($this->teamUser, 'api')
            ->graphQL(
                $this->updateAssessmentResult,
                [
                    'updateAssessmentResult' => [
                        'id' => $assessmentResult->id,
                        'assessmentResultType' => AssessmentResultType::SKILL->name,
                        'assessmentDecision' => AssessmentDecision::UNSUCCESSFUL->name,
                        'assessmentDecisionLevel' => AssessmentDecisionLevel::AT_REQUIRED->name,
                    ],
                ]
            )
            ->assertGraphQLValidationError('updateAssessmentResult.assessmentDecisionLevel', 'CannotSetAssessmentDecisionLevelForThisTypeOrDecision');
    }

    // test validation blocks creating skill assessment results missing a skill
    public function testSkillAssessmentRequiresSkill(): void
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
            ->assertGraphQLValidationError('createAssessmentResult.poolSkillId', 'SkillAssessmentResultMissingSkill');
    }
}
