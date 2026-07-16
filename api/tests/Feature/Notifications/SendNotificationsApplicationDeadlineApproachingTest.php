<?php

namespace Tests\Feature\Notifications;

use App\Enums\ApplicationStatus;
use App\Enums\NotificationFamily;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Notifications\ApplicationDeadlineApproaching;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Console\Command;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;

class SendNotificationsApplicationDeadlineApproachingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);

    }

    // will run successfully if there's nothing to do
    public function testCanRunWithNoPools(): void
    {
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertNothingSent();
    }

    // will send a notification to a user if they have a draft application a pool closing in three days
    public function testSendsNotificationThreeDaysBefore(): void
    {
        // computed via Carbon (rather than hardcoded UTC literals) so the test
        // doesn't depend on America/Vancouver's UTC offset at this future date
        $nowInPacific = Carbon::create(2027, 12, 28, 12, 0, 0, 'America/Vancouver'); // three days before closing
        $closingDateTimeInPacific = $nowInPacific->copy()->addDays(3)->endOfDay(); // pools close end of day in Pacific, by convention

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingDateTimeInPacific->copy()->setTimezone('Etc/UTC'),
            ]);
        $user = User::factory()
            ->create(
                [
                    'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                    'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                ]
            );
        PoolCandidate::factory()
            ->for($pool)
            ->for($user)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        Carbon::setTestNow($nowInPacific->copy()->setTimezone('Etc/UTC'));
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }

    // will not send a notification to a user if they have submitted their application
    public function testDoesNotSendNotificationIfApplicationSubmitted(): void
    {
        // computed via Carbon (rather than hardcoded UTC literals) so the test
        // doesn't depend on America/Vancouver's UTC offset at this future date
        $nowInPacific = Carbon::create(2027, 12, 28, 12, 0, 0, 'America/Vancouver'); // three days before closing
        $closingDateTimeInPacific = $nowInPacific->copy()->addDays(3)->endOfDay(); // pools close end of day in Pacific, by convention

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingDateTimeInPacific->copy()->setTimezone('Etc/UTC'),
            ]);
        $user = User::factory()
            ->create(
                [
                    'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                    'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                ]
            );
        PoolCandidate::factory()
            ->availableInSearch()
            ->for($pool)
            ->for($user)
            ->create();

        Carbon::setTestNow($nowInPacific->copy()->setTimezone('Etc/UTC'));
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertNotSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }

    // will not send a notification to a user if they have a draft application a pool not closing in three days
    public function testDoesNotSendNotificationIfNotThreeDaysBefore(): void
    {
        // computed via Carbon (rather than hardcoded UTC literals) so the test
        // doesn't depend on America/Vancouver's UTC offset at this future date
        $nowInPacific = Carbon::create(2027, 12, 30, 12, 0, 0, 'America/Vancouver'); // one day before closing
        $closingDateTimeInPacific = $nowInPacific->copy()->addDay()->endOfDay(); // pools close end of day in Pacific, by convention

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingDateTimeInPacific->copy()->setTimezone('Etc/UTC'),
            ]);
        $user = User::factory()
            ->create(
                [
                    'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                    'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                ]
            );
        PoolCandidate::factory()
            ->for($pool)
            ->for($user)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        Carbon::setTestNow($nowInPacific->copy()->setTimezone('Etc/UTC'));
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertNotSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }
}
