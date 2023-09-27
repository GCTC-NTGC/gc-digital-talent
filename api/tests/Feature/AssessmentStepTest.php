<?php

use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

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
}
