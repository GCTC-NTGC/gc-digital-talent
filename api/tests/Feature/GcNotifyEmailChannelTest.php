<?php

namespace Tests\Feature;

use App\Enums\EmailType;
use App\Jobs\GcNotifyApiRequest;
use App\Models\User;
use App\Notifications\AdHocEmail;
use App\Notifications\VerifyEmails;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class GcNotifyEmailChannelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        config([
            'notify.client.apiKey' => 'test-key',
            'notify.templates.verify_email_en' => 'template-id-en',
            'notify.templates.verify_email_fr' => 'template-id-fr',
        ]);

        Queue::fake();
    }

    public function testLowPriorityNotificationIsQueuedOnTheLowQueue(): void
    {
        $user = User::factory()->create();

        $user->notify(new AdHocEmail('template-id-en', 'template-id-fr'));

        Queue::assertPushedOn('default-low', GcNotifyApiRequest::class);
    }

    public function testOtherNotificationIsQueuedOnTheMainQueue(): void
    {
        $user = User::factory()->create();

        $user->notify(new VerifyEmails($user->email, [EmailType::CONTACT]));

        Queue::assertPushedOn('default', GcNotifyApiRequest::class);
    }
}
