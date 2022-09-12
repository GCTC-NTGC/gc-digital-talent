<?php

namespace Tests\Feature;

use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Illuminate\Foundation\Testing\WithFaker;

use function PHPUnit\Framework\assertEquals;

class SnapshotTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;
    use WithFaker;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCreateSnapshot()
    {
        $snapshotQuery = $query = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        // set up a user with a pool candidate
        $userId = $this->faker->Uuid();
        $poolCandidateId = $this->faker->Uuid();
        $user = User::factory()->create([
            "id" => $userId
        ]);
        PoolCandidate::factory()->create([
            "id" => $poolCandidateId,
            "user_id" => $userId
        ]);

        // get what the snapshot should look like
        $expectedSnapshot = $this->graphQL($snapshotQuery, ["userId" => $userId])->json("data.user");

        // Submit application
        $this->graphQL('
            mutation submitApplication(userId: ID!, signature: String!) {
                submitApplication(id: $userId, signature: $signature) {
                    id
                }
            }
        ', [
            "userId" => $userId,
            "signature" => $user->first_name . " " . $user->last_name
        ]);

        // get the just-created snapshot
        $actualSnapshot = $this->graphQL(
            /** @lang Graphql */
            '
            query getSnapshot($poolCandidateId:ID!) {
                poolCandidate(id: $poolCandidateId) {
                  profileSnapshot
                }
              }
            ',
            ["poolCandidateId" => $poolCandidateId]
        )->json("data.poolCandidate");

        assertEquals($expectedSnapshot, $actualSnapshot);
    }
}
