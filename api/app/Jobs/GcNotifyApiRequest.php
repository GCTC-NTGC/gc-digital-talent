<?php

namespace App\Jobs;

use App\Facades\Notify;
use App\Jobs\Middleware\GcNotifyRateLimited;
use App\Notifications\Messages\GcNotifyEmailMessage;
use DateTime;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\ThrottlesExceptions;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class GcNotifyApiRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Get the middleware the job should pass through.
     *
     * @return array<int, object>
     */
    public function middleware(): array
    {
        return [
            (new GcNotifyRateLimited),
            (new ThrottlesExceptions(3, 10))
                ->byJob()
                ->backoff(4),
        ];
    }

    /**
     * Determine the time at which the job should timeout.
     */
    public function retryUntil(): DateTime
    {
        return now()->addMinutes(30);
    }

    /**
     * Create a new job instance.
     */
    public function __construct(
        public GcNotifyEmailMessage $message
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $response = Notify::sendEmail(
            $this->message->emailAddress,
            $this->message->templateId,
            $this->message->messageVariables
        );

        if (! is_null($response) && ! $response->successful()) {
            $firstApiErrorMessage = Arr::get($response->json(), 'errors.0.message');
            $errorMessage = 'Notification failed to send on GcNotifyEmailChannel. ['.$firstApiErrorMessage.'] Template ID: '.$this->message->templateId;
            Log::error($errorMessage);
            Log::debug($response->body());

            throw new Exception($errorMessage);
        }
    }
}
