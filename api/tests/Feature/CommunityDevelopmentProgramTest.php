<?php

namespace Tests\Feature;

use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\DevelopmentProgram;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;

class CommunityDevelopmentProgramTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $communityAdmin;

    protected $communityId;

    protected $developmentProgramId;

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
                     pivot {
                        descriptionForNominations {
                            localized
                        }
                     }
                     }
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

        $this->developmentProgramId = DevelopmentProgram::factory()
            ->withCommunity($this->communityId)
            ->create()
            ->id;

        $this->communityAdmin = User::factory()
            ->asGuest()
            ->asApplicant()
            ->asCommunityAdmin([$this->communityId])
            ->create([
                'email' => 'community-admin-test@test.com',
                'sub' => 'community-admin-test@test.com',
            ]);
    }

    // exercise creating -> (soft)deleting -> creating (restoring) a CommunityDevelopmentProgram record
    public function testCreateDeleteCreateCommunityDevelopmentProgram()
    {
        $classificationOneId = Classification::factory()->create()->id;
        $classificationTwoId = Classification::factory()->create()->id;

        CommunityDevelopmentProgram::truncate();

        // CommunityDevelopmentProgram record created successfully
        $this->actingAs($this->communityAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation createOrRestoreCommunityDevelopmentProgram($createCommunityDevelopmentProgram: CreateCommunityDevelopmentProgramInput!) {
                    createOrRestoreCommunityDevelopmentProgram(createCommunityDevelopmentProgram: $createCommunityDevelopmentProgram) {
                        community {
                            id
                        }
                        developmentProgram {
                            id
                        }
                        classifications {
                            id
                        }
                    }
                }
                GRAPHQL, [
                'createCommunityDevelopmentProgram' => [
                    'communityId' => $this->communityId,
                    'developmentProgramId' => $this->developmentProgramId,
                    'classifications' => ['sync' => [$classificationOneId]],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createOrRestoreCommunityDevelopmentProgram' => [
                        'community' => ['id' => $this->communityId],
                        'developmentProgram' => ['id' => $this->developmentProgramId],
                        'classifications' => [
                            ['id' => $classificationOneId],
                        ],
                    ],
                ],
            ]);

        // fetch the sole record
        $createdRecord = CommunityDevelopmentProgram::withTrashed()->sole()->toArray();
        assertNull($createdRecord['deleted_at']);

        // CommunityDevelopmentProgram record deleted successfully
        $this->actingAs($this->communityAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation deleteCommunityDevelopmentProgram($id: UUID!) {
                    deleteCommunityDevelopmentProgram(id: $id) {
                        id
                    }
                }
                GRAPHQL, [
                'id' => $createdRecord['id'],
            ])
            ->assertJson([
                'data' => [
                    'deleteCommunityDevelopmentProgram' => [
                        'id' => $createdRecord['id'],
                    ],
                ],
            ]);

        // fetch record after deletion
        // then make assertions
        $recordAfterDeletion = CommunityDevelopmentProgram::withTrashed()->sole()->toArray();
        assertSame($createdRecord['id'], $recordAfterDeletion['id']);
        assertNotNull($recordAfterDeletion['deleted_at']);

        // CommunityDevelopmentProgram created/restored successfully
        // pass in classification two simultaneously
        $this->actingAs($this->communityAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation createOrRestoreCommunityDevelopmentProgram($createCommunityDevelopmentProgram: CreateCommunityDevelopmentProgramInput!) {
                    createOrRestoreCommunityDevelopmentProgram(createCommunityDevelopmentProgram: $createCommunityDevelopmentProgram) {
                        community {
                            id
                        }
                        developmentProgram {
                            id
                        }
                        classifications {
                            id
                        }
                    }
                }
                GRAPHQL, [
                'createCommunityDevelopmentProgram' => [
                    'communityId' => $this->communityId,
                    'developmentProgramId' => $this->developmentProgramId,
                    'classifications' => ['sync' => [$classificationTwoId]],
                ],
            ])
            ->assertJson([
                'data' => [
                    'createOrRestoreCommunityDevelopmentProgram' => [
                        'community' => ['id' => $this->communityId],
                        'developmentProgram' => ['id' => $this->developmentProgramId],
                        'classifications' => [
                            ['id' => $classificationTwoId],
                        ],
                    ],
                ],
            ]);

        // fetch record after restore
        // then make assertions
        $recordAfterRestoring = CommunityDevelopmentProgram::withTrashed()->sole()->toArray();
        assertSame($createdRecord['id'], $recordAfterRestoring['id']);
        assertNull($recordAfterRestoring['deleted_at']);
    }
}
