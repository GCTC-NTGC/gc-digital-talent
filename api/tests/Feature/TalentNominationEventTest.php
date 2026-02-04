<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\DevelopmentProgram;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    protected $communityId;

    protected $otherCommunityId;

    protected $developmentProgramId;

    protected $input = [
        'name' => ['en' => 'Test event EN', 'fr' => 'Test event FR'],
        'description' => ['en' => 'Test EN', 'fr' => 'Test FR'],
        'learnMoreUrl' => ['en' => 'http://en.domain.com', 'fr' => 'http://fr.domain.com'],
        'includeLeadershipCompetencies' => true,
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
                developmentPrograms { id }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $community = Community::factory()->create();
        $this->communityId = $community->id;

        $otherCommunity = Community::factory()->create();
        $this->otherCommunityId = $otherCommunity->id;

        $this->developmentProgramId = DevelopmentProgram::factory()->create(['community_id' => $this->communityId]);

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

        $this->developmentProgramId = $community->developmentPrograms()->sole()->pluck('id')[0];

        $this->input = [
            ...$this->input,
            'openDate' => config('constants.past_datetime'),
            'closeDate' => config('constants.far_future_datetime'),
        ];

    }

    public function testCreateTalentNominationEvent()
    {
        // platform admin can create for any community
        $this->actingAs($this->platformAdmin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->communityId],
                    'developmentPrograms' => ['sync' => [$this->developmentProgramId]],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createTalentNominationEvent' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'developmentPrograms' => [['id' => $this->developmentProgramId]],
                    ],
                ],
            ]);

        // community admin can create for own community only
        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $this->communityId],
                    'developmentPrograms' => ['sync' => [$this->developmentProgramId]],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createTalentNominationEvent' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                        'developmentPrograms' => [['id' => $this->developmentProgramId]],
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
        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'community_id' => $this->communityId,
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

    public function testDevelopmentProgramInCommunityValidation()
    {
        $community = Community::factory()->create(); // No development programs
        $developmentProgram = DevelopmentProgram::factory()->create([
            'community_id' => $this->communityId,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->createMutation, [
                'talentNominationEvent' => [
                    ...$this->input,
                    'community' => ['connect' => $community->id],
                    'developmentPrograms' => [
                        'sync' => ['id' => $developmentProgram->id],
                    ],
                ],
            ])
            ->assertGraphQLValidationError('talentNominationEvent.developmentPrograms.sync.0', ErrorCode::DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY->name);
    }
}
