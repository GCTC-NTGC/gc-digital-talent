<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\ApplicationStatusChanged;
use App\Notifications\GcNotifyEmailChannel;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;
use function PHPUnit\Framework\assertFalse;

class ApplicationStatusChangedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private ApplicationStatusChanged $fixtureNotification;

    private $allNotificationFamilies;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->allNotificationFamilies = array_column(NotificationFamily::cases(), 'name');
        $this->fixtureNotification = new ApplicationStatusChanged(
            'poolNameEn',
            'poolNameFr',
        );
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesNone(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => $this->allNotificationFamilies,
                'enabled_in_app_notifications' => $this->allNotificationFamilies,
            ]);
        assertEqualsCanonicalizing([GcNotifyEmailChannel::class, 'database'], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesBoth(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);
        assertEquals([], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustEmail(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => $this->allNotificationFamilies,
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
            ]);
        assertEquals([GcNotifyEmailChannel::class], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustInApp(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => $this->allNotificationFamilies,
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
                'enabled_email_notifications' => $this->allNotificationFamilies,
                'enabled_in_app_notifications' => [NotificationFamily::JOB_ALERT->name],
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

        assertEquals(config('notify.templates.application_status_changed_en'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEquals([
            'applicant name' => 'firstname',
            'opportunity title' => 'poolNameEn'],
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

        assertEquals(config('notify.templates.application_status_changed_fr'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEquals([
            'applicant name' => 'firstname',
            'opportunity title' => 'poolNameFr'],
            $message->messageVariables);
    }

    // builds database message for in-app notification correctly
    public function testSavesDatabaseFieldsCorrectly(): void
    {
        $user = User::factory()
            ->create([
                'enabled_email_notifications' => [NotificationFamily::JOB_ALERT->name],
                'enabled_in_app_notifications' => $this->allNotificationFamilies,
            ]);

        $user->notify($this->fixtureNotification);

        $notification = Notification::all()->sole();
        assertEquals([
            'poolName' => [
                'en' => 'poolNameEn',
                'fr' => 'poolNameFr',
            ],
        ], $notification->data
        );
    }
}
