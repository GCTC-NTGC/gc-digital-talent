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
            'opportunityTitleEn',
            'opportunityTitleFr',
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

        $email = $this->fixtureNotification->toGcNotifyEmail($user);

        assertEquals($email['email_address'], 'example@example.org');
    }

    public function testLocalizesGcNotifyCorrectlyToEn(): void
    {
        $userEn = User::factory()
            ->create(['preferred_lang' => 'en']);

        $email = $this->fixtureNotification->toGcNotifyEmail($userEn);

        assertEquals($email['template_id'], config('notify.templates.application_deadline_approaching_en'));
        assertEquals($email['message_variables']['closing date'], 'December 31, 2999');
        assertEquals($email['message_variables']['opportunity title'], 'opportunityTitleEn');
        assertEquals($email['message_variables']['pool advertisement link'], 'poolAdvertisementLinkEn');
        assertEquals($email['message_variables']['application link'], 'applicationLinkEn');
    }

    public function testLocalizesGcNotifyCorrectlyToFr(): void
    {
        $userEn = User::factory()
            ->create(['preferred_lang' => 'fr']);

        $email = $this->fixtureNotification->toGcNotifyEmail($userEn);

        assertEquals($email['template_id'], config('notify.templates.application_deadline_approaching_fr'));
        assertEquals($email['message_variables']['closing date'], 'décembre 31, 2999');
        assertEquals($email['message_variables']['opportunity title'], 'opportunityTitleFr');
        assertEquals($email['message_variables']['pool advertisement link'], 'poolAdvertisementLinkFr');
        assertEquals($email['message_variables']['application link'], 'applicationLinkFr');
    }
}
