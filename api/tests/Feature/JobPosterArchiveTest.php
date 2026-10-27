<?php

namespace Tests\Feature;

use App\Enums\JobPosterArchiveType;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class JobPosterArchiveTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $user;

    protected Pool $pool;

    protected string $query = <<<'GRAPHQL'
        query JobPosterArchiveTest($id: UUID!, $type: JobPosterArchiveType) {
            pool(id: $id) {
                archives(type: $type) {
                    type
                    html { en fr }
                }
            }
        }
    GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->user = User::factory()->asApplicant()->create();

        $this->pool = Pool::factory()->closed()->create();
    }

    public function testRetrieveAllArchives()
    {
        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
            ])
            ->assertJsonFragment(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(2, 'data.pool.archives');
    }

    public function testCanFilterByType()
    {
        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobPosterArchiveType::PUBLISHED->name,
            ])
            ->assertJsonFragment(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonMissing(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobPosterArchiveType::CLOSED->name,
            ])
            ->assertJsonMissing(['type' => JobPosterArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobPosterArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');
    }

    public function testRetrievesHtml()
    {
        $expected = [
            'en' => $this->pool->toJobPosterHtml('en'),
            'fr' => $this->pool->toJobPosterHtml('fr'),
        ];

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
            ])->assertJsonFragment([
                'type' => JobPosterArchiveType::CLOSED->name,
                'html' => $expected,
            ]);
    }
}
