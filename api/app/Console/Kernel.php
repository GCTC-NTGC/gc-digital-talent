<?php

namespace App\Console;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $deleteDate = Carbon::now()->subYears(5);
            $users = User::onlyTrashed()->whereDate('deleted_at', '<=', $deleteDate)->get();

            foreach ($users as $user) {
                // Cascade delete to child models
                foreach ($user->poolCandidates()->withTrashed()->get() as $candidate) {
                    $candidate->forceDelete();
                }
                foreach ($user->awardExperiences()->withTrashed()->get() as $experience) {
                    $experience->forceDelete();
                }
                foreach ($user->communityExperiences()->withTrashed()->get() as $experience) {
                    $experience->forceDelete();
                }
                foreach ($user->educationExperiences()->withTrashed()->get() as $experience) {
                    $experience->forceDelete();
                }
                foreach ($user->personalExperiences()->withTrashed()->get() as $experience) {
                    $experience->forceDelete();
                }
                foreach ($user->workExperiences()->withTrashed()->get() as $experience) {
                    $experience->forceDelete();
                }

                $user->forceDelete();
            }
        })->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
