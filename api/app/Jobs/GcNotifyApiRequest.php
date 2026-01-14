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
use Illuminate\Support\Str;

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
            (new ThrottlesExceptions($maxAttempts = 10, $decaySeconds = 600))
                ->byJob()
                ->backoff($minutes = 10),
        ];
    }

    /**
     * Determine the time at which the job should timeout.
     */
    public function retryUntil(): DateTime
    {
        return now()->addHours(12);
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

        // hit rate limiter: try again later
        if ($response->tooManyRequests()) {
            $this->release($delaySeconds = 60);
        }
        // tried to send to non-allowlisted recipient using team-only API key: treat as a success
        if (
            $response->clientError() &&
            Str::startsWith($response->json('errors.0.message'), 'Can’t send to this recipient using a team-only API key')
        ) {
            Log::channel('jobs')->debug($response->body(), [$this->message->emailAddress]);

            return; // pretend job was successful
        }

        if (! $response->successful()) {
            $firstApiErrorMessage = Arr::get($response->json(), 'errors.0.message');
            $errorMessage = 'Notification failed to send on GcNotifyEmailChannel. ['.$firstApiErrorMessage.'] Template ID: '.$this->message->templateId;
            Log::channel('jobs')->error($errorMessage);
            Log::channel('jobs')->debug($response->body());

            throw new Exception($errorMessage);
        }
    }
}
