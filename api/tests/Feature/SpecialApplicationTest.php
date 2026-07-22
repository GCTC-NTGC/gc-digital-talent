<?php

namespace Tests\Feature;

use App\Enums\ActivityEvent;
use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\SpecialApplicationType;
use App\Models\Activity;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use DateTime;
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
    // also check a log was created during
    public function testCanCreateNewSpecialApplication(): void
    {
        Activity::truncate();

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

        // single record created for the event type
        $activity = Activity::where('event', ActivityEvent::SPECIAL_APPLICATION_CREATED->value)
            ->where('subject_type', PoolCandidate::class)
            ->where('causer_id', $this->admin->id)
            ->sole();

        $attributes = $activity->properties['attributes'];
        $dateTimeObject = new DateTime($attributes['special_application_closing_date']);
        $dateTimeString = $dateTimeObject->format('Y-m-d H:i:s');

        // check property attributes
        assertSame($this->applicant->id, $attributes['user_id']);
        assertSame($this->applicant->fullName, $attributes['user_name']);
        assertSame($this->pool->id, $attributes['pool_id']);
        assertSame(ApplicationStatus::DRAFT->name, $attributes['application_status']);
        assertSame(SpecialApplicationType::PRIORITY->name, $attributes['special_application_type']);
        assertSame('reasons', $attributes['special_application_justification']);
        assertSame(config('constants.far_future_datetime'), $dateTimeString);
    }

    // can create for user WITH an existing application
    // also check a log was created during
    public function testCanConvertExistingDraftApplication(): void
    {
        $existingApplication = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'user_id' => $this->applicant->id,
            'submitted_at' => null,
        ]);

        Activity::truncate();

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

        // single record created for the event type
        // given it was an existing application, can query by subject_id too
        $activity = Activity::where('event', ActivityEvent::SPECIAL_APPLICATION_CREATED->value)
            ->where('subject_type', PoolCandidate::class)
            ->where('subject_id', $existingApplication->id)
            ->where('causer_id', $this->admin->id)
            ->sole();

        $attributes = $activity->properties['attributes'];
        $dateTimeObject = new DateTime($attributes['special_application_closing_date']);
        $dateTimeString = $dateTimeObject->format('Y-m-d H:i:s');

        // check property attributes
        assertSame($this->applicant->id, $attributes['user_id']);
        assertSame($this->applicant->fullName, $attributes['user_name']);
        assertSame($this->pool->id, $attributes['pool_id']);
        assertSame(SpecialApplicationType::PRIORITY->name, $attributes['special_application_type']);
        assertSame('reasons', $attributes['special_application_justification']);
        assertSame(config('constants.far_future_datetime'), $dateTimeString);
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

    // test accessor PoolCandidate::isSpecialApplication()
    public function testIsSpecialApplication(): void
    {
        $nullCandidate = PoolCandidate::factory()->createQuietly([
            'special_application_type' => null,
        ]);
        $emptyCandidate = PoolCandidate::factory()->createQuietly([
            'special_application_type' => '',
        ]);
        $setCandidate = PoolCandidate::factory()->createQuietly([
            'special_application_type' => SpecialApplicationType::OTHER->name,
        ]);

        // assert values as expected
        assertSame(
            $nullCandidate->is_special_application,
            false,
        );
        assertSame(
            $emptyCandidate->is_special_application,
            false,
        );
        assertSame(
            $setCandidate->is_special_application,
            true,
        );
    }

    // a special application can bypass standard validation when submitting
    public function testSpecialApplicationBypassesNormalValidation(): void
    {
        // pool is internal and closed
        $this->pool->area_of_selection = PoolAreaOfSelection::EMPLOYEES->name;
        $this->pool->advertisement_language = PoolLanguage::VARIOUS->name;
        $this->pool->closing_date = config('constants.past_datetime');
        $this->pool->save();

        // applicant unable to apply due to both those reasons, normally
        $this->applicant->email_verified_at = config('constants.far_past_datetime');
        $this->applicant->work_email_verified_at = null;
        $this->applicant->save();

        $newPoolCandidate = PoolCandidate::factory()
            ->completed()
            ->for($this->applicant)
            ->for($this->pool)
            ->create([
                'special_application_type' => SpecialApplicationType::PRIORITY->name,
                'special_application_justification' => 'reasons',
                'special_application_closing_date' => config('constants.far_future_datetime'),
            ]);
        $newPoolCandidate->submitted_at = null;
        $newPoolCandidate->save();

        // applicant able to successfully submit the application
        $this->actingAs($this->applicant, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
                mutation SubmitApplication($id: ID!, $sig: String!) {
                    submitApplication(id: $id, signature: $sig) {
                        signature
                    }
                }
            ',
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'signature' => 'sign',
            ]);
    }

    // a special application cannot be created for all pool states
    public function testSpecialApplicationPoolPublishedAtCheck(): void
    {
        $draftPool = Pool::factory()->draft()->create();
        $openPool = Pool::factory()->published()->create();
        $closedPool = Pool::factory()->closed()->create();
        $archivedPool = Pool::factory()->archived()->create();

        // draft is blocked
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $draftPool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertGraphQLValidationError(
                'poolCandidate.pool.connect',
                ErrorCode::SPECIAL_APPLICATIONS_POOL_NOT_PUBLISHED->name,
            );

        // open is allowed
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $openPool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertJson([
                'data' => [
                    'createSpecialApplication' => [
                        'pool' => ['id' => $openPool->id],
                        'user' => ['id' => $this->applicant->id],
                        'specialApplicationType' => ['value' => SpecialApplicationType::PRIORITY->name],
                        'specialApplicationJustification' => 'reasons',
                        'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                    ],
                ],
            ]);

        // closed is allowed
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $closedPool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertJson([
                'data' => [
                    'createSpecialApplication' => [
                        'pool' => ['id' => $closedPool->id],
                        'user' => ['id' => $this->applicant->id],
                        'specialApplicationType' => ['value' => SpecialApplicationType::PRIORITY->name],
                        'specialApplicationJustification' => 'reasons',
                        'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                    ],
                ],
            ]);

        // archived is blocked
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'poolCandidate' => [
                    'pool' => ['connect' => $archivedPool->id],
                    'user' => ['connect' => $this->applicant->id],
                    'specialApplicationType' => SpecialApplicationType::PRIORITY->name,
                    'specialApplicationJustification' => 'reasons',
                    'specialApplicationClosingDate' => config('constants.far_future_datetime'),
                ],
            ])
            ->assertGraphQLValidationError(
                'poolCandidate.pool.connect',
                ErrorCode::SPECIAL_APPLICATIONS_POOL_NOT_PUBLISHED->name,
            );
    }
}
