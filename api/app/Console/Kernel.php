<?php

namespace App\Console;

use App\Console\Commands\PruneUserGeneratedFiles;
use App\Console\Commands\SendNotificationsApplicationDeadlineApproaching;
use App\Console\Commands\SendNotificationsPoolPublished;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Storage;

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
        $logFilesDisk = Storage::disk('logFiles');

        // $schedule->command(HardDeleteOldUsers::class)->dailyAt('08:00');

        // clean up old user generated files every day at 1:00 AM
        $schedule->command(PruneUserGeneratedFiles::class)
            ->timezone('America/Toronto')
            ->dailyAt('1:00')
            ->withoutOverlapping()
            ->appendOutputTo($logFilesDisk->path('laravel-prune-user-generated-files.log'));

        // queue up Application Deadline Approaching emails every day, close to the time the pool would close
        $schedule->command(SendNotificationsApplicationDeadlineApproaching::class)
            ->timezone('America/Toronto')
            // 10 PM Eastern is the same day across the country, close to the end of the day in NL
            ->dailyAt('22:00')
            ->appendOutputTo($logFilesDisk->path('send-notifications-application-deadline-approaching.log'));

        // send out 'new pool' emails overnight
        $schedule->command(SendNotificationsPoolPublished::class)
            ->timezone('America/Toronto')
            ->dailyAt('3:00')
            ->appendOutputTo($logFilesDisk->path('send-notifications-pool-published.log'));
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
