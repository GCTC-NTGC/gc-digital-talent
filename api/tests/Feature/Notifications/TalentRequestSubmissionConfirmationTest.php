<?php

namespace Tests\Feature\Notifications;

use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentRequestSubmissionConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertFalse;

class TalentRequestSubmissionConfirmationTest extends TestCase
{
    use RefreshDatabase;

    private TalentRequestSubmissionConfirmation $fixtureNotification;

    protected function setUp(): void
    {
        parent::setUp();

        $this->fixtureNotification = new TalentRequestSubmissionConfirmation('1');
    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotify(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        Notification::route(GcNotifyEmailChannel::class, [
            'requestor name' => 'full name',
            'email address' => config('notify.smokeTest.emailAddress'),
        ])->notify($this->fixtureNotification);
        $exceptionThrown = false;

        assertFalse($exceptionThrown);
    }

    // builds GC Notify email message correctly
    public function testSetsGcNotifyEmailFieldsCorrectly(): void
    {
        $notifiable = new AnonymousNotifiable();
        $notifiable->route(
            GcNotifyEmailChannel::class,
            [
                'requestor name' => 'full name',
                'email address' => 'example@example.org',
            ]
        );
        $message = $this->fixtureNotification->toGcNotifyEmail($notifiable);

        assertEquals(config('notify.templates.talent_request_submission_confirmation_enfr'), $message->templateId);
        assertEquals('example@example.org', $message->emailAddress);
        assertEquals([
            'tracking number' => '1',
            'requestor name' => 'full name',
        ], $message->messageVariables);
    }
}
