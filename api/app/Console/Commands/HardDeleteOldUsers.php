<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

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
        $users = User::onlyTrashed()->whereDate('deleted_at', '<=', $deleteDate)->get();

        foreach ($users as $user) {
            $user->forceDelete();
        }
    }
}
