<?php

namespace Tests\Feature;

use App\Models\SkillFamily;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentNominationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $employee1;

    protected $employee2;

    protected $nonEmployee1;

    protected $createMutation = <<<'GRAPHQL'
    mutation CreateTalentNomination($talentNomination: CreateTalentNominationInput!) {
        createTalentNomination(talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected $updateMutation = <<<'GRAPHQL'
    mutation UpdateTalentNomination($id: UUID!, $talentNomination: UpdateTalentNominationInput!) {
        updateTalentNomination(id: $id, talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected $submitMutation = <<<'GRAPHQL'
        mutation SubmitTalentNomination($id: UUID!) {
        submitTalentNomination(id: $id) {
                id
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $this->employee1 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'employee1@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee1@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $this->employee2 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'employee2@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee2@gc.ca',
                'work_email_verified_at' => now(),
            ]);

        $this->nonEmployee1 = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'non_employee1@test.com',
                'computed_is_gov_employee' => false,
                'work_email' => null,
                'work_email_verified_at' => null,
            ]);
    }

    public function testEmployeeCanCreateNominations()
    {
        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => TalentNominationEvent::factory()->create()->id,
                    ],
                ],
            ]);

        $response->assertJsonStructure([
            'data' => [
                'createTalentNomination' => [
                    'id',
                ],
            ],
        ]);

        $response->assertGraphQLErrorFree();
    }

    public function testNonEmployeeCantCreateNominations()
    {
        $response = $this->actingAs($this->nonEmployee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => TalentNominationEvent::factory()->create()->id,
                    ],
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testSubmitterCanUpdateTheirOwnDraftNominations()
    {
        $nomination = TalentNomination::factory()->create([
            'submitter_id' => $this->employee1->id,
            'submitted_at' => null,
        ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertJsonStructure([
            'data' => [
                'updateTalentNomination' => [
                    'id',
                ],
            ],
        ]);

        $response->assertGraphQLErrorFree();
    }

    public function testNonSubmitterCantUpdateOtherNominations()
    {
        $nomination = TalentNomination::factory()->create([
            'submitter_id' => $this->employee1->id,
            'submitted_at' => null,
        ]);

        $response = $this->actingAs($this->employee2, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testSubmitterCantUpdateTheirOwnSubmittedNominations()
    {
        $nomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $this->employee1->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCanAddKLCSkillsWithEventOption()
    {
        $event = TalentNominationEvent::factory()
            ->create([
                'include_leadership_competencies' => true,
            ]);
        $nomination = TalentNomination::factory()
            ->submittedRationale()
            ->hasSkills(SkillFamily::where('key', 'klc')->sole()->skills->take(3))
            ->create([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertJsonStructure([
            'data' => [
                'submitTalentNomination' => [
                    'id',
                ],
            ],
        ]);

        $response->assertGraphQLErrorFree();
    }

    public function testCantAddKLCSkillsWithoutEventOption()
    {
        $event = TalentNominationEvent::factory()
            ->create([
                'include_leadership_competencies' => false,
            ]);
        $nomination = TalentNomination::factory()
            ->submittedRationale()
            ->hasSkills(SkillFamily::where('key', '<>', 'klc')->first()->skills->take(3))
            ->create([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertGraphQLValidationError('skills', 'The skills field is prohibited.');
    }

    public function testCantAddNonKLCSkills()
    {
        $nonKlcSkillId = SkillFamily::where('key', '<>', 'klc')->first()->skills->first()->id;

        $event = TalentNominationEvent::factory()->create([
            'include_leadership_competencies' => true,
        ]);
        $nomination = TalentNomination::factory()
            ->hasSkills([])
            ->create([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'skills' => [
                        'sync' => [$nonKlcSkillId],
                    ],
                ],
            ]);

        $response->assertGraphQLValidationError('talentNomination.skills.sync.0', 'SKILL_NOT_KLC');
    }

    public function testCantNominateSelf()
    {
        $nomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'submitter_id' => $this->employee1->id,
                'nominator_id' => $this->employee1->id,
                'nominee_id' => $this->employee1->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertGraphQLValidationError('nominee_id', 'The nominee id field and nominator id must be different.');
    }

    public function testCannotCreateNominationsForClosedEvent()
    {
        $event = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.past_datetime'),
        ]);

        // creating a nomination fails if the event is closed
        $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $event->id,
                    ],
                ],
            ])->assertGraphQLValidationError('talentNomination', 'TalentEventIsClosed');
    }

    public function testCannotUpdateNominationsForClosedEvent()
    {
        $event = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.past_datetime'),
        ]);
        $nomination = TalentNomination::factory()
            ->submittedRationale()
            ->create(['talent_nomination_event_id' => $event->id]);

        // updating operations (update/submit) for a nomination fails if the event is closed
        $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $nomination->id,
                'talentNomination' => [
                    'additionalComments' => 'New comments',
                ],
            ])->assertGraphQLValidationError('id', 'TalentEventIsClosed');

        $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ])->assertGraphQLValidationError('id', 'TalentEventIsClosed');
    }
}
