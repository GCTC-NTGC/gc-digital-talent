<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Enums\PublishingGroup;
use App\Models\Notification;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\NewJobPosted;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertFalse;

class NewJobPostedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private NewJobPosted $fixtureNotification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->fixtureNotification = new NewJobPosted(
            'poolNameEn',
            'poolNameFr',
            '1',
        );
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesNone(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);
        assertEquals([GcNotifyEmailChannel::class, 'database'], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesBoth(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);
        assertEquals([], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustEmail(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);
        assertEquals([GcNotifyEmailChannel::class], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustInApp(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);
        assertEquals(['database'], $this->fixtureNotification->via($user));
    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotify(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $user = User::factory()
            ->create([
                'email' => config('notify.smokeTest.emailAddress'),
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);

        $user->notify($this->fixtureNotification);
        $exceptionThrown = false;

        assertFalse($exceptionThrown);
    }

    // builds GC Notify email message correctly in English
    public function testSetsGcNotifyEmailFieldsCorrectlyEn(): void
    {
        $user = User::factory()
            ->create([
                'first_name' => 'firstname',
                'email' => 'example@example.org',
                'preferred_lang' => 'en',
            ]);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.new_job_posted_en'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEquals([
            'applicant name' => 'firstname',
            'opportunity title' => 'poolNameEn',
            'job advertisement link' => config('app.url').'/en/jobs/1',
        ],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly in French
    public function testSetsGcNotifyEmailFieldsCorrectlyFr(): void
    {
        $user = User::factory()
            ->create([
                'first_name' => 'firstname',
                'email' => 'example@example.org',
                'preferred_lang' => 'fr',
            ]);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.new_job_posted_fr'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEquals([
            'applicant name' => 'firstname',
            'opportunity title' => 'poolNameFr',
            'job advertisement link' => config('app.url').'/fr/jobs/1',
        ],
            $message->messageVariables);
    }

    // builds database message for in-app notification correctly
    public function testSavesDatabaseFieldsCorrectly(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);

        $user->notify($this->fixtureNotification);

        $notification = Notification::all()->sole();
        assertEquals([
            'poolId' => '1',
        ], $notification->data
        );
    }

    // does not send when publishing group is 'other'
    public function testDoesNotSendForOtherPublishingGroup(): void
    {
        User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);

        $pool = Pool::factory()->draft()->create([
            'publishing_group' => PublishingGroup::OTHER->name,
        ]);
        $pool->update(['published_at' => now()]);

        $notification = Notification::all()->first();
        $this->assertNull($notification);
    }
}
