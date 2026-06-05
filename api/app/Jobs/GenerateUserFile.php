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

    public function __construct(private FileGeneratorInterface $generator, private User $user) {}

    public function handle(): void
    {
        error_log('[GENDEBUG] handle() start attempt='.$this->attempts().' class='.get_class($this->generator).' path='.$this->generator->getPath());
        try {
            $this->generator->generate()->write();
            error_log('[GENDEBUG] generate() returned');

            // Don't announce success unless a real file actually landed. A silent
            // write failure (e.g. OpenSpout's temp dir filling) otherwise completes
            // cleanly and fires a "ready" notification for a file that isn't there.
            $path = $this->generator->getPath();
            clearstatcache(true, $path);
            error_log('[GENDEBUG] post-write is_file='.var_export(is_file($path), true).' size='.(is_file($path) ? filesize($path) : 'NA'));
            if (! is_file($path) || filesize($path) === 0) {
                Log::channel('jobs')->error('generated file missing', [
                    'path' => $path,
                    'exists' => is_file($path),
                    'size' => is_file($path) ? filesize($path) : null,
                    'free_storage' => @disk_free_space(dirname($path)),
                    'free_tmp' => @disk_free_space(sys_get_temp_dir()),
                ]);
                throw new \RuntimeException("generated file missing: {$path}");
            }

            error_log('[GENDEBUG] dispatching success event');
            UserFileGenerated::dispatch($this->generator->getFileNameWithExtension(), $this->user->id);
        } catch (\Throwable $e) {
            error_log('[GENDEBUG] CAUGHT '.get_class($e).': '.$e->getMessage().' @ '.$e->getFile().':'.$e->getLine());
            Log::channel('jobs')->error($e);
            $this->fail($e);
        }
    }

    public function failed(\Throwable $exception): void
    {
        error_log('[GENDEBUG] failed() '.get_class($exception).': '.$exception->getMessage());
        $this->user->notify(new UserFileGenerationError($this->generator->getFileNameWithExtension()));
    }
}
