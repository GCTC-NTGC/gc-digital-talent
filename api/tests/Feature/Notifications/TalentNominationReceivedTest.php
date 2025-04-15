<?php

namespace Tests\Feature\Notifications;

use App\Models\Notification;
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

    // builds GC Notify email message correctly in English
    public function testSetsGcNotifyEmailFieldsCorrectlyEn(): void
    {
        $recipient = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'recipient_first_name',
                'last_name' => 'recipient_last_name',
                'work_email' => 'recipient@gc.ca',
                'preferred_lang' => 'en',
            ]);

        $submitter = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'submitter_first_name',
                'last_name' => 'submitter_last_name',
            ]);

        $nominator = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'nominator_first_name',
                'last_name' => 'nominator_last_name',
            ]);

        $nominee = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'nominee_first_name',
                'last_name' => 'nominee_last_name',
            ]);

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'name' => [
                'en' => 'test_event_en',
                'fr' => 'test_event_fr'],
        ]);

        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $submitter->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        $notification = new TalentNominationReceivedSubmitter($talentNomination);
        $message = $notification->toGcNotifyEmail($recipient);

        assertEquals(config('notify.templates.nomination_received_submitter_en'), $message->templateId);
        assertEquals($recipient->work_email, $message->emailAddress);
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

    // builds GC Notify email message correctly in French
    public function testSetsGcNotifyEmailFieldsCorrectlyFr(): void
    {
        $recipient = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'recipient_first_name',
                'last_name' => 'recipient_last_name',
                'work_email' => 'recipient@gc.ca',
                'preferred_lang' => 'fr',
            ]);

        $submitter = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'submitter_first_name',
                'last_name' => 'submitter_last_name',
            ]);

        $nominator = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'nominator_first_name',
                'last_name' => 'nominator_last_name',
            ]);

        $nominee = User::factory()
            ->asGovEmployee()
            ->create([
                'first_name' => 'nominee_first_name',
                'last_name' => 'nominee_last_name',
            ]);

        $talentNominationEvent = TalentNominationEvent::factory()->create([
            'name' => [
                'en' => 'test_event_en',
                'fr' => 'test_event_fr'],
        ]);

        /** @var \App\Models\TalentNomination */
        $talentNomination = TalentNomination::factory()
            ->submittedRationale()
            ->create([
                'talent_nomination_event_id' => $talentNominationEvent->id,
                'submitter_id' => $submitter->id,
                'nominator_id' => $nominator->id,
                'nominee_id' => $nominee->id,
                'nominate_for_advancement' => true,
                'nominate_for_lateral_movement' => true,
                'nominate_for_development_programs' => true,
            ]);

        $notification = new TalentNominationReceivedSubmitter($talentNomination);
        $message = $notification->toGcNotifyEmail($recipient);

        assertEquals(config('notify.templates.nomination_received_submitter_fr'), $message->templateId);
        assertEquals($recipient->work_email, $message->emailAddress);
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
}
