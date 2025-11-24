<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateUserTextSearchIndexes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-user-text-search-indexes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates all the user text search indexes.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;

        $users = User::all()->toQuery();
        $userCount = $users->count();

        if ($this->confirm('Do you wish to update '.$userCount.' user text search indexes?')) {
            $progressBar = $this->output->createProgressBar($userCount);

            $users->chunk(200, function ($chunkOfUsers) use (&$successCount, &$failureCount, $progressBar) {
                /** @var \App\Models\User $user */
                foreach ($chunkOfUsers as $user) {
                    try {
                        $user->searchable();
                        $successCount++;
                    } catch (\Throwable $e) {
                        $this->error("Failed to index user $user->id: ".$e->getMessage());
                        $failureCount++;
                    } finally {
                        $progressBar->advance();
                    }
                }
            });
            $this->newLine();

            $this->info("Users indexed.  Success: $successCount Failure: $failureCount");
            if ($failureCount > 0) {
                return Command::FAILURE;
            } else {
                return Command::SUCCESS;
            }
        } else {
            $this->info('Indexing cancelled');

            return Command::SUCCESS;
        }
    }
}
