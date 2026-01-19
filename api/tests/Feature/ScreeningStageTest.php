<?php

namespace Tests\Feature;

use App\Enums\AssessmentStepType;
use App\Enums\ErrorCode;
use App\Enums\PoolCandidateStatus;
use App\Enums\ScreeningStage;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class ScreeningStageTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $processOperatorUser;

    protected $communityRecruiterUser;

    protected $communityAdminUser;

    protected $application;

    protected $step;

    protected $mutation = <<<'GRAPHQL'
        mutation TestUpdateScreeningStage($candidate: UpdatePoolCandidateScreeningStageInput!) {
            updatePoolCandidateScreeningStage(poolCandidate: $candidate) {
                screeningStage {
                    value
                }
                assessmentStep {
                    id
                }
            }
        }
        GRAPHQL;

    protected function setup(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $pool = Pool::factory()
            ->published()
            ->withAssessmentSteps(3)
            ->create();

        $this->application = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
            'pool_candidate_status' => PoolCandidateStatus::UNDER_ASSESSMENT->name,
            'submitted_at' => config('constants.past_date'),
        ]);

        $this->step = $this->application->pool->assessmentSteps()->first();

        $this->communityRecruiterUser = User::factory()
            ->asCommunityRecruiter($this->application->pool->community->id)
            ->create();

        $this->communityAdminUser = User::factory()
            ->asCommunityAdmin($this->application->pool->community->id)
            ->create();

        $this->processOperatorUser = User::factory()
            ->asProcessOperator($this->application->pool->id)
            ->create();
    }

    public function testSettingAssessmentStep()
    {

        $expectedStep = $this->application->pool->assessmentSteps->sortBy('sortOrder')
            ->firstWhere(function ($step) {
                return $step->type !== AssessmentStepType::APPLICATION_SCREENING->name && $step->type !== AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name;
            })->id ?? null;

        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->mutation, [
                'candidate' => [
                    'id' => $this->application->id,
                    'screeningStage' => ScreeningStage::UNDER_ASSESSMENT->name,
                ]])
            ->assertJsonFragment([
                'screeningStage' => ['value' => ScreeningStage::UNDER_ASSESSMENT->name],
                'assessmentStep' => ['id' => $expectedStep],
            ]);

        $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->mutation, [
                'candidate' => [
                    'id' => $this->application->id,
                    'screeningStage' => ScreeningStage::SCREENED_IN->name,
                ]])
            ->assertJsonFragment([
                'screeningStage' => ['value' => ScreeningStage::SCREENED_IN->name],
                'assessmentStep' => null,
            ]);
    }

    #[DataProvider('screeningStageSuccessProvider')]
    public function testCanUpdateScreeningStage(string $actingAs, string $screeningStage, ?bool $includeStep)
    {
        $input = [
            'id' => $this->application->id,
            'screeningStage' => $screeningStage,
        ];

        $expected = ['screeningStage' => ['value' => $screeningStage]];

        if ($includeStep) {
            $input['assessmentStep']['connect'] = $this->step->id;
            $expected['assessmentStep']['id'] = $this->step->id;
        }

        $user = match ($actingAs) {
            'operator' => $this->processOperatorUser,
            'recruiter' => $this->communityRecruiterUser,
            'admin' => $this->communityAdminUser,
        };

        $this->actingAs($user, 'api')
            ->graphQL($this->mutation, ['candidate' => $input])
            ->assertJsonFragment($expected);
    }

    public static function screeningStageSuccessProvider()
    {
        return [
            // Process operator
            'new application as operator' => ['operator', ScreeningStage::NEW_APPLICATION->name, false],
            'application review as operator' => ['operator', ScreeningStage::APPLICATION_REVIEW->name, false],
            'screened in as operator' => ['operator', ScreeningStage::SCREENED_IN->name, false],
            'under assessment (no step) as operator' => ['operator', ScreeningStage::UNDER_ASSESSMENT->name, false],
            'under assessment (with step) as operator' => ['operator', ScreeningStage::UNDER_ASSESSMENT->name, true],

            // Community recruiter
            'new application as recruiter' => ['recruiter', ScreeningStage::NEW_APPLICATION->name, false],
            'application review as recruiter' => ['recruiter', ScreeningStage::APPLICATION_REVIEW->name, false],
            'screened in as recruiter' => ['recruiter', ScreeningStage::SCREENED_IN->name, false],
            'under assessment (no step) recruiter' => ['recruiter', ScreeningStage::UNDER_ASSESSMENT->name, false],
            'under assessment (with step) recruiter' => ['recruiter', ScreeningStage::UNDER_ASSESSMENT->name, true],

            // Community admin
            'new application as admin' => ['admin', ScreeningStage::NEW_APPLICATION->name, false],
            'application review as admin' => ['admin', ScreeningStage::APPLICATION_REVIEW->name, false],
            'screened in as admin' => ['admin', ScreeningStage::SCREENED_IN->name, false],
            'under assessment (no step) admin' => ['admin', ScreeningStage::UNDER_ASSESSMENT->name, false],
            'under assessment (with step) admin' => ['admin', ScreeningStage::UNDER_ASSESSMENT->name, true],
        ];
    }

    #[DataProvider('screeningStageValidationProvider')]
    public function testFailedUpdateScreeningStage(string $type, ?string $screeningStage, array $error, ?bool $includeStep)
    {
        $input = [
            'id' => $this->application->id,
            'screeningStage' => $screeningStage,
        ];

        $expected = ['screeningStage' => ['value' => $screeningStage]];

        if ($includeStep) {
            // Set to unexpected UUID if we expect it to not match candidate pool
            $input['assessmentStep']['connect'] = $error['value'] === ErrorCode::ASSESSMENT_STEP_CANDIDATE_SAME_POOL->name ?
                '28c7faf2-4edd-4048-92bc-c9b742c81dc3' : $this->step->id;
            $expected['assessmentStep']['id'] = $this->step->id;
        }

        $res = $this->actingAs($this->communityAdminUser, 'api')
            ->graphQL($this->mutation, ['candidate' => $input]);

        if ($type === 'validation') {
            $res->assertGraphQLValidationError($error['key'], $error['value']);
        }

        if ($type === 'graphql') {
            $message = $res->json('errors.0.message');
            $this->assertStringContainsString($error['value'], $message);
        }
    }

    public static function screeningStageValidationProvider()
    {
        return [
            'screening stage required' => [
                'graphql',
                null,
                ['key' => 'poolCandidate.screeningStage', 'value' => 'Expected non-nullable type "ScreeningStage!" not to be null'],
                false,
            ],
            'screening stage exists' => [
                'graphql',
                'NOT_A_SCREENING_STAGE',
                ['key' => 'poolCandidate.screeningStage', 'value' => 'Value "NOT_A_SCREENING_STAGE" does not exist in "ScreeningStage" enum'],
                false,
            ],
            'assessment step prohibited' => [
                'validation',
                ScreeningStage::NEW_APPLICATION->name,
                ['key' => 'poolCandidate.assessmentStep.connect', 'value' => ErrorCode::SCREENING_STAGE_NOT_UNDER_ASSESSMENT->name],
                true,
            ],
            'assessment step not same pool as candidate' => [
                'validation',
                ScreeningStage::UNDER_ASSESSMENT->name,
                ['key' => 'poolCandidate.assessmentStep.connect', 'value' => ErrorCode::ASSESSMENT_STEP_CANDIDATE_SAME_POOL->name],
                true,
            ],
        ];
    }
}
