<?php

namespace Tests\Feature\Notifications;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Notifications\ApplicationDeadlineApproaching;
use App\Notifications\ApplicationStatusChanged;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class TriggerApplicationStatusChangedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private ApplicationDeadlineApproaching $fixtureNotification;

    protected function setUp(): void
    {
        parent::setUp();

        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);

    }

    // no notification when an application is created or submitted
    public function testNothingSentForNewApplications(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::DRAFT->name]);

        $application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $application->save();

        Notification::assertNothingSent();
    }

    // no notification when an application is moved between non-final and non-removed statuses
    public function testNothingSentForUnrelatedStatusChanges(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::DRAFT->name]);

        $application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $application->save();
        $application->pool_candidate_status = PoolCandidateStatus::UNDER_ASSESSMENT->name;
        $application->save();
        $application->pool_candidate_status = PoolCandidateStatus::APPLICATION_REVIEW->name;
        $application->save();
        $application->pool_candidate_status = PoolCandidateStatus::SCREENED_IN->name;
        $application->save();

        Notification::assertNothingSent();

    }

    // triggers a notification when an application is moved into a final decision status
    public function testNotifyWhenFinalDecision(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name]);

        $application->pool_candidate_status = PoolCandidateStatus::QUALIFIED_AVAILABLE->name;
        $application->save();

        Notification::assertSentTo(
            [$user], ApplicationStatusChanged::class
        );

    }

    // triggers a notification when an application is moved out of a final decision status
    public function testNotifyWhenRevertFinalDecision(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::QUALIFIED_AVAILABLE->name]);

        $application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $application->save();

        Notification::assertSentTo(
            [$user], ApplicationStatusChanged::class
        );

    }

    // triggers a notification when an application is moved into a removed decision status
    public function testNotifyWhenRemovedDecision(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::NEW_APPLICATION->name]);

        $application->pool_candidate_status = PoolCandidateStatus::REMOVED->name;
        $application->save();

        Notification::assertSentTo(
            [$user], ApplicationStatusChanged::class
        );

    }

    // triggers a notification when an application is moved out of a removed decision status
    public function testNotifyWhenRevertRemovedDecision(): void
    {
        $user = User::factory()->create();
        $application = PoolCandidate::factory()
            ->for($user)
            ->create(['pool_candidate_status' => PoolCandidateStatus::REMOVED->name]);

        $application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $application->save();

        Notification::assertSentTo(
            [$user], ApplicationStatusChanged::class
        );

    }
}
