<?php

namespace Tests\Feature;

use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\DevelopmentProgramUser;
use App\Models\EducationExperience;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class DevelopmentProgramInterestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $user;

    protected $community;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();

        $this->user = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create([
                'email' => 'dev-program-interest-user@test.com',
                'sub' => 'dev-program-interest-user@test.com',
            ]);
    }

    protected string $updateMutation = <<<'GRAPHQL'
        mutation updateCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: UpdateCommunityInterestWithDevelopmentProgramsInput!) {
            updateCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                id
            }
        }
    GRAPHQL;

    /**
     * Querying a user's developmentProgramUserRecords via GraphQL should return
     * the linked educationExperience when one is set.
     */
    public function testQueryReturnsLinkedEducationExperience(): void
    {
        $program = DevelopmentProgram::factory()->withCommunity($this->community->id)->create();
        $education = EducationExperience::factory()->create([
            'user_id' => $this->user->id,
            'area_of_study' => 'Public Administration',
            'institution' => 'Carleton University',
        ]);

        CommunityInterest::factory()->create([
            'user_id' => $this->user->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        DevelopmentProgramUser::create([
            'development_program_id' => $program->id,
            'user_id' => $this->user->id,
            'participation_status' => DevelopmentProgramParticipationStatus::COMPLETED->name,
            'completion_date' => null,
            'education_experience_id' => $education->id,
        ]);

        $response = $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query {
                    me {
                        developmentProgramUserRecords {
                            participationStatus
                            educationExperience {
                                id
                            }
                        }
                    }
                }
            GRAPHQL);

        $response->assertJsonPath(
            'data.me.developmentProgramUserRecords.0.participationStatus',
            DevelopmentProgramParticipationStatus::COMPLETED->name
        );
        $response->assertJsonPath(
            'data.me.developmentProgramUserRecords.0.educationExperience.id',
            $education->id
        );
    }

    /**
     * Querying developmentProgramUserRecords when no experience is linked should
     * return null for educationExperience (not an error).
     */
    public function testQueryReturnsNullWhenNoLinkedExperience(): void
    {
        $program = DevelopmentProgram::factory()->withCommunity($this->community->id)->create();

        CommunityInterest::factory()->create([
            'user_id' => $this->user->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        DevelopmentProgramUser::create([
            'development_program_id' => $program->id,
            'user_id' => $this->user->id,
            'participation_status' => DevelopmentProgramParticipationStatus::INTERESTED->name,
            'completion_date' => null,
            'education_experience_id' => null,
        ]);

        $response = $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query {
                    me {
                        developmentProgramUserRecords {
                            participationStatus
                            educationExperience {
                                id
                            }
                        }
                    }
                }
            GRAPHQL);

        $response->assertGraphQLErrorFree();
        $response->assertJsonPath(
            'data.me.developmentProgramUserRecords.0.educationExperience',
            null
        );
    }

    /**
     * Cannot link another user's education experience via the update mutation.
     */
    public function testUpdateCannotConnectOtherUsersEducationExperience(): void
    {
        $program = DevelopmentProgram::factory()->create();
        $otherUsersExperience = EducationExperience::factory()->create([
            'user_id' => User::factory()->create()->id,
        ]);

        $communityInterest = CommunityInterest::factory()->create([
            'user_id' => $this->user->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        $this->actingAs($this->user, 'api')
            ->graphQL($this->updateMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'id' => $communityInterest->id,
                    'communityInterest' => ['consentToShareProfile' => true],
                    'developmentPrograms' => [
                        [
                            'developmentProgramId' => $program->id,
                            'educationExperienceId' => $otherUsersExperience->id,
                            'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                        ],
                    ],
                ],
            ])
            ->assertGraphQLValidationError(
                'communityInterestWithDevelopmentPrograms.developmentPrograms.0.educationExperienceId',
                ErrorCode::DEVELOPMENT_PROGRAM_MUST_CONNECT_OWN_EDUCATION_EXPERIENCE->name
            );
    }

    /**
     * Non-existent education experience ID returns a validation error.
     */
    public function testUpdateRejectsNonExistentEducationExperienceId(): void
    {
        $program = DevelopmentProgram::factory()->create();

        $communityInterest = CommunityInterest::factory()->create([
            'user_id' => $this->user->id,
            'community_id' => $this->community->id,
            'consent_to_share_profile' => true,
        ]);

        $this->actingAs($this->user, 'api')
            ->graphQL($this->updateMutation, [
                'communityInterestWithDevelopmentPrograms' => [
                    'id' => $communityInterest->id,
                    'communityInterest' => ['consentToShareProfile' => true],
                    'developmentPrograms' => [
                        [
                            'developmentProgramId' => $program->id,
                            'educationExperienceId' => Str::uuid(),
                            'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                        ],
                    ],
                ],
            ])
            ->assertGraphQLValidationError(
                'communityInterestWithDevelopmentPrograms.developmentPrograms.0.educationExperienceId',
                ErrorCode::DEVELOPMENT_PROGRAM_MUST_CONNECT_OWN_EDUCATION_EXPERIENCE->name
            );
    }
}
