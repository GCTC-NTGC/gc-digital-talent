<?php

namespace Tests\Feature\Notifications;

use App\Models\TalentNomination;
use App\Models\TalentNominationEvent;
use App\Models\User;
use App\Notifications\ApplicationStatusChanged;
use App\Notifications\TalentNominationReceivedNominator;
use App\Notifications\TalentNominationReceivedSubmitter;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            ->create(['name' => [
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

    public function testCombineNotificationOptions(): void
    {
        $this->markTestSkipped('todo');
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
            'selected nomination options' => 'advancement, lateral movement, and development programs',
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
            'selected nomination options' => 'advancement, lateral movement et development programs',
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
            'selected nomination options' => 'advancement, lateral movement, and development programs',
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
            'selected nomination options' => 'advancement, lateral movement et development programs',
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
}
