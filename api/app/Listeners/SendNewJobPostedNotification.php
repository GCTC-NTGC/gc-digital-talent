<?php

namespace App\Listeners;

use App\Enums\NotificationFamily;
use App\Events\PoolPublished;
use App\Models\User;
use App\Notifications\NewJobPosted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendNewJobPostedNotification implements ShouldQueue
{
    /**
     * The number of seconds the job can run before timing out.
     * Locally, I can queue about 7400 jobs per minute.
     *
     * @var int
     */
    public $timeout = 60 * 10;

    /**
     * The number of times the job may be attempted.
     * Duplicate runs of this job will result in
     * duplicate notifications being sent.
     *
     * @var int
     */
    public $tries = 1;

    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(PoolPublished $event): void
    {
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
