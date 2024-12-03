<?php

namespace App\Console\Commands;

use App\Enums\NotificationFamily;
use App\Enums\PublishingGroup;
use App\Models\Pool;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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
        Log::info('SendNotificationsPoolPublished running at '.Carbon::now()->toDateTimeString().'.');

        $successCount = 0;
        $failureCount = 0;

        $endOfSpan = Carbon::now();
        $startOfSpan = Carbon::now()->subHours(24); // assuming the last reporting job ran about 24 hours ago
        Log::info("Finding pools published between $startOfSpan and $endOfSpan.");

        $poolsPublishedRecently = Pool::query()
            ->where('published_at', '>=', $startOfSpan)
            ->where('published_at', '<', $endOfSpan)
            ->whereNotClosed() // don't notify of pools that have already been closed
            ->where('publishing_group', '<>', PublishingGroup::OTHER->name) // don't notify of testing pools
            ->get();

        Log::info('Found '.$poolsPublishedRecently->count().' pools.');

        $notifications = $poolsPublishedRecently
            ->map(fn ($model) => get_class($model) == Pool::class
                ? new NewJobPosted(
                    $model->name['en'],
                    $model->name['fr'],
                    $model->id
                )
                : null
            )
            ->whereNotNull();

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
                                Log::error('Failed to send "new job posted" notification for "'.$notification->poolNameEn.'" ('.$notification->poolId.') to user " '.$user->first_name.' '.$user->last_name.' ('.$user->id.'). '.$e->getMessage());
                                $failureCount++;
                            }
                        }
                    }
                });
        } else {
            Log::info('No notifications to send.');
        }

        Log::info("Success: $successCount Failure: $failureCount");
        if ($failureCount > 0) {
            return Command::FAILURE;
        } else {
            return Command::SUCCESS;
        }
    }
}
