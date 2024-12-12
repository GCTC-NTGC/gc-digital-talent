<?php

namespace Tests\Feature;

use App\Enums\PoolCandidateStatus;
use App\Jobs\GenerateUserFile;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class CandidateCsvGenerationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([RolePermissionSeeder::class]);

    }

    public function testCandidateCsvGenerated()
    {

        Queue::fake();

        $team = Team::factory()->create([
            'name' => 'candidate-csv-team',
        ]);

        $pool = Pool::factory()->published()->create([
            'team_id' => $team->id,
        ]);

        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asProcessOperator('candidate-csv-team')
            ->asRequestResponder()
            ->asAdmin()
            ->create();

        $this->actingAs($adminUser, 'api')
            ->graphQL(/** GraphQL */ '
                mutation DownloadPoolCandidatesCsv($ids: [UUID!]!) {
                    downloadPoolCandidatesCsv(ids: $ids)
                }
            ', ['ids' => [$candidate->id]]);

        Queue::assertPushed(GenerateUserFile::class);
    }

    public function testCandidateCsvGeneratedWithROD()
    {

        Queue::fake();

        $team = Team::factory()->create([
            'name' => 'candidate-csv-team',
        ]);

        $pool = Pool::factory()->published()->create([
            'team_id' => $team->id,
        ]);

        $candidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
            'pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name,
        ]);

        $adminUser = User::factory()
            ->asApplicant()
            ->asProcessOperator('candidate-csv-team')
            ->asRequestResponder()
            ->asAdmin()
            ->create();

        $this->actingAs($adminUser, 'api')
            ->graphQL(/** GraphQL */ '
                mutation DownloadPoolCandidatesCsv($ids: [UUID!]!, $withROD: Boolean) {
                    downloadPoolCandidatesCsv(ids: $ids, withROD: $withROD)
                }
            ', ['ids' => [$candidate->id], 'withROD' => true]);

        Queue::assertPushed(GenerateUserFile::class);
    }
}
