<?php

namespace App\Notifications;

use App\Contracts\LowPriorityJob;
use App\Jobs\GcNotifyApiRequest;
use Illuminate\Support\Facades\Log;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, CanBeSentViaGcNotifyEmail $notification): void
    {
        $message = $notification->toGcNotifyEmail($notifiable);

        if (! config('notify.client.apiKey')) {
            $errorMessage = 'GC Notify API key is missing.';
            Log::error($errorMessage);
            throw new \Exception($errorMessage);
        } elseif (! $message->templateId) {
            $errorMessage = 'GC Notify Template ID is missing.';
            Log::error($errorMessage);
            throw new \Exception($errorMessage);
        } else {
            GcNotifyApiRequest::dispatch($message)->onQueue(
                $this->resolveQueuePriority($notification)
            );
        }
    }

    /**
     * Get the queue name to dispatch the job to
     *
     * Send the job to the low priority queue worker
     * if it implements the low priority interface
     */
    private function resolveQueuePriority(CanBeSentViaGcNotifyEmail $notification): string
    {
        $queue = config('queue.connections.database.queue');

        if ($notification instanceof LowPriorityJob) {
            return $queue.LowPriorityJob::QUEUE_SUFFIX;
        }

        return $queue;
    }
}
