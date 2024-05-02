<?php

namespace App\Console;

use App\Console\Commands\HardDeleteOldUsers;
use App\Console\Commands\LogFlagsCommand;
use App\Console\Commands\PruneUserGeneratedFiles;
use App\Console\Commands\SendNotificationsApplicationDeadlineApproaching;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * To test locally, run php artisan schedule:work
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
            ->withoutOverlapping()
            ->appendOutputTo('/tmp/laravel-prune-user-generated-files.log');

        // queue up Application Deadline Approaching emails every day, close to the time the pool would close
        $schedule->command(SendNotificationsApplicationDeadlineApproaching::class)
            ->timezone('America/Vancouver')
            ->dailyAt('23:00')
            ->appendOutputTo('/tmp/send-notifications-application-deadline-approaching.log');

        $schedule->command(LogFlagsCommand::class)
            ->everyTenSeconds()
            ->appendOutputTo('/tmp/log-flags.log');
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
