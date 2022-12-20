<?php

namespace Tests\Feature;

use App\Events\ApplicationSubmitted;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Helpers\ApiEnums;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Illuminate\Foundation\Testing\WithFaker;

use function PHPUnit\Framework\assertEquals;

class SnapshotTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCreateSnapshot()
    {
        $snapshotQuery = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        $user = User::factory()->create();

        $poolCandidate = PoolCandidate::factory()->create([
            "user_id" => $user->id,
            "pool_candidate_status" => ApiEnums::CANDIDATE_STATUS_DRAFT
        ]);

        // get what the snapshot should look like
        $expectedSnapshot = $this->graphQL($snapshotQuery, ["userId" => $user->id])->json("data.user");

        ApplicationSubmitted::dispatch($poolCandidate);

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
            ["poolCandidateId" => $poolCandidate->id]
        )->json("data.poolCandidate.profileSnapshot");

        $decodedActual = json_decode($actualSnapshot, true);

        assertEquals($expectedSnapshot, $decodedActual);
    }
}
