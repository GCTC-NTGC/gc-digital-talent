<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Enums\LanguageAbility;
use App\Enums\PoolAreaOfSelection;
use App\Enums\SalaryRange;
use App\Models\Classification;
use App\Models\Department;
use App\Models\JobAlert;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class JobAlertTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $applicant;

    protected $otherApplicant;

    protected $createMutation = <<<'GRAPHQL'
        mutation createJobAlert($jobAlert: CreateJobAlertInput!) {
            createJobAlert(jobAlert: $jobAlert) {
                id
                name
                isPaused
                jobAlertFilter {
                    eligibility {
                        value
                    }
                    departments {
                        id
                    }
                    classifications {
                        id
                    }
                }
            }
        }
    GRAPHQL;

    protected $updateMutation = <<<'GRAPHQL'
        mutation updateJobAlert($id: UUID!, $jobAlert: UpdateJobAlertInput!) {
            updateJobAlert(id: $id, jobAlert: $jobAlert) {
                id
                name
                isPaused
            }
        }
    GRAPHQL;

    protected $deleteMutation = <<<'GRAPHQL'
        mutation deleteJobAlert($id: UUID!) {
            deleteJobAlert(id: $id) {
                id
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->applicant = User::factory()->asApplicant()->create();
        $this->otherApplicant = User::factory()->asApplicant()->create();
    }

    private function createInput(array $filter): array
    {
        return [
            'jobAlert' => [
                'name' => 'My alert',
                'jobAlertFilter' => ['create' => $filter],
            ],
        ];
    }

    public function testApplicantCanCreateJobAlert(): void
    {
        $department = Department::factory()->create();
        $classification = Classification::factory()->create();

        $response = $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $this->createInput([
                'eligibility' => [PoolAreaOfSelection::PUBLIC->name],
                'departments' => ['sync' => [$department->id]],
                'classifications' => ['sync' => [$classification->id]],
            ]))
            ->assertJson([
                'data' => [
                    'createJobAlert' => [
                        'name' => 'My alert',
                        'isPaused' => false,
                        'jobAlertFilter' => [
                            'eligibility' => [['value' => PoolAreaOfSelection::PUBLIC->name]],
                            'departments' => [['id' => $department->id]],
                            'classifications' => [['id' => $classification->id]],
                        ],
                    ],
                ],
            ]);

        // the owner comes from the session, not the input
        $this->assertDatabaseHas('job_alerts', [
            'id' => $response->json('data.createJobAlert.id'),
            'user_id' => $this->applicant->id,
        ]);
    }

    public function testGuestCannotCreateJobAlert(): void
    {
        $this->graphQL($this->createMutation, $this->createInput([
            'eligibility' => [PoolAreaOfSelection::PUBLIC->name],
        ]))
            ->assertGraphQLErrorMessage('Unauthenticated.');
    }

    public function testUserWithoutPermissionCannotCreateJobAlert(): void
    {
        $baseUser = User::factory()->create();

        $this->actingAs($baseUser, 'api')
            ->graphQL($this->createMutation, $this->createInput([
                'eligibility' => [PoolAreaOfSelection::PUBLIC->name],
            ]))
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCreateIsLimitedToTenAlertsIncludingPaused(): void
    {
        JobAlert::factory()->for($this->applicant)->paused()->count(9)->create();
        // other users' alerts don't count
        JobAlert::factory()->for($this->otherApplicant)->count(5)->create();
        $input = $this->createInput(['eligibility' => [PoolAreaOfSelection::PUBLIC->name]]);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $input)
            ->assertGraphQLErrorFree();

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $input)
            ->assertGraphQLValidationError('jobAlert', ErrorCode::JOB_ALERT_LIMIT_REACHED->name);
    }

    public function testCreateRequiresAtLeastOneFilter(): void
    {
        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $this->createInput([]))
            ->assertGraphQLValidationError('jobAlert.jobAlertFilter.create', ErrorCode::JOB_ALERT_FILTER_REQUIRED->name);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $this->createInput([
                'departments' => ['sync' => []],
            ]))
            ->assertGraphQLValidationError('jobAlert.jobAlertFilter.create', ErrorCode::JOB_ALERT_FILTER_REQUIRED->name);
    }

    public function testOwnerCanUpdateJobAlert(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create();

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $jobAlert->id,
                'jobAlert' => ['name' => 'Renamed', 'isPaused' => true],
            ])
            ->assertJson([
                'data' => [
                    'updateJobAlert' => [
                        'id' => $jobAlert->id,
                        'name' => 'Renamed',
                        'isPaused' => true,
                    ],
                ],
            ]);
    }

    public function testOwnerCanUpdateFieldsIndependently(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create(['name' => 'Original']);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $jobAlert->id,
                'jobAlert' => ['isPaused' => true],
            ])
            ->assertJsonPath('data.updateJobAlert.name', 'Original')
            ->assertJsonPath('data.updateJobAlert.isPaused', true);

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $jobAlert->id,
                'jobAlert' => ['name' => 'Renamed'],
            ])
            ->assertJsonPath('data.updateJobAlert.name', 'Renamed')
            ->assertJsonPath('data.updateJobAlert.isPaused', true);
    }

    public function testUpdateRejectsNullOrBlankFields(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create();

        foreach ([['name' => null], ['name' => ''], ['isPaused' => null]] as $input) {
            $this->actingAs($this->applicant, 'api')
                ->graphQL($this->updateMutation, [
                    'id' => $jobAlert->id,
                    'jobAlert' => $input,
                ])
                ->assertGraphQLValidationKeys(['jobAlert.'.array_key_first($input)]);
        }
    }

    public function testOtherUserCannotUpdateJobAlert(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create();

        $this->actingAs($this->otherApplicant, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $jobAlert->id,
                'jobAlert' => ['name' => 'Renamed', 'isPaused' => true],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testOwnerCanDeleteJobAlertAndItsFilter(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create();
        $filterId = $jobAlert->jobAlertFilter->id;

        $this->actingAs($this->applicant, 'api')
            ->graphQL($this->deleteMutation, ['id' => $jobAlert->id])
            ->assertJson([
                'data' => [
                    'deleteJobAlert' => ['id' => $jobAlert->id],
                ],
            ]);

        $this->assertDatabaseMissing('job_alerts', ['id' => $jobAlert->id]);
        $this->assertDatabaseMissing('job_alert_filters', ['id' => $filterId]);
    }

    public function testOtherUserCannotDeleteJobAlert(): void
    {
        $jobAlert = JobAlert::factory()->for($this->applicant)->create();

        $this->actingAs($this->otherApplicant, 'api')
            ->graphQL($this->deleteMutation, ['id' => $jobAlert->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->assertDatabaseHas('job_alerts', ['id' => $jobAlert->id]);
    }

    public function testUserOnlySeesOwnJobAlerts(): void
    {
        $ownAlert = JobAlert::factory()->for($this->applicant)->create();
        JobAlert::factory()->for($this->otherApplicant)->create();

        $this->actingAs($this->applicant, 'api')
            ->graphQL(<<<'GRAPHQL'
                query me {
                    me {
                        jobAlerts {
                            id
                        }
                    }
                }
            GRAPHQL)
            ->assertExactJson([
                'data' => [
                    'me' => [
                        'jobAlerts' => [['id' => $ownAlert->id]],
                    ],
                ],
            ]);
    }

    public function testSavedFilterConvertsBackToSearchInput(): void
    {
        $department = Department::factory()->create();
        $classification = Classification::factory()->create();
        $search = [
            'keywordSearch' => ['developer'],
            'eligibility' => [PoolAreaOfSelection::PUBLIC->name],
            'departments' => [$department->id],
            'classifications' => [$classification->id],
            'languages' => [LanguageAbility::ENGLISH->name],
            'salaryRange' => SalaryRange::BETWEEN_80000_99999->name,
        ];

        $response = $this->actingAs($this->applicant, 'api')
            ->graphQL($this->createMutation, $this->createInput([
                ...$search,
                'departments' => ['sync' => $search['departments']],
                'classifications' => ['sync' => $search['classifications']],
            ]));

        assertEquals(
            $search,
            JobAlert::find($response->json('data.createJobAlert.id'))->jobAlertFilter->toSearchArgs()
        );
    }
}
