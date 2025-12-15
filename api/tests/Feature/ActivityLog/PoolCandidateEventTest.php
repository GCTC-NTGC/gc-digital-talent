<?php

namespace Tests\Feature\ActivityLog;

use App\Enums\CandidateRemovalReason;
use App\Enums\PoolCandidateEvent;
use App\Enums\PoolCandidateStatus;
use App\Models\Activity;
use App\Models\Department;
use App\Models\PoolCandidate;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PoolCandidateEventTest extends TestCase
{
    use RefreshDatabase;

    protected PoolCandidate $application;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->application = PoolCandidate::factory()
            ->create();
    }

    public function testSubmittedEvent()
    {
        $this->application->submit('test-submitted');

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::SUBMITTED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', PoolCandidateEvent::SUBMITTED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEquals(['signature' => 'test-submitted'], $properties['attributes']);
    }

    public function testQualifiedEvent()
    {
        $date = Carbon::now()->addYear();
        $this->application->qualify($date);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::QUALIFIED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', PoolCandidateEvent::QUALIFIED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEquals(['expiry_date' => $date->format('Y-m-d H:i:s')], $properties['attributes']);
    }

    public function testDisqualifiedEvent()
    {
        $this->application->disqualify(PoolCandidateStatus::SCREENED_OUT_APPLICATION->name);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::DISQUALIFIED->value,
            'subject_id' => $this->application->getKey(),
        ]);
    }

    public function testPlacedEvent()
    {
        $type = PoolCandidateStatus::PLACED_CASUAL->name;
        $department = Department::factory()->create();

        $this->application->place($type, $department->id);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::PLACED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', PoolCandidateEvent::PLACED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEquals([
            'placement_type' => $type,
            'placed_department_id' => $department->id,
        ], $properties['attributes']);
    }

    public function testRemovedEvent()
    {
        $reason = CandidateRemovalReason::OTHER->name;
        $other = 'Some reason';

        $this->application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->application->saveQuietly();

        $this->application->remove($reason, $other);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::REMOVED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', PoolCandidateEvent::REMOVED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEquals([
            'removal_reason' => $reason,
            'removal_reason_other' => $other,
        ], $properties['attributes']);
    }

    public function testReinstateEvent()
    {
        $this->application->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
        $this->application->saveQuietly();

        $this->application->reinstate();

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => PoolCandidateEvent::REINSTATED->value,
            'subject_id' => $this->application->getKey(),
        ]);
    }
}
