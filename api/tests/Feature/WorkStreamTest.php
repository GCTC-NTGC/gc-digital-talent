<?php

namespace Tests\Feature;

use App\Enums\ErrorCode;
use App\Models\Community;
use App\Models\User;
use App\Models\WorkStream;
use Database\Seeders\CommunitySeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\WorkStreamSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class WorkStreamTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $guest;

    protected $nonAdmin;

    protected $admin;

    protected $communityId;

    protected $input = [
        'key' => 'test-work-stream',
        'talentSearchable' => true,
        'name' => [
            'en' => 'Test work stream (EN)',
            'fr' => 'Test work stream (FR)',
        ],
        'plainLanguageName' => [
            'en' => 'Test work stream (plain language EN)',
            'fr' => 'Test work stream (plain language FR)',
        ],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(CommunitySeeder::class);
        $this->seed(WorkStreamSeeder::class);

        $this->nonAdmin = User::factory()
            ->asGuest()
            ->asApplicant()
            ->create([
                'email' => 'non-admin-user@test.com',
                'sub' => 'non-admin-user@test.com',
            ]);

        $this->admin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->communityId = Community::first()->id;

    }

    /**
     * Test anonymous users can view any
     *
     * @return void
     */
    public function testAnonymousViewAny()
    {
        $this->graphQL('query { workStreams { id key } }')
            ->assertJsonFragment(['id' => WorkStream::first()->id]);
    }

    /**
     * Test admin can create
     */
    public function testPlatformAdminCanCreate()
    {

        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateWorkStream($workStream: CreateWorkStreamInput!) {
                    createWorkStream(workStream: $workStream) {
                        id
                        key
                        name {
                            en
                            fr
                        }
                        plainLanguageName {
                            en
                            fr
                        }
                        community { id }
                        talentSearchable
                    }
                }
                GRAPHQL,
                [
                    'workStream' => [
                        ...$this->input,
                        'community' => ['connect' => $this->communityId],
                    ],
                ])
            ->assertJson([
                'data' => [
                    'createWorkStream' => [
                        ...$this->input,
                        'community' => ['id' => $this->communityId],
                    ],
                ],
            ]);
    }

    /**
     * Test non-admin cannot create
     */
    public function testNonAdminCannotCreate()
    {

        $this->actingAs($this->nonAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation CreateWorkStream($workStream: CreateWorkStreamInput!) {
                    createWorkStream(workStream: $workStream) {
                        id
                    }
                }
                GRAPHQL,
                [
                    'workStream' => [
                        ...$this->input,
                        'community' => ['connect' => $this->communityId],
                    ],
                ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    /**
     * Test platform admins can update existing work streams
     */
    public function testPlatformAdminCanUpdate()
    {
        $workStreamId = WorkStream::first()->id;

        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateWorkStream($id: UUID!, $workStream: UpdateWorkStreamInput!) {
                    updateWorkStream(id: $id, workStream: $workStream) {
                        id
                        key
                    }
                }
                GRAPHQL, [
                'id' => $workStreamId,
                'workStream' => [
                    'key' => 'new-test-key',
                ],
            ])
            ->assertJson([
                'data' => [
                    'updateWorkStream' => [
                        'id' => $workStreamId,
                        'key' => 'new-test-key',
                    ],
                ],
            ]);
    }

    /**
     * Test non-admin cannot update
     */
    public function testNonAdminCannotUpdate()
    {
        $workStreamId = WorkStream::first()->id;

        $this->actingAs($this->nonAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
                mutation UpdateWorkStream($id: UUID!, $workStream: UpdateWorkStreamInput!) {
                    updateWorkStream(id: $id, workStream: $workStream) {
                        id
                    }
                }
                GRAPHQL,
                [
                    'id' => $workStreamId,
                    'workStream' => [
                        'key' => 'new-test-key',
                    ],
                ])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testWhereCommunityInScope()
    {
        // Unrelated
        $unexpected = WorkStream::factory()->create();

        $community = Community::factory()->create();

        $expected = WorkStream::factory()->create(['community_id' => $community->id]);

        $user = User::factory()
            ->asCommunityRecruiter($community->id)
            ->create();

        $this->actingAs($user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query TestWorkStreamsCommunityScope($ids: [UUID!]) {
                    workStreams(whereCommunityIn: $ids) {
                        id
                    }
                }
            GRAPHQL,
                [
                    'ids' => [$community->id],
                ])
            ->assertJson([
                'data' => [
                    'workStreams' => [
                        ['id' => $expected->id],
                    ],
                ],
            ]);

        // Ensure both appear without scope
        $this->actingAs($user, 'api')
            ->graphQL(<<<'GRAPHQL'
                query TestWorkStreamsCommunityScope($ids: [UUID!]) {
                    workStreams(whereCommunityIn: $ids) {
                        id
                    }
                }
            GRAPHQL,
                [
                    'ids' => null,
                ])->assertJsonFragments([
                    ['id' => $expected->id],
                    ['id' => $unexpected->id],
                ]);

    }

    /**
     * Test no duplicate work stream names
     */
    public function testNoDuplicateWorkStreamNames()
    {
        $workStream = WorkStream::factory()->create([
            'name' => [
                'en' => 'New work stream (EN)',
                'fr' => 'New work stream (FR)',
            ],
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL(<<<'GRAPHQL'
            mutation CreateWorkStream($workStream: CreateWorkStreamInput!) {
                createWorkStream(workStream: $workStream) {
                    id
                    key
                    name {
                        en
                        fr
                    }
                    plainLanguageName {
                        en
                        fr
                    }
                    community { id }
                    talentSearchable
                }
            }
            GRAPHQL,
                [
                    'workStream' => [
                        ...$this->input,
                        'name' => [
                            'en' => 'New work stream (EN)',
                            'fr' => 'New work stream (FR)',
                        ],
                        'community' => ['connect' => $this->communityId],
                    ],
                ])
            ->assertJsonFragment([ErrorCode::WORK_STREAM_NAME_IN_USE->name]);

        $this->actingAs($this->nonAdmin, 'api')
            ->graphQL(<<<'GRAPHQL'
            mutation UpdateWorkStream($id: UUID!, $workStream: UpdateWorkStreamInput!) {
                updateWorkStream(id: $id, workStream: $workStream) {
                    id
                }
            }
            GRAPHQL,
                [
                    'id' => $workStream->id,
                    'workStream' => [
                        'name' => [
                            'en' => 'New work stream (EN)',
                            'fr' => 'New work stream (FR)',
                        ],
                    ],
                ])
            ->assertJsonFragment([ErrorCode::WORK_STREAM_NAME_IN_USE->name]);
    }
}
