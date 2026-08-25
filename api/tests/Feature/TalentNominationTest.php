<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\Classification;
use App\Models\Department;
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

    protected $nominationEvent;

    protected $createMutation = <<<'GRAPHQL'
    mutation CreateTalentNomination($talentNomination: CreateTalentNominationInput!) {
        createTalentNomination(talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected $updateMutation = <<<'GRAPHQL'
    mutation UpdateTalentNomination($talentNomination: UpdateTalentNominationInput!) {
        updateTalentNomination(talentNomination: $talentNomination) {
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
            ->state([
                'email' => 'employee1@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee1@gc.ca',
                'work_email_verified_at' => now(),
            ])
            ->asGuest()
            ->asApplicant()
            ->create();

        $this->employee2 = User::factory()
            ->state([
                'email' => 'employee2@test.com',
                'computed_is_gov_employee' => true,
                'work_email' => 'employee2@gc.ca',
                'work_email_verified_at' => now(),
            ])
            ->asGuest()
            ->asApplicant()
            ->create();

        $this->nonEmployee1 = User::factory()
            ->state([
                'email' => 'non_employee1@test.com',
                'computed_is_gov_employee' => false,
                'work_email' => null,
                'work_email_verified_at' => null,
            ])
            ->asGuest()
            ->asApplicant()
            ->create();

        $this->nominationEvent = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.far_future_datetime'),
        ]);
    }

    public function testEmployeeCanCreateNominations()
    {
        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $this->nominationEvent->id,
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
                        'connect' => $this->nominationEvent->id,
                    ],
                ],
            ]);

        $response->assertGraphQLErrorMessage('YOU_MUST_BE_VERIFIED_EMPLOYEE_FOR_ACTION');
    }

    public function testSubmitterCanUpdateTheirOwnDraftNominations()
    {
        $nomination = TalentNomination::factory()->create([
            'talent_nomination_event_id' => $this->nominationEvent->id,
            'submitter_id' => $this->employee1->id,
            'submitted_at' => null,
        ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
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
            'talent_nomination_event_id' => $this->nominationEvent->id,
            'submitter_id' => $this->employee1->id,
            'submitted_at' => null,
        ]);

        $response = $this->actingAs($this->employee2, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testSubmitterCantUpdateTheirOwnSubmittedNominations()
    {
        $nomination = TalentNomination::factory()
            ->state([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $this->employee1->id,
            ])
            ->submittedReviewAndSubmit()
            ->create();

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'additionalComments' => 'New comments',
                ],
            ]);

        $response->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCanUpdateNominationWhenDevelopmentProgramsFieldOmittedAndEventExcludesDevelopmentOpportunities()
    {
        // $this->nominationEvent has no development programs, so includeDevelopmentOpportunities is false
        $nomination = TalentNomination::factory()->create([
            'talent_nomination_event_id' => $this->nominationEvent->id,
            'submitter_id' => $this->employee1->id,
            'submitted_at' => null,
            'nominate_for_development_programs' => null,
        ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'nominationRationale' => 'Updated rationale',
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
        $this->assertNull($nomination->fresh()->nominate_for_development_programs);
    }

    public function testCanAddKLCSkillsWithEventOption()
    {
        $event = TalentNominationEvent::factory()
            ->create([
                'close_date' => config('constants.far_future_datetime'),
                'include_leadership_competencies' => true,
            ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->submittedRationale()
            ->hasSkills(SkillFamily::where('key', 'klc')->sole()->skills->take(3))
            ->create();

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
                'close_date' => config('constants.far_future_datetime'),
                'include_leadership_competencies' => false,
            ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->submittedRationale()
            ->hasSkills(SkillFamily::where('key', '<>', 'klc')->first()->skills->take(3))
            ->create();

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
            'close_date' => config('constants.far_future_datetime'),
            'include_leadership_competencies' => true,
        ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->hasSkills([])
            ->create();

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'skills' => [
                        'sync' => [$nonKlcSkillId],
                    ],
                ],
            ]);

        $response->assertGraphQLValidationError('talentNomination.skills.sync.0', ErrorCode::SKILL_NOT_KLC->name);
    }

    public function testCantSubmitWithoutNineBoxFieldsWhenEventRequiresThem()
    {
        $event = TalentNominationEvent::factory()->create([
            'close_date' => config('constants.far_future_datetime'),
            'include_nine_box' => true,
        ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
                'nine_box_performance' => null,
                'nine_box_leadership_potential' => null,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertGraphQLValidationError('nine_box_performance', 'NINE_BOX_RATINGS_REQUIRED_FOR_EVENT');
        $response->assertGraphQLValidationError('nine_box_leadership_potential', 'NINE_BOX_RATINGS_REQUIRED_FOR_EVENT');
    }

    public function testCanSubmitWithNineBoxFieldsWhenEventRequiresThem()
    {
        $event = TalentNominationEvent::factory()->create([
            'close_date' => config('constants.far_future_datetime'),
            'include_nine_box' => true,
        ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
                'nine_box_performance' => 'LOW',
                'nine_box_leadership_potential' => 'LOW',
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

    public function testCantSubmitWithNineBoxFieldsWhenEventProhibitsThem()
    {
        $event = TalentNominationEvent::factory()->create([
            'close_date' => config('constants.far_future_datetime'),
            'include_nine_box' => false,
        ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
                'nine_box_performance' => 'LOW',
                'nine_box_leadership_potential' => 'LOW',
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertGraphQLValidationError('nine_box_performance', 'NINE_BOX_RATINGS_PROHIBITED_FOR_EVENT');
        $response->assertGraphQLValidationError('nine_box_leadership_potential', 'NINE_BOX_RATINGS_PROHIBITED_FOR_EVENT');
    }

    public function testCanSubmitWithoutNineBoxFieldsWhenEventProhibitsThem()
    {
        $event = TalentNominationEvent::factory()->create([
            'close_date' => config('constants.far_future_datetime'),
            'include_nine_box' => false,
        ]);
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $event->id,
                'nine_box_performance' => null,
                'nine_box_leadership_potential' => null,
            ])
            ->submittedRationale()
            ->create();

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

    public function testCantNominateSelf()
    {
        $nomination = TalentNomination::factory()
            ->state([
                'talent_nomination_event_id' => $this->nominationEvent->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
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
            ])->assertGraphQLValidationError('talentNomination', ErrorCode::TALENT_EVENT_IS_CLOSED->name);
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
                'talentNomination' => [
                    'id' => $nomination->id,
                    'additionalComments' => 'New comments',
                ],
            ])->assertGraphQLValidationError('talentNomination.id', ErrorCode::TALENT_EVENT_IS_CLOSED->name);

        $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ])->assertGraphQLValidationError('id', ErrorCode::TALENT_EVENT_IS_CLOSED->name);
    }

    public function testCommunityTalentCoordinatorCanCreatePastNominationOnProtectedEndpoint()
    {
        $event = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.past_datetime'),
        ]);

        $communityTalentCoordinator = User::factory()
            ->state([
                'computed_is_gov_employee' => true,
                'work_email' => 'coordinator@gc.ca',
                'work_email_verified_at' => now(),
            ])
            ->asGuest()
            ->asApplicant()
            ->asCommunityTalentCoordinator($event->community_id)
            ->create();

        $this->actingAs($communityTalentCoordinator, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $event->id,
                    ],
                ],
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonStructure([
                'data' => [
                    'createTalentNomination' => [
                        'id',
                    ],
                ],
            ]);
    }

    // Can create a nomination with advancement classifications when the advancement option is chosen
    public function testCanCreateNominationWithAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $this->nominationEvent->id,
                    ],
                    'nominateForAdvancement' => true,
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
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

    // Can't create a nomination with advancement classifications when the advancement option is not chosen
    public function testCantCreateNominationWithoutAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $this->nominationEvent->id,
                    ],
                    'nominateForAdvancement' => false,
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
                    ],
                ],
            ]);

        $response->assertGraphQLValidationError('talentNomination.advancementClassifications.sync', 'The talent nomination.advancement classifications.sync field is prohibited.');
    }

    // Can update a nomination with advancement classifications when the advancement option is chosen
    public function testCanUpdateNominationWithAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();
        $nomination = TalentNomination::factory()
            ->submittedNominationDetails()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $this->employee1->id,

            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'nominateForAdvancement' => true,
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
                    ],
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
        $this->assertSame([$classification->id], $nomination->fresh()->advancementClassifications->pluck('id')->all());
    }

    // Can't update a nomination with advancement classifications when the advancement option is not chosen
    public function testUpdateCreateNominationWithoutAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();
        $nomination = TalentNomination::factory()
            ->submittedNominationDetails()
            ->create([
                'talent_nomination_event_id' => $this->nominationEvent->id,
                'submitter_id' => $this->employee1->id,
            ]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->updateMutation, [
                'talentNomination' => [
                    'id' => $nomination->id,
                    'nominateForAdvancement' => false,
                    'advancementClassifications' => [
                        'sync' => [$classification->id],
                    ],
                ],
            ]);

        $response->assertGraphQLValidationError('talentNomination.advancementClassifications.sync', 'The talent nomination.advancement classifications.sync field is prohibited.');
    }

    // Can submit a nomination with advancement classifications when the advancement option is chosen
    public function testCanSubmitNominationWithAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $this->nominationEvent->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
                'nominate_for_advancement' => true,
                'advancement_reference_fallback_work_email' => 'reference@gc.ca',
                'advancement_reference_fallback_name' => 'Reference Name',
                'advancement_reference_fallback_classification_id' => Classification::factory()->create()->id,
                'advancement_reference_fallback_department_id' => Department::factory()->create()->id,
            ]);
        $nomination->advancementClassifications()->sync([$classification->id]);

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

    // Can't submit a nomination with advancement classifications when the advancement option is not chosen
    public function testCantSubmitNominationWithoutAdvancementWithClassifications()
    {
        $classification = Classification::factory()->create();
        $nomination = TalentNomination::factory()
            ->state([
                'submitter_id' => $this->employee1->id,
                'talent_nomination_event_id' => $this->nominationEvent->id,
            ])
            ->submittedRationale()
            ->create([
                // override factory logic
                'nominate_for_advancement' => false,
                'advancement_reference_id' => null,
                'advancement_reference_fallback_work_email' => null,
                'advancement_reference_fallback_name' => null,
                'advancement_reference_fallback_classification_id' => null,
                'advancement_reference_fallback_department_id' => null,
            ]);
        $nomination->advancementClassifications()->sync([$classification->id]);

        $response = $this->actingAs($this->employee1, 'api')
            ->graphQL($this->submitMutation, [
                'id' => $nomination->id,
            ]);

        $response->assertGraphQLValidationError('advancement_classifications', 'The advancement classifications field is prohibited.');
    }
}
