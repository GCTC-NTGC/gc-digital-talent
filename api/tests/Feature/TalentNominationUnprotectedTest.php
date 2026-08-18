<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\TalentNominationEvent;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TalentNominationUnprotectedTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $communityTalentCoordinator;

    protected $createMutation = <<<'GRAPHQL'
    mutation CreateTalentNomination($talentNomination: CreateTalentNominationInput!) {
        createTalentNomination(talentNomination: $talentNomination) {
                id
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        // Simulate the regular public GraphQL request context.
        Config::set('lighthouse.route.name', 'graphql');

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
    }

    public function testCommunityTalentCoordinatorCannotCreatePastNominationOnUnprotectedEndpoint()
    {
        $event = TalentNominationEvent::factory()->create([
            'open_date' => config('constants.past_datetime'),
            'close_date' => config('constants.past_datetime'),
        ]);

        $this->communityTalentCoordinator = User::factory()
            ->state([
                'computed_is_gov_employee' => true,
                'work_email' => 'coordinator@gc.ca',
                'work_email_verified_at' => now(),
            ])
            ->asGuest()
            ->asApplicant()
            ->asCommunityTalentCoordinator($event->community_id)
            ->create();

        $this->actingAs($this->communityTalentCoordinator, 'api')
            ->graphQL($this->createMutation, [
                'talentNomination' => [
                    'talentNominationEvent' => [
                        'connect' => $event->id,
                    ],
                ],
            ])
            ->assertGraphQLValidationError('talentNomination', ErrorCode::TALENT_EVENT_IS_CLOSED->name);
    }
}
