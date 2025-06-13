<?php

namespace Tests\Feature\Notifications;

use App\Events\TalentNominationSubmitted;
use App\Listeners\SendTalentNominationSubmittedNotifications;
use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use App\Notifications\ApplicationStatusChanged;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\TalentNominationReceivedNominator;
use App\Notifications\TalentNominationReceivedSubmitter;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertFalse;

class TalentNominationReceivedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    private ApplicationStatusChanged $fixtureNotification;

    private static function makeGovEmployee(string $name, $locale = 'en'): User
    {
        return User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => $name.'_first_name',
                'last_name' => $name.'_last_name',
                'work_email' => $name.'@gc.ca',
                'preferred_lang' => $locale,
            ]);
    }

    private static function makeTalentEvent(string $name): TalentNominationEvent
    {
        return TalentNominationEvent::factory()
            ->create([
                'open_date' => config('constants.past_datetime'),
                'close_date' => config('constants.far_future_datetime'),
                'name' => [
                    'en' => $name.'_en',
                    'fr' => $name.'_fr'],
            ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,
        ]);

    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotifyToSubmitter(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $talentNominationEvent = TalentNominationEvent::factory()->create();

        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create(['talent_nomination_event_id' => $talentNominationEvent->id]);

        $user = User::factory()
            ->create([
                'work_email' => config('notify.smokeTest.emailAddress'),
            ]);

        $notification = new TalentNominationReceivedSubmitter($talentNomination);

        $user->notify($notification);
        $exceptionThrown = false;

        assertFalse($exceptionThrown);
    }

    // Build the notification and send it to the live GC Notify service
    public function testCanSendGcNotifyToNominator(): void
    {
        if (! config('notify.client.apiKey')) {
            $this->markTestSkipped('API key not found');
        }

        $talentNominationEvent = TalentNominationEvent::factory()->create();

        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create(['talent_nomination_event_id' => $talentNominationEvent->id]);

        $user = User::factory()
            ->create([
                'work_email' => config('notify.smokeTest.emailAddress'),
            ]);

        $notification = new TalentNominationReceivedNominator($talentNomination);

        $user->notify($notification);
        $exceptionThrown = false;

        assertFalse($exceptionThrown);
    }

    // builds GC Notify email message correctly in English, for the submitter message, with a real nominator
    public function testSetsGcNotifyEmailFieldsSubmitterEn(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => (TalentNominationReceivedTest::makeTalentEvent('test_event'))->id,
                'submitter_id' => TalentNominationReceivedTest::makeGovEmployee('submitter')->id,
                'nominator_id' => TalentNominationReceivedTest::makeGovEmployee('nominator')->id,
                'nominee_id' => TalentNominationReceivedTest::makeGovEmployee('nominee')->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        $notification = new TalentNominationReceivedSubmitter($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient', 'en'));

        assertEquals(config('notify.templates.nomination_received_submitter_en'), $message->templateId);
        assertEquals('recipient@gc.ca', $message->emailAddress);
        assertEquals([
            'recipient name' => 'recipient_first_name recipient_last_name',
            'submitter name' => 'submitter_first_name submitter_last_name',
            'nominator name' => 'nominator_first_name nominator_last_name',
            'nominee name' => 'nominee_first_name nominee_last_name',
            'event name' => 'test_event_en',
            'selected nomination options' => 'advancement, lateral movement, and development program',
        ],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly in French, for the submitter message, with a real nominator
    public function testSetsGcNotifyEmailFieldsSubmitterFr(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => (TalentNominationReceivedTest::makeTalentEvent('test_event'))->id,
                'submitter_id' => TalentNominationReceivedTest::makeGovEmployee('submitter')->id,
                'nominator_id' => TalentNominationReceivedTest::makeGovEmployee('nominator')->id,
                'nominee_id' => TalentNominationReceivedTest::makeGovEmployee('nominee')->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);
        $notification = new TalentNominationReceivedSubmitter($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient', 'fr'));

        assertEquals(config('notify.templates.nomination_received_submitter_fr'), $message->templateId);
        assertEquals('recipient@gc.ca', $message->emailAddress);
        assertEquals([
            'recipient name' => 'recipient_first_name recipient_last_name',
            'submitter name' => 'submitter_first_name submitter_last_name',
            'nominator name' => 'nominator_first_name nominator_last_name',
            'nominee name' => 'nominee_first_name nominee_last_name',
            'event name' => 'test_event_fr',
            'selected nomination options' => 'avancement, mutation latérale et programme de perfectionnement',
        ],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly, for the submitter message, with a fallback nominator
    public function testSetsGcNotifyEmailFieldsSubmitterFallbackNominator(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'nominator_id' => null,
                'nominator_fallback_name' => 'fallback_nominator',
            ]);

        $notification = new TalentNominationReceivedSubmitter($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient'));

        assertEquals($message->messageVariables['nominator name'], 'fallback_nominator');
    }

    // builds GC Notify email message correctly in English, for the nominator message, with a real nominator
    public function testSetsGcNotifyEmailFieldsNominatorEn(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => (TalentNominationReceivedTest::makeTalentEvent('test_event'))->id,
                'submitter_id' => TalentNominationReceivedTest::makeGovEmployee('submitter')->id,
                'nominator_id' => TalentNominationReceivedTest::makeGovEmployee('nominator')->id,
                'nominee_id' => TalentNominationReceivedTest::makeGovEmployee('nominee')->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        $notification = new TalentNominationReceivedNominator($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient', 'en'));

        assertEquals(config('notify.templates.nomination_received_nominator_en'), $message->templateId);
        assertEquals('recipient@gc.ca', $message->emailAddress);
        assertEquals([
            'recipient name' => 'recipient_first_name recipient_last_name',
            'submitter name' => 'submitter_first_name submitter_last_name',
            'nominator name' => 'nominator_first_name nominator_last_name',
            'nominee name' => 'nominee_first_name nominee_last_name',
            'event name' => 'test_event_en',
            'selected nomination options' => 'advancement, lateral movement, and development program',
        ],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly in French, for the nominator message, with a real nominator
    public function testSetsGcNotifyEmailFieldsNominatorFr(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => (TalentNominationReceivedTest::makeTalentEvent('test_event'))->id,
                'submitter_id' => TalentNominationReceivedTest::makeGovEmployee('submitter')->id,
                'nominator_id' => TalentNominationReceivedTest::makeGovEmployee('nominator')->id,
                'nominee_id' => TalentNominationReceivedTest::makeGovEmployee('nominee')->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);
        $notification = new TalentNominationReceivedNominator($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient', 'fr'));

        assertEquals(config('notify.templates.nomination_received_nominator_fr'), $message->templateId);
        assertEquals('recipient@gc.ca', $message->emailAddress);
        assertEquals([
            'recipient name' => 'recipient_first_name recipient_last_name',
            'submitter name' => 'submitter_first_name submitter_last_name',
            'nominator name' => 'nominator_first_name nominator_last_name',
            'nominee name' => 'nominee_first_name nominee_last_name',
            'event name' => 'test_event_fr',
            'selected nomination options' => 'avancement, mutation latérale et programme de perfectionnement',
        ],
            $message->messageVariables);
    }

    // builds GC Notify email message correctly, for the nominator message, with a fallback nominator
    public function testSetsGcNotifyEmailFieldsNominatorFallbackNominator(): void
    {
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'nominator_id' => null,
                'nominator_fallback_name' => 'fallback_nominator',
            ]);

        $notification = new TalentNominationReceivedNominator($talentNomination);
        $message = $notification->toGcNotifyEmail(TalentNominationReceivedTest::makeGovEmployee('recipient'));

        assertEquals($message->messageVariables['nominator name'], 'fallback_nominator');
    }

    // submitting a talent nomination fires the event
    public function testNominationSubmissionFiresEvent(): void
    {
        Event::fake([TalentNominationSubmitted::class]);

        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create();

        Event::assertNotDispatched(TalentNominationSubmitted::class);

        $talentNomination->submitted_at = Carbon::now();
        $talentNomination->save();

        Event::assertDispatched(TalentNominationSubmitted::class);
    }

    // listener for the event sends one notification if the submitter and nominator are the same
    public function testListenerForSubmitterAndNominatorSame(): void
    {
        if (empty(config('notify.client.apiKey'))) {
            $this->markTestSkipped('No API key set');
        }

        $submitter = TalentNominationReceivedTest::makeGovEmployee('submitter');

        Event::fake([TalentNominationSubmitted::class]);
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $submitter->id,
                'nominator_id' => $submitter->id,
            ]);

        $event = new TalentNominationSubmitted($talentNomination);
        $listener = new SendTalentNominationSubmittedNotifications();

        Notification::fake();
        $listener->handle($event);

        Notification::assertCount(1);  // should only have sent the submitter notification and not a separate nominator notification

        Notification::assertSentTo(
            $submitter,
            function (TalentNominationReceivedSubmitter $notification, array $channels) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'submitter_first_name submitter_last_name';
            }
        );
    }

    // handler for the event fires two notification if the submitter and nominator are different
    public function testListenerForSubmitterAndNominatorDifferent(): void
    {
        if (empty(config('notify.client.apiKey'))) {
            $this->markTestSkipped('No API key set');
        }

        $submitter = TalentNominationReceivedTest::makeGovEmployee('submitter');
        $nominator = TalentNominationReceivedTest::makeGovEmployee('nominator');

        Event::fake([TalentNominationSubmitted::class]);
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $submitter->id,
                'nominator_id' => $nominator->id,
            ]);

        $event = new TalentNominationSubmitted($talentNomination);
        $listener = new SendTalentNominationSubmittedNotifications();

        Notification::fake();
        $listener->handle($event);

        Notification::assertCount(2);  // should send one to the submitter and one to the nominator

        Notification::assertSentTo(
            $submitter,
            function (TalentNominationReceivedSubmitter $notification, array $channels) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'nominator_first_name nominator_last_name';
            }
        );

        Notification::assertSentTo(
            $nominator,
            function (TalentNominationReceivedNominator $notification, array $channels) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'nominator_first_name nominator_last_name';
            }
        );
    }

    // listener for the event sends one notification if the submitter and nominator are the same, fallback nominator
    public function testListenerForSubmitterAndNominatorSameWithFallbackNominator(): void
    {
        if (empty(config('notify.client.apiKey'))) {
            $this->markTestSkipped('No API key set');
        }

        $submitter = TalentNominationReceivedTest::makeGovEmployee('submitter');

        Event::fake([TalentNominationSubmitted::class]);
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $submitter->id,
                'nominator_id' => null,
                'nominator_fallback_work_email' => 'submitter@gc.ca',
                'nominator_fallback_name' => 'fallback_nominator_name',
            ]);

        $event = new TalentNominationSubmitted($talentNomination);
        $listener = new SendTalentNominationSubmittedNotifications();

        Notification::fake();
        $listener->handle($event);

        Notification::assertCount(1);  // should only have sent the submitter notification and not a separate nominator notification

        Notification::assertSentTo(
            $submitter,
            function (TalentNominationReceivedSubmitter $notification, array $channels) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'fallback_nominator_name';
            }
        );
    }

    // handler for the event fires two notification if the submitter and nominator are different
    public function testListenerForSubmitterAndNominatorDifferentWithFallbackNominator(): void
    {
        if (empty(config('notify.client.apiKey'))) {
            $this->markTestSkipped('No API key set');
        }

        $submitter = TalentNominationReceivedTest::makeGovEmployee('submitter');

        Event::fake([TalentNominationSubmitted::class]);
        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedReviewAndSubmit()
            ->create([
                'submitter_id' => $submitter->id,
                'nominator_id' => null,
                'nominator_fallback_work_email' => 'fallback_nominator@gc.ca',
                'nominator_fallback_name' => 'fallback_nominator_name',
            ]);

        $event = new TalentNominationSubmitted($talentNomination);
        $listener = new SendTalentNominationSubmittedNotifications();

        Notification::fake();
        $listener->handle($event);

        Notification::assertCount(2);  // should send one to the submitter and one to the nominator

        Notification::assertSentTo(
            $submitter,
            function (TalentNominationReceivedSubmitter $notification, array $channels) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'fallback_nominator_name';
            }
        );

        Notification::assertSentOnDemand(
            TalentNominationReceivedNominator::class,
            function (TalentNominationReceivedNominator $notification, array $channels, object $notifiable) {
                return
                    count($channels) == 1 &&
                    $channels[0] == GcNotifyEmailChannel::class &&
                    $notification->submitterName == 'submitter_first_name submitter_last_name' &&
                    $notification->nominatorName == 'fallback_nominator_name' &&
                    $notification->nominatorWorkEmail == 'fallback_nominator@gc.ca';
            }

        );
    }
}
