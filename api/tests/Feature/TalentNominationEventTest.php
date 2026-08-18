<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\DevelopmentProgram;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentNominationEventTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $admin;

    protected $platformAdmin;

    protected $talentCoordinator;

    protected $community;

    protected $communityId;

    protected $otherCommunityId;

    protected $developmentProgramId;

    protected $communityDevelopmentProgramId;

    protected $input = [
        'name' => ['en' => 'Test event EN', 'fr' => 'Test event FR'],
        'description' => ['en' => 'Test EN', 'fr' => 'Test FR'],
        'learnMoreUrl' => ['en' => 'http://en.domain.com', 'fr' => 'http://fr.domain.com'],
        'includeLeadershipCompetencies' => true,
        'contactEmail' => 'example@example.org',
    ];

    protected $createMutation = <<<'GRAPHQL'
        mutation CreateTalentNominationEvent($talentNominationEvent: CreateTalentNominationEventInput!) {
            createTalentNominationEvent(talentNominationEvent: $talentNominationEvent) {
                id
                name { en fr }
                description { en fr }
                openDate
                closeDate
                learnMoreUrl { en fr }
                includeLeadershipCompetencies
                community { id }
                communityDevelopmentPrograms {
                     id
                     developmentProgram { id }
                     pivot {
                        descriptionForNominations {
                            localized
                        }
                    }
                }
                contactEmail
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $community = Community::factory()->create();
        $this->community = $community;
        $this->communityId = $community->id;

        $otherCommunity = Community::factory()->create();
        $this->otherCommunityId = $otherCommunity->id;

        $this->developmentProgramId = DevelopmentProgram::factory()
            ->withCommunity($this->communityId)
            ->create()
            ->id;

        $this->communityDevelopmentProgramId =
            CommunityDevelopmentProgram::where('development_program_id', $this->developmentProgramId)
                ->sole()
                ->id;

        $this->admin = User::factory()
            ->asGuest()
            ->asApplicant()
            ->asCommunityAdmin([$this->communityId])
            ->create([
                'email' => 'community-admin-test@test.com',
                'sub' => 'community-admin-test@test.com',
            ]);

        $this->platformAdmin = User::factory()
            ->asGuest()
            ->asApplicant()
            ->asAdmin()
            ->create();

        $this->talentCoordinator = User::factory()
            ->asGuest()
            ->asApplicant()
            ->asCommunityTalentCoordinator([$this->communityId])
            ->create();

        $this->input = [
            ...$this->input,
            'openDate' => config('constants.past_datetime'),
            'closeDate' => config('constants.far_future_datetime'),
        ];

    }

    public function testCreateTalentNominationEvent()
    {
        // community admin can create for own community only
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->communityId],
                    'communityDevelopmentPrograms' => [
                        'sync' => [
                            [
                                'id' => $this->communityDevelopmentProgramId,
                                'descriptionForNominations' => [
                                    'en' => 'abc',
                                    'fr' => 'def',
                                ],
                            ],
                        ],
                    ],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createTalentNominationEvent' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'communityDevelopmentPrograms' => [
                            [
                                'id' => $this->communityDevelopmentProgramId,
                                'developmentProgram' => ['id' => $this->developmentProgramId],
                                'pivot' => [
                                    'descriptionForNominations' => ['localized' => 'abc'],
                                ],
                            ],
                        ],
                    ],
                ],
            ]);
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->otherCommunityId],
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        // community talent coordinator can create for own community only
        $this->actingAs($this->talentCoordinator, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->communityId],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createTalentNominationEvent' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                    ],
                ],
            ]);

        $this->actingAs($this->talentCoordinator, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->otherCommunityId],
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testUpdateTalentNominationEvent()
    {
        $futureOpenDate = '2050-01-01 01:23:45';
        $futureClosingDate = '2100-01-01 01:23:45';

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
            'open_date' => $futureOpenDate,
            'close_date' => $futureClosingDate,
        ]);

        // community admin/coordinator can both update own community nomination events
        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        name { en fr }
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'name' => ['en' => 'New EN', 'fr' => 'New FR'],
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $talentNominationEvent->id,
                        'name' => ['en' => 'New EN', 'fr' => 'New FR'],
                    ],
                ],
            ]);

        $this->actingAs($this->talentCoordinator, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        name { en fr }
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'name' => ['en' => 'Newer EN', 'fr' => 'Newer FR'],
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $talentNominationEvent->id,
                        'name' => ['en' => 'Newer EN', 'fr' => 'Newer FR'],
                    ],
                ],
            ]);
    }

    public function testCannotUpdateForOtherTeam()
    {
        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->otherCommunityId,
        ]);

        // community admin/coordinator cannot update other community nomination events
        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'includeLeadershipCompetencies' => false,
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($this->talentCoordinator, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'includeLeadershipCompetencies' => false,
                ],
            ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testCommunityExistsValidation()
    {
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => Str::uuid()],
                ],
            ])
            ->assertGraphQLValidationError('talentNominationEvent.community.connect', ErrorCode::COMMUNITY_NOT_FOUND->name);
    }

    // Assert community check for selected development programs
    public function testDevelopmentProgramInCommunityValidation()
    {
        $newCommunity = Community::factory()->create();
        $developmentProgram = DevelopmentProgram::factory()->create();
        $newCommunityDevelopmentProgram = CommunityDevelopmentProgram::create([
            'community_id' => $newCommunity->id,
            'development_program_id' => $developmentProgram->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->communityId],
                    'communityDevelopmentPrograms' => [
                        'sync' => [
                            [
                                'id' => $newCommunityDevelopmentProgram->id,
                            ],
                        ],
                    ],
                ],
            ])
            ->assertGraphQLValidationError('talentNominationEvent.communityDevelopmentPrograms.sync.0.id', ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND_OR_INVALID->name);
    }

    // #17164 - a development program id already attached to the event should not
    // block an unrelated update, even if it no longer belongs to the event's community
    public function testStaleCommunityDevelopmentProgramIdDoesNotBlockUpdate()
    {
        $openDate = config('constants.far_future_datetime');
        $closeDate = Carbon::parse($openDate)->addYear();
        $laterCloseDate = Carbon::parse($openDate)->addYears(2);

        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($this->community)
            ->create([
                'open_date' => $openDate,
                'close_date' => $closeDate,
            ]);

        $developmentProgram = DevelopmentProgram::factory()->create();
        $communityDevelopmentProgram = CommunityDevelopmentProgram::create([
            'community_id' => $this->communityId,
            'development_program_id' => $developmentProgram->id,
        ]);
        $talentNominationEvent->communityDevelopmentPrograms()->sync([$communityDevelopmentProgram->id]);

        // the program no longer belongs to this event's community
        $communityDevelopmentProgram->update(['community_id' => $this->otherCommunityId]);

        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        closeDate
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'community' => ['connect' => $this->communityId],
                    'closeDate' => $laterCloseDate->toDateTimeString(),
                    'communityDevelopmentPrograms' => [
                        'sync' => [
                            ['id' => $communityDevelopmentProgram->id],
                        ],
                    ],
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $talentNominationEvent->id,
                        'closeDate' => $laterCloseDate->toDateTimeString(),
                    ],
                ],
            ]);
    }

    // a genuinely new, wrongly-scoped development program id is still rejected on update
    public function testNewDevelopmentProgramMustBelongToCommunityOnUpdate()
    {
        $talentNominationEvent = TalentNominationEvent::factory()
            ->for($this->community)
            ->create();

        $newCommunity = Community::factory()->create();
        $developmentProgram = DevelopmentProgram::factory()->create();
        $newCommunityDevelopmentProgram = CommunityDevelopmentProgram::create([
            'community_id' => $newCommunity->id,
            'development_program_id' => $developmentProgram->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                    }
                }
                GRAPHQL, [
                'id' => $talentNominationEvent->id,
                'talentNominationEvent' => [
                    'community' => ['connect' => $this->communityId],
                    'communityDevelopmentPrograms' => [
                        'sync' => [
                            ['id' => $newCommunityDevelopmentProgram->id],
                        ],
                    ],
                ],
            ])
            ->assertGraphQLValidationError('talentNominationEvent.communityDevelopmentPrograms.sync.0.id', ErrorCode::COMMUNITY_DEVELOPMENT_PROGRAM_NOT_FOUND_OR_INVALID->name);
    }

    // test conditionally blocking of editing closing date sooner
    public function testMovingClosingDateSoonerBlockedForActiveEvents()
    {
        $futureOpenDate = '2050-01-01 01:23:45';
        $currentOpenDate = '2025-01-01 01:23:45';

        $futureClosingDate = '2100-01-01 01:23:45';
        $slightlySoonerClosingDate = '2099-01-01 01:23:45';

        $futureTalentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
            'open_date' => $futureOpenDate,
            'close_date' => $futureClosingDate,
        ]);
        $activeTalentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
            'open_date' => $currentOpenDate,
            'close_date' => $futureClosingDate,
        ]);

        // moving closing date sooner, but not before open, for a not-yet active event works
        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        name { en fr }
                        openDate
                        closeDate
                    }
                }
                GRAPHQL, [
                'id' => $futureTalentNominationEvent->id,
                'talentNominationEvent' => [
                    'name' => ['en' => 'New EN', 'fr' => 'New FR'],
                    'openDate' => $futureOpenDate,
                    'closeDate' => $slightlySoonerClosingDate,
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $futureTalentNominationEvent->id,
                        'openDate' => $futureOpenDate,
                        'closeDate' => $slightlySoonerClosingDate,
                    ],
                ],
            ]);

        // moving closing date sooner, but not before open, for an active event fails
        $this->actingAs($this->talentCoordinator, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        name { en fr }
                    }
                }
                GRAPHQL, [
                'id' => $activeTalentNominationEvent->id,
                'talentNominationEvent' => [
                    'openDate' => $currentOpenDate,
                    'closeDate' => $slightlySoonerClosingDate,
                ],
            ])
            ->assertGraphQLErrorMessage('Validation failed for the field [updateTalentNominationEvent].');
    }

    // some fields must stay the same once the event is active
    public function testCannotChangeCertainFieldsWhenEventActive()
    {
        $futureOpenDate = '2050-01-01 01:23:45';
        $currentOpenDate = '2025-01-01 01:23:45';
        $futureClosingDate = '2100-01-01 01:23:45';

        $futureOpenDatePlusAYear = '2051-01-01 01:23:45';

        $newCommunity = Community::factory()->create();

        $doubleAdmin = User::factory()
            ->asGuest()
            ->asApplicant()
            ->asCommunityAdmin([$this->communityId, $newCommunity->id])
            ->create();

        $futureTalentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
            'open_date' => $futureOpenDate,
            'close_date' => $futureClosingDate,
        ]);
        $activeTalentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
            'open_date' => $currentOpenDate,
            'close_date' => $futureClosingDate,
        ]);

        // future event
        // you can change the community, name, and opening date
        $this->actingAs($doubleAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        community {
                            id
                        }
                        name { en fr }
                        openDate
                    }
                }
                GRAPHQL, [
                'id' => $futureTalentNominationEvent->id,
                'talentNominationEvent' => [
                    'community' => [
                        'connect' => $newCommunity->id,
                    ],
                    'name' => [
                        'en' => 'EN',
                        'fr' => 'FR',
                    ],
                    'openDate' => $futureOpenDatePlusAYear,
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $futureTalentNominationEvent->id,
                        'community' => [
                            'id' => $newCommunity->id,
                        ],
                        'name' => [
                            'en' => 'EN',
                            'fr' => 'FR',
                        ],
                        'openDate' => $futureOpenDatePlusAYear,
                    ],
                ],
            ]);

        // active event
        // you cannot change the community, name, and opening date
        $this->actingAs($doubleAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        community {
                            id
                        }
                        name { en fr }
                        openDate
                    }
                }
                GRAPHQL, [
                'id' => $activeTalentNominationEvent->id,
                'talentNominationEvent' => [
                    'community' => [
                        'connect' => $newCommunity->id,
                    ],
                    'name' => [
                        'en' => 'EN',
                        'fr' => 'FR',
                    ],
                    'openDate' => $futureOpenDatePlusAYear,
                ],
            ])
            ->assertGraphQLValidationError('talentNominationEvent.community.connect', ErrorCode::TALENT_EVENT_CANNOT_CHANGE_COMMUNITY->name)
            ->assertGraphQLValidationError('talentNominationEvent.name.en', ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name)
            ->assertGraphQLValidationError('talentNominationEvent.name.fr', ErrorCode::TALENT_EVENT_CANNOT_CHANGE_NAME->name)
            ->assertGraphQLValidationError('talentNominationEvent.openDate', 'The talent nomination event.open date field must be a date equal to '.$currentOpenDate.'.');

        // active event
        // you can submit the mutation if the community, name, and opening date are the same as stored
        $this->actingAs($doubleAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateTalentNominationEvent($id: UUID!, $talentNominationEvent: UpdateTalentNominationEventInput!) {
                    updateTalentNominationEvent(id: $id, talentNominationEvent: $talentNominationEvent) {
                        id
                        community {
                            id
                        }
                        name { en fr }
                        openDate
                    }
                }
                GRAPHQL, [
                'id' => $activeTalentNominationEvent->id,
                'talentNominationEvent' => [
                    'community' => [
                        'connect' => $activeTalentNominationEvent->community_id,
                    ],
                    'name' => [
                        'en' => $activeTalentNominationEvent->name['en'],
                        'fr' => $activeTalentNominationEvent->name['fr'],
                    ],
                    'openDate' => $activeTalentNominationEvent->open_date->toDateTimeString(),
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateTalentNominationEvent' => [
                        'id' => $activeTalentNominationEvent->id,
                        'community' => [
                            'id' => $activeTalentNominationEvent->community_id,
                        ],
                        'name' => [
                            'en' => $activeTalentNominationEvent->name['en'],
                            'fr' => $activeTalentNominationEvent->name['fr'],
                        ],
                        'openDate' => $activeTalentNominationEvent->open_date->toDateTimeString(),
                    ],
                ],
            ]);
    }
}
