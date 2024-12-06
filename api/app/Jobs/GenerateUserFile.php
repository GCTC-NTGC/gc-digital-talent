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
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

class GenerateUserFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(private FileGeneratorInterface $generator, private User $user) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->generator->generate()->write();

            UserFileGenerated::dispatch($this->generator->getFileNameWithExtension(), $this->user->id);
        } catch (\Throwable $e) {
            // Notify the user something went wrong
            $this->user->notify(new UserFileGenerationError($this->generator->getFileNameWithExtension()));
            Log::error($e);

            // workaround until we get better logging in prod #11289
            $onDemandLog = Log::build([
                'driver' => 'single',
                'path' => App::isProduction() // workaround for storage_path misconfigured in prod #11471
                    ? '/tmp/api/storage/logs/jobs.log'
                    : storage_path('logs/jobs.log'),
            ]);
            $onDemandLog->error($e);
        }

    }
}
