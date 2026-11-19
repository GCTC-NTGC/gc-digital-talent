<?php

namespace App\Notifications;

use App\Contracts\LowPriorityJob;
use App\Jobs\GcNotifyApiRequest;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Illuminate\Support\Facades\Log;

class GcNotifyEmailChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, CanBeSentViaGcNotifyEmail $notification): void
    {
        $message = $this->buildMessage($notifiable, $notification);

        if (is_null($message)) {
            return;
        }

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
     * Build the message to send.
     *
     * Subclasses can override this to adjust the message, or return null to skip sending.
     */
    protected function buildMessage(object $notifiable, CanBeSentViaGcNotifyEmail $notification): ?GcNotifyEmailMessage
    {
        return $notification->toGcNotifyEmail($notifiable);
    }

    /**
     * Get the queue name to dispatch the job to
     *
     * Send the job to the low priority queue worker
     * if it implements the low priority interface
     */
    private function resolveQueuePriority(CanBeSentViaGcNotifyEmail $notification): string
    {
        $queue = config('queue.name');

        if ($notification instanceof LowPriorityJob) {
            return $queue.LowPriorityJob::QUEUE_SUFFIX;
        }

        return $queue;
    }
}
