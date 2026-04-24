<?php

namespace App\Console\Commands;

use App\Enums\NotificationFamily;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

// This is a copy of SendNotificationsPoolPublished designed to be run manually and choose a specific pool.
class SendNotificationsPoolPublishedSpecific extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:pool-published-specific {poolId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users about a specific pool being published.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $poolId = $this->argument('poolId');
        $pool = Pool::find($poolId);

        if (! $pool) {
            $this->error('Could not find a pool with that ID.');

            return Command::FAILURE;
        }

        $this->info('Found the pool "'.($pool->name['en']).'" published on "'.($pool->published_at).'" set to close on "'.($pool->closing_date).'".');
        if (! $this->confirm('Do you wish to send notifications for this pool?')) {
            $this->info('Cancelled command.');

            return Command::FAILURE;
        }

        $notifications = collect([
            new NewJobPosted(
                $pool->name['en'],
                $pool->name['fr'],
                $pool->id
            ),
        ]);

        // Everything below this line should stay in sync with api/app/Console/Commands/SendNotificationsPoolPublished.php

        $successCount = 0;
        $failureCount = 0;

        if ($notifications->count() > 0) {
            User::whereJsonContains('enabled_email_notifications', NotificationFamily::JOB_ALERT->name)
                ->orWhereJsonContains('enabled_in_app_notifications', NotificationFamily::JOB_ALERT->name)
                ->chunk(200, function (Collection $users) use ($notifications, &$successCount, &$failureCount) {
                    foreach ($users as $user) {
                        foreach ($notifications as $notification) {
                            try {
                                $user->notify($notification);
                                $successCount++;
                            } catch (Throwable $e) {
                                // best-effort: log and continue
                                $this->error('Failed to send "new job posted" notification for "'.$notification->poolNameEn.'" ('.$notification->poolId.') to user " '.$user->first_name.' '.$user->last_name.' ('.$user->id.'). '.$e->getMessage());
                                $failureCount++;
                            }
                        }
                    }
                });
        } else {
            $this->info('No notifications to send.');
        }

        $this->info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
