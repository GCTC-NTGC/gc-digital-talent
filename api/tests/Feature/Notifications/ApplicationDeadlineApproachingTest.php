<?php

namespace Tests\Feature\Notifications;

use App\Models\Notification;
use App\Models\User;
use App\Notifications\ApplicationDeadlineApproaching;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
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
            '1',
            '2',
        );
    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotify(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $exceptionThrown = false;

        try {
            $user = User::factory()
                ->create([
                    'email' => config('notify.smokeTest.emailAddress'),
                    // TODO: set email preference
                ]);

            $user->notify($this->fixtureNotification);
        } catch (Throwable) {
            $exceptionThrown = true;
        }

        assertFalse($exceptionThrown);
    }

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

    public function testSavesDatabaseFieldsCorrectly(): void
    {
        $user = User::factory()
            ->create([
                'email' => 'example@example.org',
                'preferred_lang' => 'en',
                // TODO: set notification preference
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
