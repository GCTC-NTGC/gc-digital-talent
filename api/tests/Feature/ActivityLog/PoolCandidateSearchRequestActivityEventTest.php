<?php

namespace Tests\Feature\ActivityLog;

use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use App\Models\Activity;
use App\Models\Community;
use App\Models\PoolCandidateSearchRequest;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PoolCandidateSearchRequestActivityEventTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DepartmentSeeder::class);

        $community = Community::factory()->create();

    }

    public function testProgressLogsStatusChange(): void
    {
        $request = PoolCandidateSearchRequest::factory()->create([
            'user_id' => null,
            'status' => TalentRequestStatus::NEW->name,
        ]);

        $request->progress(TalentRequestInProgressDetail::INITIAL_CONVERSATION->name, null);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidateSearchRequest::class,
            'description' => 'updated',
            'subject_id' => $request->getKey(),
        ]);

        $activity = Activity::where('subject_type', PoolCandidateSearchRequest::class)
            ->where('subject_id', $request->getKey())
            ->where('description', 'updated')
            ->latest()
            ->first();

        $this->assertEquals(TalentRequestStatus::NEW->name, $activity->properties['old']['status']);
        $this->assertEquals(TalentRequestStatus::IN_PROGRESS->name, $activity->properties['attributes']['status']);
    }

    public function testCloseLogsStatusChange(): void
    {
        $request = PoolCandidateSearchRequest::factory()->create([
            'user_id' => null,
            'status' => TalentRequestStatus::IN_PROGRESS->name,
            'in_progress_details' => TalentRequestInProgressDetail::TALENT_SENT->name,
        ]);

        $request->complete(TalentRequestCompletionDetail::HIRE_MADE->name);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidateSearchRequest::class,
            'description' => 'updated',
            'subject_id' => $request->getKey(),
        ]);

        $activity = Activity::where('subject_type', PoolCandidateSearchRequest::class)
            ->where('subject_id', $request->getKey())
            ->where('description', 'updated')
            ->latest()
            ->first();

        $this->assertEquals(TalentRequestStatus::IN_PROGRESS->name, $activity->properties['old']['status']);
        $this->assertEquals(TalentRequestStatus::COMPLETED->name, $activity->properties['attributes']['status']);
    }
}
