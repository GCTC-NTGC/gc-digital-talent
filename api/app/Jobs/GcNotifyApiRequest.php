<?php

namespace App\Jobs;

use App\Exceptions\ExternalServiceException;
use App\Facades\Notify;
use App\Notifications\Messages\GcNotifyEmailMessage;
use DateTime;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\RateLimited;
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
            (new RateLimited('gcnotify_api')                                    // shared rate limiter defined in AppServiceProvider.php
                ->releaseAfter($seconds = 60)),
            (new ThrottlesExceptions($maxAttempts = 1, $decaySeconds = 600)     // after a single uncaught exception, wait and try again later
                ->byJob()),
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
        Log::shareContext([
            'job-id' => $this->job->getJobId(),
            'email-address' => $this->message->emailAddress,
        ]);

        $response = Notify::sendEmail(
            $this->message->emailAddress,
            $this->message->templateId,
            $this->message->messageVariables
        );

        Log::channel('jobs')->info('Sent message: '.$response->status(), $this->message->messageVariables);

        // special case: too many requests so we can retry later
        if ($response->tooManyRequests()) {
            throw new ExternalServiceException('Too many requests', $response->status());
        }

        // if the service says there's something else wrong with the request, don't try again
        if (! $response->successful()) {
            $firstApiErrorMessage = Arr::get($response->json(), 'errors.0.message');
            $errorMessage = 'Notification failed to send on GcNotifyEmailChannel. ['.$firstApiErrorMessage.'] Template ID: '.$this->message->templateId;
            Log::channel('jobs')->error($errorMessage);
            Log::channel('jobs')->debug($response->body());

            $this->fail($errorMessage);
        }
    }
}
