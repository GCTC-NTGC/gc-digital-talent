<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\ApplicationDeadlineApproaching;
use App\Notifications\GcNotifyEmailChannel;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;
use function PHPUnit\Framework\assertFalse;

class ApplicationDeadlineApproachingTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private ApplicationDeadlineApproaching $fixtureNotification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->fixtureNotification = new ApplicationDeadlineApproaching(
            Carbon::parse('2999-12-31'),
            'poolNameEn',
            'poolNameFr',
            '1',
            '2',
        );
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesNone(): void
    {
        $user = User::factory()
            ->create([
                'ignored_email_notifications' => [],
                'ignored_in_app_notifications' => [],
            ]);
        assertEqualsCanonicalizing([GcNotifyEmailChannel::class, 'database'], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesBoth(): void
    {
        $user = User::factory()
            ->create([
                'ignored_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'ignored_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);
        assertEquals([], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustEmail(): void
    {
        $user = User::factory()
            ->create([
                'ignored_email_notifications' => [],
                'ignored_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);
        assertEquals([GcNotifyEmailChannel::class], $this->fixtureNotification->via($user));
    }

    // respects each user's notification preferences
    public function testRespectsNotificationPreferencesJustInApp(): void
    {
        $user = User::factory()
            ->create([
                'ignored_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'ignored_in_app_notifications' => [],
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
                'ignored_email_notifications' => [],
                'ignored_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
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
                'email' => 'example@example.org',
                'preferred_lang' => 'en',
            ]);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.application_deadline_approaching_en'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEqualsCanonicalizing([
            'closing date' => 'December 31, 2999',
            'pool name' => 'poolNameEn',
            'pool advertisement link' => config('app.url').'/en/browse/pools/1',
            'application link' => config('app.url').'/en/applications/2'],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly in French
    public function testSetsGcNotifyEmailFieldsCorrectlyFr(): void
    {
        $user = User::factory()
            ->create([
                'email' => 'example@example.org',
                'preferred_lang' => 'fr',
            ]);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.application_deadline_approaching_fr'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEqualsCanonicalizing([
            'closing date' => 'décembre 31, 2999',
            'pool name' => 'poolNameFr',
            'pool advertisement link' => config('app.url').'/fr/browse/pools/1',
            'application link' => config('app.url').'/fr/applications/2'],
            $message->messageVariables);
    }

    // builds database message for in-app notification correctly
    public function testSavesDatabaseFieldsCorrectly(): void
    {
        $user = User::factory()
            ->create([
                'email' => 'example@example.org',
                'preferred_lang' => 'en',
                'ignored_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'ignored_in_app_notifications' => [],
            ]);

        $user->notify($this->fixtureNotification);

        $notification = Notification::all()->sole();
        assertEqualsCanonicalizing([
            'closingDate' => '2999-12-31',
            'poolName' => [
                'en' => 'poolNameEn',
                'fr' => 'poolNameFr',
            ],
            'poolId' => '1',
            'poolCandidateId' => '2',
        ], $notification->data
        );
    }
}
