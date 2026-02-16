<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ScreeningStage;
use App\Jobs\GenerateUserFile;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class CandidateExcelGenerationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected $community;

    protected $pool;

    protected $adminUser;

    protected $candidate;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([RolePermissionSeeder::class]);

        $this->community = Community::factory()->create();

        $this->pool = Pool::factory()
            ->published()
            ->create([
                'community_id' => $this->community->id,
            ]);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($this->community->id)
            ->asAdmin()
            ->create();

        $this->candidate = PoolCandidate::factory()->create([
            'pool_id' => $this->pool->id,
            'application_status' => ApplicationStatus::TO_ASSESS->name,
            'screening_stage' => ScreeningStage::NEW_APPLICATION->name,
        ]);

    }

    public function testCandidateExcelGenerated()
    {
        Queue::fake();

        $this->actingAs($this->adminUser, 'api')
            ->graphQL(/** GraphQL */ '
                mutation DownloadPoolCandidatesExcel($ids: [UUID!]!) {
                    downloadPoolCandidatesExcel(ids: $ids)
                }
            ', ['ids' => [$this->candidate->id]]);

        Queue::assertPushed(GenerateUserFile::class);
    }

    public function testCandidateExcelGeneratedWithROD()
    {
        Queue::fake();

        $this->actingAs($this->adminUser, 'api')
            ->graphQL(/** GraphQL */ '
                mutation DownloadPoolCandidatesExcel($ids: [UUID!]!, $withROD: Boolean) {
                    downloadPoolCandidatesExcel(ids: $ids, withROD: $withROD)
                }
            ', ['ids' => [$this->candidate->id], 'withROD' => true]);

        Queue::assertPushed(GenerateUserFile::class);
    }
}
