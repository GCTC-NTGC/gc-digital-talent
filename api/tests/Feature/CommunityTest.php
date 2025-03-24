<?php

namespace Tests\Feature;

use App\Models\Community;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;

class CommunityTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $admin;

    protected $communityRecruiter1;

    protected $communityRecruiter2;

    protected $communityRecruiter3;

    protected $community1;

    protected $community2;

    protected $community3;

    protected $toBeDeletedUUID;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        // Create communities.
        $this->toBeDeletedUUID = $this->faker->UUID();
        $this->community1 = Community::factory()->create();
        $this->community2 = Community::factory()->create();
        $this->community3 = Community::factory()->create([
            'id' => $this->toBeDeletedUUID, // need specific ID for delete community testing.
        ]);

        // Create users.
        $this->admin = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->communityRecruiter1 = User::factory()
            ->asCommunityRecruiter($this->community1->id)
            ->create([
                'email' => 'communityRecruiter1@test.com',
                'sub' => 'communityRecruiter1@test.com',
            ]);

        $this->communityRecruiter2 = User::factory()
            ->asCommunityRecruiter($this->community2->id)
            ->create([
                'email' => 'communityRecruiter2@test.com',
                'sub' => 'communityRecruiter2@test.com',
            ]);

        $this->communityRecruiter3 = User::factory()
            ->create([
                'email' => 'communityRecruiter3@test.com',
                'sub' => 'communityRecruiter3@test.com',
            ]);
    }

    public function testAllCommunitiesQuery(): void
    {
        // Assert all communities query contains expected results.
        $query = $this->actingAs($this->admin, 'api')
            ->graphQL(
                /** @lang GraphQL */
                '
      query communities {
          communities {
              id
              key
          }
      }
    '
            );
        $data = $query->original['data'];

        // assert the communities returned is an array of exactly three items.
        $communitiesArrayCount = count($data['communities']);
        assertEquals($communitiesArrayCount, 3);

        // assert every community created is present in the response.
        $query->assertJsonFragment(['id' => $this->community1->id]);
        $query->assertJsonFragment(['id' => $this->community2->id]);
        $query->assertJsonFragment(['id' => $this->community3->id]);
    }

    public function testCommunityCreateMutation(): void
    {

        // Assert null key causes failure.
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
      mutation createCommunity($community: CreateCommunityInput!) {
        createCommunity(community: $community) {
            key
          }
      }
    ',
            [
                'community' => [
                    'key' => null,
                ],
            ]
        )->assertJsonFragment(
            [
                'message' => 'Variable "$community" got invalid value null at "community.key"; Expected non-nullable type "String!" not to be null.',
            ]
        );

        // Assert community creation successful across all input fields.
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
      mutation createCommunity($community: CreateCommunityInput!) {
        createCommunity(community: $community) {
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
          }
      }
    ',
            [
                'community' => [
                    'key' => 'community one',
                    'name' => [
                        'en' => 'en',
                        'fr' => 'fr',
                    ],
                    'description' => [
                        'en' => 'en',
                        'fr' => 'fr',
                    ],
                ],
            ]
        )->assertJson(
            [
                'data' => [
                    'createCommunity' => [
                        'key' => 'community one',
                        'name' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                        'description' => [
                            'en' => 'en',
                            'fr' => 'fr',
                        ],
                    ],
                ],
            ]
        );

        // Assert creating a second community with the same name fails.
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
    mutation createCommunity($community: CreateCommunityInput!) {
        createCommunity(community: $community) {
            key
        }
      }
    ',
            [
                'community' => [
                    'key' => 'community one',
                ],
            ]
        )->assertJsonFragment(
            [
                'createCommunity' => null,
            ]
        );
    }

    public function testCommunityUpdateMutation(): void
    {
        // Assert community update successful across all input fields.
        $this->actingAs($this->admin, 'api')->graphQL(
            /** @lang GraphQL */
            '
      mutation updateCommunity($id: UUID!, $community: UpdateCommunityInput!) {
        updateCommunity(id: $id, community: $community) {
            key
            name {
              en
              fr
            }
            description {
              en
              fr
            }
          }
      }
      ',
            [
                'id' => $this->community1->id,
                'community' => [
                    'key' => 'new_community_name',
                    'name' => [
                        'en' => 'New Community Name EN',
                        'fr' => 'New Community Name FR',
                    ],
                    'description' => [
                        'en' => 'New Community Description EN',
                        'fr' => 'New Community Description FR',
                    ],
                ],
            ]
        )->assertJson([
            'data' => [
                'updateCommunity' => [
                    'key' => 'new_community_name',
                    'name' => [
                        'en' => 'New Community Name EN',
                        'fr' => 'New Community Name FR',
                    ],
                    'description' => [
                        'en' => 'New Community Description EN',
                        'fr' => 'New Community Description FR',
                    ],
                ],
            ],
        ]);
    }

    public function testViewCommunityMembers(): void
    {
        $this->community1->addCommunityRecruiters([$this->communityRecruiter1->id, $this->communityRecruiter2->id]);
        $this->community2->addCommunityRecruiters([$this->communityRecruiter3->id]);
        $viewAnyCommunityMembers =
            /** @lang GraphQL */
            '
        query community($id: UUID!) {
            community(id: $id) {
              id
              roleAssignments {
                id
                user {
                  id
                }
              }
          }
        }
    ';

        $variables = ['id' => $this->community1->id];

        // Assert user with role admin can query any community members, regardless of being a member of the community.
        $query = $this->actingAs($this->admin, 'api')
            ->graphQL($viewAnyCommunityMembers, $variables)
            ->assertJsonFragment([
                'id' => $this->communityRecruiter1->id,
                'id' => $this->communityRecruiter2->id,
            ]);

        // assert community recruiter three is not present in the response.
        $query->assertJsonMissing(['id' => $this->communityRecruiter3->id]);

        // assert the communities returned is an array of exactly two items.
        $data = $query->original['data'];
        $communityMembersCount = count($data['community']['roleAssignments']);
        assertEquals($communityMembersCount, 2);

        // Assert community recruiter can view community members of their community.
        $query = $this->actingAs($this->communityRecruiter1, 'api')
            ->graphQL($viewAnyCommunityMembers, $variables)
            ->assertJsonFragment([
                'id' => $this->communityRecruiter1->id,
                'id' => $this->communityRecruiter2->id,
            ]);

        // assert community recruiter three is not present in the response.
        $query->assertJsonMissing(['id' => $this->communityRecruiter3->id]);

        // assert the communities returned is an array of exactly two items.
        $data = $query->original['data'];
        $communityMembersCount = count($data['community']['roleAssignments']);
        assertEquals($communityMembersCount, 2);

        // assert community recruiter cannot view community members of a community they're not attached too.
        $query = $this->actingAs($this->communityRecruiter3, 'api')
            ->graphQL($viewAnyCommunityMembers, $variables)
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }
}
