<?php

namespace Tests\Feature;

use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Enums\TalentRequestSource;
use App\Models\Community;
use App\Models\Department;
use App\Models\TalentRequest;
use App\Models\User;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected string $createMutation = <<<'GRAPHQL'
        mutation CreateTalentRequest($talentRequest: CreateTalentRequestInput!) {
            createTalentRequest(talentRequest: $talentRequest) {
                id
                fullName
                email
                user {
                    id
                }
            }
        }
        GRAPHQL;

    protected User $adminUser;

    protected User $teamRecruiter;

    protected Community $authorizedCommunity;

    protected Community $otherCommunity;

    protected string $talentRequestsQuery = <<<'GRAPHQL'
        query TalentRequests {
            talentRequests {
                data {
                    id
                }
                paginatorInfo {
                    total
                }
            }
        }
        GRAPHQL;

    protected string $updateMutation = <<<'GRAPHQL'
        mutation UpdateTalentRequest($id: ID!, $talentRequest: UpdateTalentRequestInput!) {
            updateTalentRequest(id: $id, talentRequest: $talentRequest) {
                id
                adminData {
                    adminNotes
                }
            }
        }
        GRAPHQL;

    protected string $talentRequestAdminDataQuery = <<<'GRAPHQL'
        query TalentRequest($id: UUID!) {
            talentRequest(id: $id) {
                id
                jobTitle
                adminData {
                    adminNotes
                    followUpDate
                }
            }
        }
        GRAPHQL;

    protected string $talentRequestWithoutAdminDataQuery = <<<'GRAPHQL'
        query TalentRequest($id: UUID!) {
            talentRequest(id: $id) {
                id
                jobTitle
            }
        }
        GRAPHQL;

    protected string $meTalentRequestsAdminDataQuery = <<<'GRAPHQL'
        query MeTalentRequests {
            me {
                talentRequests {
                    id
                    jobTitle
                    adminData {
                        adminNotes
                        followUpDate
                    }
                }
            }
        }
        GRAPHQL;

    protected string $meTalentRequestsWithoutAdminDataQuery = <<<'GRAPHQL'
        query MeTalentRequests {
            me {
                talentRequests {
                    id
                    jobTitle
                }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
            CommunitySeeder::class,
        ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->authorizedCommunity = Community::factory()->create();
        $this->otherCommunity = Community::factory()->create();

        $this->teamRecruiter = User::factory()
            ->asCommunityRecruiter([$this->authorizedCommunity->id])
            ->create([
                'email' => 'team-recruiter@test.com',
                'sub' => 'team-recruiter@test.com',
            ]);
    }

    /** @param array<mixed> $overrides */
    private function buildCreateInput(array $overrides = []): array
    {
        return array_merge([
            'fullName' => 'Test User',
            'email' => 'test@gc.ca',
            'jobTitle' => 'Job Title',
            'managerJobTitle' => 'Manager',
            'positionType' => TalentRequestPositionType::INDIVIDUAL_CONTRIBUTOR->name,
            'reason' => TalentRequestReason::GENERAL_INTEREST->name,
            'department' => ['connect' => Department::inRandomOrder()->first()->id],
            'community' => ['connect' => Community::inRandomOrder()->first()->id],
            'applicantFilter' => [
                'create' => [
                    'hasDiploma' => true,
                    'community' => ['connect' => Community::inRandomOrder()->first()->id],
                ],
            ],
        ], $overrides);
    }

    public function testCreateRequiresApplicantFilter(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(['applicantFilter' => null]),
        ])->assertJsonStructure(['errors']);
    }

    public function testCreateSucceedsWithAllRequiredFields(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(),
        ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment([
                'fullName' => 'Test User',
                'email' => 'test@gc.ca',
            ]);
    }

    public function testCreateStoresTalentSources(): void
    {
        $response = $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput([
                'applicantFilter' => [
                    'create' => [
                        'hasDiploma' => true,
                        'community' => ['connect' => Community::inRandomOrder()->first()->id],
                        'talentSources' => [
                            TalentRequestSource::QUALIFIED_IN_POOL->name,
                            TalentRequestSource::AT_LEVEL->name,
                        ],
                    ],
                ],
            ]),
        ])->assertGraphQLErrorFree();

        $id = $response->json('data.createTalentRequest.id');
        $talentRequest = TalentRequest::find($id);

        $this->assertEqualsCanonicalizing(
            [TalentRequestSource::QUALIFIED_IN_POOL->name, TalentRequestSource::AT_LEVEL->name],
            $talentRequest->applicantFilter->talent_sources,
        );
    }

    public function testCreateRejectsNonGovernmentEmail(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(['email' => 'not-a-gov-email@example.com']),
        ])->assertGraphQLValidationKeys(['talentRequest.email']);
    }

    public function testUserIdIsNullForUnauthenticatedCreate(): void
    {
        $this->graphQL($this->createMutation, [
            'talentRequest' => $this->buildCreateInput(),
        ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['user' => null]);
    }

    public function testUserIdIsSetForAuthenticatedCreate(): void
    {
        $this->actingAs($this->adminUser, 'api')
            ->graphQL($this->createMutation, [
                'talentRequest' => $this->buildCreateInput(),
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['user' => ['id' => $this->adminUser->id]]);
    }

    public function testTeamRecruiterCanQueryTalentRequestsForOwnCommunity(): void
    {
        $visibleRequest = TalentRequest::factory()->create([
            'community_id' => $this->authorizedCommunity->id,
        ]);
        $hiddenRequest = TalentRequest::factory()->create([
            'community_id' => $this->otherCommunity->id,
        ]);

        $this->actingAs($this->teamRecruiter, 'api')
            ->graphQL($this->talentRequestsQuery)
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['id' => $visibleRequest->id])
            ->assertJsonMissing(['id' => $hiddenRequest->id]);
    }

    public function testTeamRecruiterCanOnlyUpdateOwnCommunityTalentRequest(): void
    {
        $ownRequest = TalentRequest::factory()->create([
            'community_id' => $this->authorizedCommunity->id,
        ]);
        $otherRequest = TalentRequest::factory()->create([
            'community_id' => $this->otherCommunity->id,
        ]);

        $this->actingAs($this->teamRecruiter, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $ownRequest->id,
                'talentRequest' => ['adminNotes' => 'hardcoded message here'],
            ])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['adminNotes' => 'hardcoded message here']);

        $this->actingAs($this->teamRecruiter, 'api')
            ->graphQL($this->updateMutation, [
                'id' => $otherRequest->id,
                'talentRequest' => ['adminNotes' => 'hardcoded message here'],
            ])
            ->assertJsonFragment(['message' => 'This action is unauthorized.']);
    }

    private function createRequestWithAdminData(?User $submitter = null, ?Community $community = null): TalentRequest
    {
        return TalentRequest::factory()->create([
            'user_id' => $submitter?->id,
            'community_id' => ($community ?? $this->authorizedCommunity)->id,
            'job_title' => 'Submitted job title',
            'admin_notes' => 'Internal note',
            'follow_up_date' => '2026-12-01',
        ]);
    }

    public function testSubmitterCannotViewAdminDataOfOwnRequest(): void
    {
        $submitter = User::factory()->asApplicant()->create();
        $talentRequest = $this->createRequestWithAdminData($submitter);

        $this->actingAs($submitter, 'api')
            ->graphQL($this->talentRequestAdminDataQuery, ['id' => $talentRequest->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        $this->actingAs($submitter, 'api')
            ->graphQL($this->meTalentRequestsAdminDataQuery)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testSubmitterCanViewOtherFieldsOfOwnRequest(): void
    {
        $submitter = User::factory()->asApplicant()->create();
        $talentRequest = $this->createRequestWithAdminData($submitter);

        $this->actingAs($submitter, 'api')
            ->graphQL($this->talentRequestWithoutAdminDataQuery, ['id' => $talentRequest->id])
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['id' => $talentRequest->id, 'jobTitle' => 'Submitted job title']);

        $this->actingAs($submitter, 'api')
            ->graphQL($this->meTalentRequestsWithoutAdminDataQuery)
            ->assertGraphQLErrorFree()
            ->assertJsonFragment(['id' => $talentRequest->id, 'jobTitle' => 'Submitted job title']);
    }

    public function testAdminsAndTeamMembersCanViewAdminData(): void
    {
        $talentRequest = $this->createRequestWithAdminData();
        $communityAdmin = User::factory()->asCommunityAdmin([$this->authorizedCommunity->id])->create();

        collect([$this->adminUser, $this->teamRecruiter, $communityAdmin])
            ->each(fn (User $user) => $this->actingAs($user, 'api')
                ->graphQL($this->talentRequestAdminDataQuery, ['id' => $talentRequest->id])
                ->assertGraphQLErrorFree()
                ->assertJsonFragment([
                    'adminData' => [
                        'adminNotes' => 'Internal note',
                        'followUpDate' => '2026-12-01',
                    ],
                ]));
    }

    public function testOtherTeamCommunityAdminCannotViewAdminData(): void
    {
        $talentRequest = $this->createRequestWithAdminData();
        $otherCommunityAdmin = User::factory()->asCommunityAdmin([$this->otherCommunity->id])->create();

        $this->assertFalse($otherCommunityAdmin->can('viewAdminData', $talentRequest));
        $this->actingAs($otherCommunityAdmin, 'api')
            ->graphQL($this->talentRequestAdminDataQuery, ['id' => $talentRequest->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testTeamMemberCannotViewAdminDataOfOwnRequestToOtherCommunity(): void
    {
        $submittingRecruiter = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter([$this->authorizedCommunity->id])
            ->create();
        $talentRequest = $this->createRequestWithAdminData($submittingRecruiter, $this->otherCommunity);

        $this->actingAs($submittingRecruiter, 'api')
            ->graphQL($this->talentRequestWithoutAdminDataQuery, ['id' => $talentRequest->id])
            ->assertGraphQLErrorFree();

        $this->actingAs($submittingRecruiter, 'api')
            ->graphQL($this->talentRequestAdminDataQuery, ['id' => $talentRequest->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
