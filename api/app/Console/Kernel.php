<?php

namespace App\Console;

use App\Console\Commands\HardDeleteOldUsers;
use App\Console\Commands\PruneUserGeneratedFiles;
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

        // clean up old user generated files every day at 2:00 AM
        $schedule->command(PruneUserGeneratedFiles::class)
            ->timezone('America/Toronto')
            ->dailyAt('2:00')
            ->withoutOverlapping()
            ->sendOutputTo('/proc/1/fd/1', true); // docker logs
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
