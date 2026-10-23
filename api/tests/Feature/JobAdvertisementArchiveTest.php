<?php

namespace Tests\Feature;

use App\Enums\JobAdvertisementArchiveType;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class JobAdvertisementArchiveTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected User $user;

    protected Pool $pool;

    protected string $query = <<<'GRAPHQL'
        query JobAdvertisementArchiveTest($id: UUID!, $type: JobAdvertisementArchiveType) {
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
            ->assertJsonFragment(['type' => JobAdvertisementArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobAdvertisementArchiveType::CLOSED->name])
            ->assertJsonCount(2, 'data.pool.archives');
    }

    public function testCanFilterByType()
    {
        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobAdvertisementArchiveType::PUBLISHED->name,
            ])
            ->assertJsonFragment(['type' => JobAdvertisementArchiveType::PUBLISHED->name])
            ->assertJsonMissing(['type' => JobAdvertisementArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
                'type' => JobAdvertisementArchiveType::CLOSED->name,
            ])
            ->assertJsonMissing(['type' => JobAdvertisementArchiveType::PUBLISHED->name])
            ->assertJsonFragment(['type' => JobAdvertisementArchiveType::CLOSED->name])
            ->assertJsonCount(1, 'data.pool.archives');
    }

    public function testRetrievesHtml()
    {
        $expected = [
            'en' => $this->pool->toAdvertisementHtml('en'),
            'fr' => $this->pool->toAdvertisementHtml('fr'),
        ];

        $this->actingAs($this->user, 'api')
            ->graphQL($this->query, [
                'id' => $this->pool->id,
            ])->assertJsonFragment([
                'type' => JobAdvertisementArchiveType::CLOSED->name,
                'html' => $expected,
            ]);
    }
}
