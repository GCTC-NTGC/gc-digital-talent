<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\VerifyWorkEmail;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

class SendNotificationsVerifyWorkEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:verify-work-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send in-app notification to government users with unverified work emails';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $successCount = 0;
        $failureCount = 0;
        $notification = new VerifyWorkEmail();

        User::where('computed_is_gov_employee', true)
            ->whereNull('work_email_verified_at')
            ->chunk(200, function (Collection $users) use ($notification, &$successCount, &$failureCount) {
                foreach ($users as $user) {
                    try {
                        $user->notify($notification);
                        $successCount++;
                    } catch (Throwable $e) {
                        $this->error('Failure for ['.$user->id.']. '.$e->getMessage().' ');
                        $failureCount++;
                    }
                }
            });

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
