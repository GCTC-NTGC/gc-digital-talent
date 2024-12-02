<?php

namespace Tests\Feature\Notifications;

use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\System;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendInAppNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);

    }

    public function testFailsIfNoChannelOptionSet(): void
    {
        $this->artisan('send-notifications:system notification_test')
            ->assertExitCode(1);
    }

    public function testSendsOnlyToAppChannel(): void
    {
        $user = User::factory()->create();

        $this->artisan('send-notifications:system notification_test --channelApp')
            ->expectsQuestion('This will send the notification to every user via in-app. Do you wish to continue?', 'yes')
            ->assertExitCode(0);

        Notification::assertSentTo(
            [$user], System::class, function ($notification, $channels) {
                return in_array('database', $channels) && ! in_array(GcNotifyEmailChannel::class, $channels);
            }
        );
    }
}
