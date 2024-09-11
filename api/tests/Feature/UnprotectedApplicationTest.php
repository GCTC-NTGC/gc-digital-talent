<?php

namespace Tests\Feature;

use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

class UnprotectedApplicationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function testApplicantCanViewOwnApplications()
    {
        $user = User::factory()
            ->asApplicant()
            ->create();
        $application = PoolCandidate::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user, 'api')->graphQL(<<<'GRAPHQL'
            query {
                me {
                    poolCandidates { id }
                }
            }
            GRAPHQL
        )->assertJson([
            'data' => [
                'me' => [
                    'poolCandidates' => [
                        ['id' => $application->id],
                    ],
                ],
            ],
        ]);

    }
}
