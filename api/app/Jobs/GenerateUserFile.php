<?php

namespace App\Jobs;

use App\Events\UserFileGenerated;
use App\Generators\FileGeneratorInterface;
use App\Models\User;
use App\Notifications\UserFileGenerationError;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateUserFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public int $tries = 3;

    public function __construct(private FileGeneratorInterface $generator, private User $user)
    {

        // This is still the Web request's context so no logging context is shared with `handle`
        Log::channel('jobs')->info('GenerateUserFile job created',
            [
                // no Job ID assigned yet
                'FileName' => $generator->getFileNameWithExtension(),
                'UserID' => $user->id,
            ]);
    }

    public function handle(): void
    {
        // This is queued job's context
        Log::shareContext([
            'JobID' => $this->job?->getJobId(),
            'JobUUID' => $this->job?->uuid(),
            'FileName' => $this->generator->getFileNameWithExtension(),
            'UserID' => $this->user->id,
        ]);

        Log::channel('jobs')->info('GenerateUserFile handle started');

        try {
            $this->generator->generate()->write();

            // Don't announce success unless a real file actually landed. A silent
            // write failure (e.g. OpenSpout's temp dir filling) otherwise completes
            // cleanly and fires a "ready" notification for a file that isn't there.
            $path = $this->generator->getPath();
            clearstatcache(true, $path);
            if (! is_file($path) || filesize($path) === 0) {
                throw new \RuntimeException("generated file missing: {$path}");
            }
            throw new \RuntimeException("generated file missing: {$path}");
            UserFileGenerated::dispatch($this->generator->getFileNameWithExtension(), $this->user->id);
        } catch (\Throwable $e) {
            $this->fail($e);
        }

        Log::channel('jobs')->info('GenerateUserFile handle finished');
    }

    public function failed(\Throwable $exception): void
    {
        Log::channel('jobs')->error(
            'GenerateUserFile job failed', [
                'message' => $exception->getMessage(),
            ]);
        $this->user->notify(new UserFileGenerationError($this->generator->getFileNameWithExtension()));
    }
}
