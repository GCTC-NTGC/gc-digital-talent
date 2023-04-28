<?php

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\Skill;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class PoolCandidateUpdateTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use WithFaker;

    protected $guestUser;
    protected $applicantUser;
    protected $candidateUser;
    protected $poolOperatorUser;
    protected $requestResponderUser;
    protected $adminUser;
    protected $team;
    protected $teamPool;
    protected $poolCandidate;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $baseRoles = ["guest", "base_user", "applicant"];

        $this->guestUser = User::factory()->create([
            'email' => 'guest-user@test.com',
            'sub' => 'guest-user@test.com',
        ]);
        $this->guestUser->syncRoles(["guest"]);

        $this->applicantUser = User::factory()->create([
            'email' => 'applicant-user@test.com',
            'sub' => 'applicant-user@test.com',
        ]);
        $this->applicantUser->syncRoles($baseRoles);

        $this->poolOperatorUser = User::factory()->create([
            'email' => 'pool-operator-user@test.com',
            'sub' => 'pool-operator-user@test.com',
        ]);
        $this->team = Team::factory()->create(['name' => 'test-team']);
        $this->poolOperatorUser->addRole("pool_operator", $this->team);

        $this->requestResponderUser = User::factory()->create([
            'email' => 'request-responder-user@test.com',
            'sub' => 'request-responder-user@test.com',
        ]);
        $this->requestResponderUser->syncRoles([
            "request_responder"
        ]);

        $this->adminUser = User::factory()->create([
            'email' => 'platform-admin-user@test.com',
            'sub' => 'platform-admin-user@test.com',
        ]);
        $this->adminUser->syncRoles([
            "platform_admin"
        ]);

        $this->candidateUser = User::factory()->create([
            'email' => 'candidate-user@test.com',
            'sub' => 'candidate-user@test.com',
        ]);
        $this->candidateUser->syncRoles($baseRoles);

        $this->teamPool = Pool::factory()->create([
            'user_id' => $this->poolOperatorUser->id,
            'team_id' => $this->team->id,
        ]);

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->teamPool->id
        ]);
    }

    /**
     * Test owner can update draft application
     *
     * @return void
     */
    public function testUpdateDraft()
    {
        // update draft application by updating submitted steps
        $mut =
            /** @lang GraphQL */
            '
            mutation($id: ID!) {
                updateApplication (
                    id: $id
                    application: {insertSubmittedStep: WELCOME}
                ) {
                    submittedSteps
                }
            }
        ';

        // set candidate to draft with no steps
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->submitted_steps = [];
        $this->poolCandidate->save();

        // candidate owner can add a step
        $this->actingAs($this->candidateUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                "data" => [
                    "updateApplication" => [
                        "submittedSteps" => ["WELCOME"],
                    ]
                ]
            ]);

        // guest can't add a step
        $this->actingAs($this->guestUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' =>  [
                    ['message' => "This action is unauthorized."]
                ]
            ]);

        // other applicant can't add a step
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' =>  [
                    ['message' => "This action is unauthorized."]
                ]
            ]);

        // pool operator can't add a step
        $this->actingAs($this->poolOperatorUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' =>  [
                    ['message' => "This action is unauthorized."]
                ]
            ]);

        // pool operator can't add a step
        $this->actingAs($this->requestResponderUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' =>  [
                    ['message' => "This action is unauthorized."]
                ]
            ]);

        // admin can't add a step
        $this->actingAs($this->adminUser, "api")
            ->graphQL($mut, ['id' => $this->poolCandidate->id])
            ->assertJson([
                'errors' =>  [
                    ['message' => "This action is unauthorized."]
                ]
            ]);
    }

    public function testEducationRequirementExperience(): void
    {
        $updateApplication =
            /** @lang GraphQL */
            '
            mutation updateApplication($id: ID!, $application: UpdateApplicationInput!) {
                updateApplication(id: $id, application: $application) {
                    id
                    educationRequirementOption
                    educationRequirementExperiences {
                        id
                    }
                }
            }
        ';

        Skill::factory()->count(5)->create();
        EducationExperience::factory()->count(3)->create(['user_id' => $this->poolCandidate->user_id]);
        CommunityExperience::factory()->count(3)->create(['user_id' => $this->poolCandidate->user_id]);
        $communityExperienceIds = CommunityExperience::all()->pluck('id')->toArray();
        $educationExperienceIds = EducationExperience::all()->pluck('id')->toArray();
        $this->poolCandidate->submitted_at = null;
        $this->poolCandidate->education_requirement_option = null;
        $this->poolCandidate->save();

        // assert educationRequirementOption updated and that an education experience is successfully connected
        $response = $this->actingAs($this->candidateUser, "api")->graphQL($updateApplication, [
            'id' => $this->poolCandidate->id,
            'application' => [
                'educationRequirementOption' => ApiEnums::EDUCATION_REQUIREMENT_OPTION_EDUCATION,
                'educationRequirementEducationExperiences' => [
                    'sync' => [$educationExperienceIds[0]],
                ],
            ]
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => ApiEnums::EDUCATION_REQUIREMENT_OPTION_EDUCATION]);
        $response->assertJsonFragment([
            ['id' => $educationExperienceIds[0]]
        ]);

        // assert educationRequirementOption updated again, education experience was disconnected, and 3 community experiences synced
        $response = $this->actingAs($this->candidateUser, "api")->graphQL($updateApplication, [
            'id' => $this->poolCandidate->id,
            'application' => [
                'educationRequirementOption' => ApiEnums::EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK,
                'educationRequirementCommunityExperiences' => [
                    'sync' => $communityExperienceIds,
                ],
                'educationRequirementEducationExperiences' => [
                    'sync' => [],
                ],
            ]
        ]);
        $response->assertJsonFragment(['educationRequirementOption' => ApiEnums::EDUCATION_REQUIREMENT_OPTION_APPLIED_WORK]);
        $response->assertJsonMissing([
            ['id' => $educationExperienceIds[0]]
        ]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[0]]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[1]]);
        $response->assertJsonFragment(['id' => $communityExperienceIds[2]]);
        $experiencesAttached = $response->json('data.updateApplication.educationRequirementExperiences');
        assertEquals(3, count($experiencesAttached));
    }
}
