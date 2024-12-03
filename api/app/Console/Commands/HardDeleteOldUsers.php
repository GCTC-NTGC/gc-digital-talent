<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class HardDeleteOldUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:hard-delete-old-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hard-delete all users soft-deleted for at least 5 years';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $deleteDate = Carbon::now()->subYears(5);
        /** @var array<User> $users */
        $users = User::onlyTrashed()->whereDate('deleted_at', '<=', $deleteDate)->get();

        $successCount = 0;
        $failCount = 0;

        foreach ($users as $user) {
            $trashDate = $user->deleted_at->toFormattedDateString();
            try {
                $user->forceDelete();
                Log::info("User {$user->id} ({$user->first_name} {$user->last_name}, trashed on {$trashDate}) hard deleted");
                $successCount++;
            } catch (Exception $e) {
                Log::error("Failed to delete user: {$user->id} ({$user->first_name} {$user->last_name}, trashed on {$trashDate})");
                Log::error($e->getMessage());
                $failCount++;
            }
        }
        Log::info('Command complete');
        Log::info("{$successCount} users hard deleted");
        if ($failCount > 0) {
            Log::error("{$failCount} users failed to delete");
        }
    }
}
