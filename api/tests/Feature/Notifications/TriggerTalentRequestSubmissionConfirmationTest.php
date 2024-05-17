<?php

namespace Tests\Feature\Notifications;

use App\Models\Department;
use App\Models\PoolCandidateSearchRequest;
use App\Notifications\TalentRequestSubmissionConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class TriggerTalentRequestSubmissionConfirmationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
    }

    // triggers a notification when a search request is created
    public function testNotifyWhenRequest(): void
    {
        Department::factory()->create();
        PoolCandidateSearchRequest::factory()->create();

        Notification::assertSentOnDemand(TalentRequestSubmissionConfirmation::class);
    }
}
