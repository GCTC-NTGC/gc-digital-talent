<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Enums\PoolCandidateStatus;
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
        $closingDateTimeInPacific = '2999-12-31 23:59:59'; // pools close end of day in Pacific, by convention
        $closingTimeInUtc = '3000-01-01 07:59:59';
        $nowInPacific = '2999-12-28 12:00:00'; // three days before closing
        $nowInUtc = '2999-12-28 20:00:00';

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingTimeInUtc,
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
                'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        Carbon::setTestNow($nowInUtc);
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }

    // will not send a notification to a user if they have submitted their application
    public function testDoesNotSendNotificationIfApplicationSubmitted(): void
    {
        $closingDateTimeInPacific = '2999-12-31 23:59:59'; // pools close end of day in Pacific, by convention
        $closingTimeInUtc = '3000-01-01 07:59:59';
        $nowInPacific = '2999-12-28 12:00:00'; // three days before closing
        $nowInUtc = '2999-12-28 20:00:00';

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingTimeInUtc,
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

        Carbon::setTestNow($nowInUtc);
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertNotSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }

    // will not send a notification to a user if they have a draft application a pool not closing in three days
    public function testDoesNotSendNotificationIfNotThreeDaysBefore(): void
    {
        $closingDateTimeInPacific = '2999-12-31 23:59:59'; // pools close end of day in Pacific, by convention
        $closingTimeInUtc = '3000-01-01 07:59:59';
        $nowInPacific = '2999-12-30 12:00:00'; // one day before closing
        $nowInUtc = '2999-12-30 20:00:00';

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingTimeInUtc,
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
                'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        Carbon::setTestNow($nowInUtc);
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertNotSentTo(
            [$user], ApplicationDeadlineApproaching::class
        );
    }

    public function testClosingDateFormat()
    {
        $closingTimeInUtc = '3000-01-01 07:59:59';
        $nowInUtc = '2999-12-28 20:00:00';

        $pool = Pool::factory()
            ->published()
            ->create([
                'closing_date' => $closingTimeInUtc,
            ]);

        $frenchUser = User::factory()
            ->create(
                [
                    'preferred_lang' => 'fr',
                    'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                    'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                ]
            );

        PoolCandidate::factory()
            ->for($pool)
            ->for($frenchUser)
            ->create([
                'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        $englishUser = User::factory()
            ->create(
                [
                    'preferred_lang' => 'en',
                    'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                    'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                ]
            );

        PoolCandidate::factory()
            ->for($pool)
            ->for($englishUser)
            ->create([
                'pool_candidate_status' => PoolCandidateStatus::DRAFT->name,
                'submitted_at' => null,
            ]);

        Carbon::setTestNow($nowInUtc);
        $exitCode = Artisan::call('send-notifications:application-deadline-approaching');

        $pacificDate = $pool->closing_date->setTimezone('America/Vancouver');

        $expectedFrenchDate = Carbon::executeWithLocale('fr', function () use ($pacificDate) {
            return $pacificDate->translatedFormat('j F Y');
        });

        $expectedEnglishDate = Carbon::executeWithLocale('en', function () use ($pacificDate) {
            return $pacificDate->translatedFormat('F j, Y');
        });

        assertEquals(Command::SUCCESS, $exitCode);
        Notification::assertSentTo(
            [$frenchUser], ApplicationDeadlineApproaching::class, function ($notification) use ($frenchUser, $expectedFrenchDate) {
                $data = $notification->toGcNotifyEmail($frenchUser);

                $this->assertEquals($expectedFrenchDate, $data->messageVariables['closing date']);

                return true;
            });

        Notification::assertSentTo(
            [$englishUser], ApplicationDeadlineApproaching::class, function ($notification) use ($englishUser, $expectedEnglishDate) {
                $data = $notification->toGcNotifyEmail($englishUser);

                $this->assertEquals($expectedEnglishDate, $data->messageVariables['closing date']);

                return true;
            });
    }
}
