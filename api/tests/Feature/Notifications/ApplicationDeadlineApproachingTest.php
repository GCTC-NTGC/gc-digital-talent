<?php

namespace Tests\Feature\Notifications;

use App\Models\User;
use App\Notifications\ApplicationDeadlineApproaching;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Throwable;

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
            'poolAdvertisementLinkEn',
            'poolAdvertisementLinkFr',
            'applicationLinkEn',
            'applicationLinkFr'
        );
    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotifySingle(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $exceptionThrown = false;

        try {
            $user = User::factory()
                ->create([
                    'email' => config('notify.smokeTest.emailAddress'),
                ]);

            $user->notify($this->fixtureNotification);
        } catch (Throwable) {
            $exceptionThrown = true;
        }

        assertFalse($exceptionThrown);
    }

    public function testCanSendGcNotifyBulk(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $exceptionThrown = false;

        try {
            $users = User::factory()
                ->count(3)
                ->sequence(
                    ['email' => config('notify.smokeTest.emailAddress')],
                    ['email' => config('notify.smokeTest.emailAddress2')],
                    ['email' => config('notify.smokeTest.emailAddress3')],
                )
                ->create();

            Notification::send($users, $this->fixtureNotification);

        } catch (Throwable) {
            $exceptionThrown = true;
        }

        assertFalse($exceptionThrown);
    }

    public function testSetsGcNotifyEmailAddressCorrectly(): void
    {
        $user = User::factory()
            ->create([
                'email' => 'example@example.org',
            ]);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals('example@example.org', $message->emailAddress);
    }

    public function testLocalizesGcNotifyCorrectlyToEn(): void
    {
        $user = User::factory()
            ->create(['preferred_lang' => 'en']);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.application_deadline_approaching_en'), $message->templateId);
        assertEqualsCanonicalizing([
            'closing date' => 'December 31, 2999',
            'pool name' => 'poolNameEn',
            'pool advertisement link' => 'poolAdvertisementLinkEn',
            'application link' => 'applicationLinkEn'],
            $message->messageVariables);
    }

    public function testLocalizesGcNotifyCorrectlyToFr(): void
    {
        $user = User::factory()
            ->create(['preferred_lang' => 'fr']);

        $message = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals(config('notify.templates.application_deadline_approaching_fr'), $message->templateId);
        assertEqualsCanonicalizing([
            'closing date' => 'décembre 31, 2999',
            'pool name' => 'poolNameFr',
            'pool advertisement link' => 'poolAdvertisementLinkFr',
            'application link' => 'applicationLinkFr',
        ], $message->messageVariables);

    }
}
