<?php

namespace Tests\Feature\ActivityLog;

use App\Enums\ActivityEvent;
use App\Enums\ApplicationStatus;
use App\Enums\CandidateRemovalReason;
use App\Enums\DisqualificationReason;
use App\Enums\PlacementType;
use App\Enums\ScreeningStage;
use App\Models\Activity;
use App\Models\Department;
use App\Models\PoolCandidate;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PoolCandidateActivityEventTest extends TestCase
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
            'description' => ActivityEvent::SUBMITTED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', ActivityEvent::SUBMITTED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEqualsCanonicalizing([
            'signature' => 'test-submitted',
            'user_name' => $this->application->user->fullName,
            'pool_id' => $this->application->pool->id,
        ], $properties['attributes']);
    }

    public function testQualifiedEvent()
    {
        $date = Carbon::now()->addYear();
        $this->application->qualify($date);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => ActivityEvent::QUALIFIED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', ActivityEvent::QUALIFIED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEqualsCanonicalizing([
            'expiry_date' => $date->format('Y-m-d H:i:s'),
            'user_name' => $this->application->user->fullName,
            'pool_id' => $this->application->pool->id,
        ], $properties['attributes']);
    }

    public function testDisqualifiedEvent()
    {
        $this->application->disqualify(DisqualificationReason::SCREENED_OUT_APPLICATION->name);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => ActivityEvent::DISQUALIFIED->value,
            'subject_id' => $this->application->getKey(),
        ]);
    }

    public function testPlacedEvent()
    {
        $type = PlacementType::PLACED_CASUAL->name;
        $department = Department::factory()->create();

        $this->application->place($type, $department->id);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => ActivityEvent::PLACED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', ActivityEvent::PLACED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEqualsCanonicalizing([
            'placement_type' => $type,
            'placed_department_id' => $department->id,
            'user_name' => $this->application->user->fullName,
            'pool_id' => $this->application->pool->id,
        ], $properties['attributes']);
    }

    public function testRemovedEvent()
    {
        $reason = CandidateRemovalReason::OTHER->name;
        $other = 'Some reason';

        $this->application->application_status = ApplicationStatus::TO_ASSESS->name;
        $this->application->screening_stage = ScreeningStage::NEW_APPLICATION->name;
        $this->application->placement_type = null;
        $this->application->saveQuietly();

        $this->application->remove($reason, $other);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => ActivityEvent::REMOVED->value,
            'subject_id' => $this->application->getKey(),
        ]);

        $activity = Activity::where('event', ActivityEvent::REMOVED->value)->latest()->first();

        $properties = $activity->properties;

        $this->assertEqualsCanonicalizing([
            'removal_reason' => $reason,
            'removal_reason_other' => $other,
            'user_name' => $this->application->user->fullName,
            'pool_id' => $this->application->pool->id,
        ], $properties['attributes']);
    }

    public function testReinstateEvent()
    {
        $this->application->application_status = ApplicationStatus::REMOVED->name;
        $this->application->saveQuietly();

        $this->application->reinstate();

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => PoolCandidate::class,
            'description' => ActivityEvent::REINSTATED->value,
            'subject_id' => $this->application->getKey(),
        ]);
    }
}
