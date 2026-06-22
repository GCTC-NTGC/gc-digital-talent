<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Enums\SpecialApplicationType;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertSame;

class SpecialApplicationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    public Pool $pool;

    public User $applicant;

    public User $admin;

    public string $createMutation = <<<'GRAPHQL'
        mutation createSpecialApplication($poolCandidate: CreateSpecialApplicationInput!) {
            createSpecialApplication(poolCandidate: $poolCandidate) {
                pool { id }
                user { id }
                specialApplicationType { value }
                specialApplicationJustification
                specialApplicationClosingDate
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->pool = Pool::factory()->published()->create();

        $this->applicant = User::factory()->asApplicant()->create();

        $this->admin = User::factory()->asAdmin()->create();
    }

    // can create for user WITHOUT an existing application
    public function testCanCreateNewSpecialApplication(): void
    {
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $this->pool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertJson([
                'data' => [
                    'createSpecialApplication' => [
                        'pool' => ['id' => $this->pool->id],
                        'user' => ['id' => $this->applicant->id],
                        'specialApplicationType' => ['value' => SpecialApplicationType::PRIORITY->name],
                        'specialApplicationJustification' => 'reasons',
                        'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                    ],
                ],
            ]);
    }

    // can create for user WITH an existing application
    public function testCanConvertExistingDraftApplication(): void
    {
        $existingApplication = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicant->id,
            'submitted_at' => null,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $this->pool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertJson([
                'data' => [
                    'createSpecialApplication' => [
                        'pool' => ['id' => $this->pool->id],
                        'user' => ['id' => $this->applicant->id],
                        'specialApplicationType' => ['value' => SpecialApplicationType::PRIORITY->name],
                        'specialApplicationJustification' => 'reasons',
                        'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                    ],
                ],
            ]);

        // assert existing record was the one affected
        $existingApplication->refresh();
        assertSame($existingApplication->special_application_type, SpecialApplicationType::PRIORITY->name);
    }

    // validation rejects when the existing application is already submitted
    public function testCannotConvertSubmittedApplicationValidation(): void
    {
        PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicant->id,
            'submitted_at' => config('constants.far_past_datetime'),
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $this->pool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertGraphQLValidationError('poolCandidate', ErrorCode::SPECIAL_APPLICATIONS_USER_ALREADY_APPLIED->name);
    }

    // validation rejects input if the special closing date precedes the pool's closing date AND/OR if it precedes today
    public function testSpecialClosingDateNotBeforePoolClose(): void
    {
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $this->pool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_past_datetime'),
                ],
            ])
            ->assertGraphQLValidationError(
                'poolCandidate.specialApplicationClosingDate',
                'The pool candidate.special application closing date field must be a date after today.'
            )
            ->assertGraphQLValidationError(
                'poolCandidate.specialApplicationClosingDate',
                'The pool candidate.special application closing date field must be a date after '.$this->pool->closing_date.'.'
            );
    }
}
