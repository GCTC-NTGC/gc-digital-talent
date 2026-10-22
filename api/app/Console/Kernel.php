<?php

namespace App\Console;

use App\Console\Commands\AuthPing;
use App\Console\Commands\PruneUserGeneratedFiles;
use App\Console\Commands\ResumeReferrals;
use App\Console\Commands\SendNotificationsApplicationDeadlineApproaching;
use App\Console\Commands\SendNotificationsPoolPublished;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * To test locally, run php artisan schedule:work
     *
     * Every event must use onOneServer(): each instance in a slot runs its own cron against the shared DB
     * (pilot slots skip cron entirely, see infrastructure/bin/post_deployment.sh)
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command(HardDeleteOldUsers::class)->dailyAt('08:00');

        // clean up old user generated files every day at 1:00 AM
        $schedule->command(PruneUserGeneratedFiles::class)
            ->timezone('America/Toronto')
            ->dailyAt('1:00')
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/prune-user-generated-files.log'));

        // queue up Application Deadline Approaching emails every day, close to the time the pool would close
        $schedule->command(SendNotificationsApplicationDeadlineApproaching::class)
            ->timezone('America/Toronto')
            // 10 PM Eastern is the same day across the country, close to the end of the day in NL
            ->dailyAt('22:00')
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/send-notifications-application-deadline-approaching.log'));

        // send out 'new pool' emails overnight
        $schedule->command(SendNotificationsPoolPublished::class)
            ->timezone('America/Toronto')
            ->dailyAt('3:00')
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/send-notifications-pool-published.log'));

        // Unpause candidate referrals if date is up, every day at 1:00 AM
        $schedule->command(ResumeReferrals::class)
            ->timezone('America/Toronto')
            ->dailyAt('1:00')
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/resume-referrals.log'));

        // Check the health of the auth provider
        $schedule->command(AuthPing::class)
            ->everyFiveMinutes()
            ->onOneServer()
            ->appendOutputTo(storage_path('logs/auth-ping.log'));

        // TEMPORARY: lets reviewers check onOneServer() locally without waiting for a 5 minute tick (PR #18352)
        $schedule->call(fn () => Log::channel('jobs')->info('onOneServer sample ran', ['pid' => getmypid()]))
            ->name('onOneServer sample')
            ->everyMinute()
            ->onOneServer();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
