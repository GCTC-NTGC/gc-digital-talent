<?php

namespace App\Console\Commands;

use App\Enums\NotificationFamily;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendNotificationsPoolPublished extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:pool-published';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users about a new pool being published.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // workaround until we get better logging in prod #11289
        $onDemandLog = Log::build([
            'driver' => 'single',
            'path' => App::isProduction() // workaround for storage_path misconfigured in prod #11471
                ? '/tmp/api/storage/logs/jobs.log'
                : storage_path('logs/jobs.log'),
        ]);

        $this->info('SendNotificationsPoolPublished running at '.Carbon::now()->toDateTimeString().'.');

        $successCount = 0;
        $failureCount = 0;

        $endOfSpan = Carbon::now();
        $startOfSpan = Carbon::now()->subHours(24); // assuming the last reporting job ran about 24 hours ago
        $this->info("Finding pools published between $startOfSpan and $endOfSpan.");

        $poolsPublishedRecently = Pool::query()
            ->wherePublished()
            ->where('published_at', '>=', $startOfSpan)
            ->where('published_at', '<', $endOfSpan)
            ->with('classification')
            ->get();

        $this->info('Found '.$poolsPublishedRecently->count().' pools.');

        $notifications = $poolsPublishedRecently->map(fn ($pool) => new NewJobPosted(
            $pool->name['en'],
            $pool->name['fr'],
            $pool->id
        ));

        $successCount = 0;
        $failureCount = 0;

        if ($notifications->count() > 0) {
            User::whereJsonContains('enabled_email_notifications', NotificationFamily::JOB_ALERT->name)
                ->orWhereJsonContains('enabled_in_app_notifications', NotificationFamily::JOB_ALERT->name)
                ->chunk(200, function (Collection $users) use ($notifications, &$successCount, &$failureCount, $onDemandLog) {
                    foreach ($users as $user) {
                        foreach ($notifications as $notification) {
                            try {
                                $user->notify($notification);
                                $successCount++;
                            } catch (Throwable $e) {
                                // best-effort: log and continue
                                $onDemandLog->error('Failed to send "new job posted" notification for "'.$notification->poolNameEn.'" ('.$notification->poolId.') to user " '.$user->firstName.' '.$user->lastName.' ('.$user->id.'). '.$e->getMessage());
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
