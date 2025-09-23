<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\MigrateOffPlatformProcesses;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SendNotificationsMigrateOffPlatformProcesses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:migrate-off-platform-processes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users that they should migrate their off-platform processes.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $users = User::where(DB::raw('length(off_platform_recruitment_processes)'), '>', 0);
        $userCount = $users->count();

        if ($this->confirm('Do you wish to send notifications to '.$userCount.' users?')) {
            $progressBar = $this->output->createProgressBar($userCount);
            $notification = new MigrateOffPlatformProcesses();

            $users->chunk(200, function (Collection $chunkOfUsers) use (&$successCount, &$failureCount, $progressBar, $notification) {
                /** @var \App\Models\User $user */
                foreach ($chunkOfUsers as $user) {
                    try {
                        $user->notify($notification);
                        $successCount++;
                    } catch (\Throwable $e) {
                        $this->error("Failed to queue notification for user $user->id: ".$e->getMessage());
                        $failureCount++;
                    } finally {
                        $progressBar->advance();
                    }
                }
            });
            $this->newLine();

            $this->info("Notifications queued.  Success: $successCount Failure: $failureCount");
            if ($failureCount > 0) {
                return Command::FAILURE;
            } else {
                return Command::SUCCESS;
            }
        } else {
            $this->info('Notification sending cancelled');

            return Command::SUCCESS;
        }
    }
}
