<?php

namespace App\Listeners;

use App\Enums\NotificationFamily;
use App\Events\PoolPublised;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendNewJobPostedNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(PoolPublised $event): void
    {
        if (config('feature.notifications')) {
            $pool = $event->result;

            $notification = new NewJobPosted(
                $pool->name['en'],
                $pool->name['fr'],
                $pool->id
            );

            User::whereJsonContains('enabled_email_notifications', NotificationFamily::JOB_ALERT->name)
                ->orWhereJsonContains('enabled_in_app_notifications', NotificationFamily::JOB_ALERT->name)
                ->chunk(200, function (Collection $users) use ($notification) {
                    foreach ($users as $user) {
                        try {
                            $user->notify($notification);
                        } catch (Throwable $e) {
                            // best-effort: log and continue
                            Log::error('Failed to send "new job posted" notification to ['.$user->id.'] '.$e->getMessage());
                        }
                    }
                });

        }
    }
}
