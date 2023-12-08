<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\SimpleMessage;
use App\Services\DemoHandlerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class DemoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $delaySeconds,
        public string $magicWord,
        public int|string|null $requestorId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(DemoHandlerService $handler): void
    {
        $response = $handler->handle($this->delaySeconds, $this->magicWord);
        if (! is_null($this->requestorId)) {
            User::find($this->requestorId)->notify(new SimpleMessage($response));
        } else {
            Log::info('No user ID to notify of demo job handling response.');
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Failed to run the demo job. '.$exception->getMessage());
    }
}
