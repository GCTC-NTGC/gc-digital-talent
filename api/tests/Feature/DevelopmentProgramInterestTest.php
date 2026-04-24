<?php

namespace Tests\Feature;

use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\DevelopmentProgram;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

// now refers to development_program_user records
class DevelopmentProgramInterestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'community-interested-user@test.com',
                'sub' => 'community-interested-user@test.com',
            ]);
    }

    /**
     * Can't add a completion date to the development program interest if the status is not completed
     */
    public function testUserCantAddCompletionDateWithoutStatus()
    {
        $community = Community::factory()->create();
        $program = DevelopmentProgram::factory()->withCommunity($community->id)->create();
        $community->refresh();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation createCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: CreateCommunityInterestWithDevelopmentProgramsInput!) {
                    createCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                        jobInterest
                        trainingInterest
                        additionalInformation
                        community {
                            id
                        }
                        workStreams {
                            id
                        }
                    }
                }
            GRAPHQL,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->user->id,
                        'communityInterest' => [
                            'communityId' => $community->id,
                            'consentToShareProfile' => true,
                        ],
                        'developmentPrograms' => [
                            [
                                'developmentProgramId' => $program->id,
                                'participationStatus' => DevelopmentProgramParticipationStatus::ENROLLED->name,
                                'completionDate' => '2020-01-01',
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError(
                'communityInterestWithDevelopmentPrograms.developmentPrograms.0.completionDate',
                ErrorCode::DEVELOPMENT_PROGRAM_COMPLETION_DATE_PROHIBITED->name
            );
    }

    /**
     * Can't set the development program interest to completed without a completion date
     */
    public function testUserCantUseCompletionStatusWithoutDate()
    {
        $community = Community::factory()->create();
        $program = DevelopmentProgram::factory()->withCommunity($community->id)->create();
        $community->refresh();

        $this->actingAs($this->user, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation createCommunityInterestWithDevelopmentPrograms($communityInterestWithDevelopmentPrograms: CreateCommunityInterestWithDevelopmentProgramsInput!) {
                    createCommunityInterestWithDevelopmentPrograms(communityInterestWithDevelopmentPrograms: $communityInterestWithDevelopmentPrograms) {
                        jobInterest
                        trainingInterest
                        additionalInformation
                        community {
                            id
                        }
                        workStreams {
                            id
                        }
                    }
                }
            GRAPHQL,
                [
                    'communityInterestWithDevelopmentPrograms' => [
                        'userId' => $this->user->id,
                        'communityInterest' => [
                            'communityId' => $community->id,
                            'consentToShareProfile' => true,
                        ],
                        'developmentPrograms' => [
                            [
                                'developmentProgramId' => $program->id,
                                'participationStatus' => DevelopmentProgramParticipationStatus::COMPLETED->name,
                                'completionDate' => null,
                            ],
                        ],
                    ],
                ])
            ->assertGraphQLValidationError(
                'communityInterestWithDevelopmentPrograms.developmentPrograms.0.completionDate',
                ErrorCode::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED->name
            );
    }
}
