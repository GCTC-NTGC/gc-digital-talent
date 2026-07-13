<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\AdHocEmail;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Console\Command;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendNotificationsAdHocEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();
        $this->seed(RolePermissionSeeder::class);
    }

    // will not send a notification to a user with no email address when notifying all users
    public function testDoesNotNotifyUserWithNullEmail(): void
    {
        $userWithEmail = User::factory()->create(['email' => 'has-email@example.org']);
        $userWithoutEmail = User::factory()->create(['email' => null]);

        $this->artisan('send-notifications:ad-hoc-email', [
            'templateIdEn' => 'template-en',
            'templateIdFr' => 'template-fr',
            '--notifyAllUsers' => true,
        ])
            ->expectsConfirmation('Do you wish to send notifications to 1 users?', 'yes')
            ->assertExitCode(Command::SUCCESS)
            ->run();

        Notification::assertSentTo([$userWithEmail], AdHocEmail::class);
        Notification::assertNotSentTo([$userWithoutEmail], AdHocEmail::class);
    }

    // will not send a notification to a user with no email address when filtering by notification family
    public function testDoesNotNotifyUserWithNullEmailByNotificationFamily(): void
    {
        $userWithEmail = User::factory()->create([
            'email' => 'has-email@example.org',
            'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
        ]);
        $userWithoutEmail = User::factory()->create([
            'email' => null,
            'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
        ]);

        $this->artisan('send-notifications:ad-hoc-email', [
            'templateIdEn' => 'template-en',
            'templateIdFr' => 'template-fr',
            '--notificationFamily' => [NotificationFamily::JOB_ALERT->name],
        ])
            ->expectsConfirmation('Do you wish to send notifications to 1 users?', 'yes')
            ->assertExitCode(Command::SUCCESS)
            ->run();

        Notification::assertSentTo([$userWithEmail], AdHocEmail::class);
        Notification::assertNotSentTo([$userWithoutEmail], AdHocEmail::class);
    }
}
