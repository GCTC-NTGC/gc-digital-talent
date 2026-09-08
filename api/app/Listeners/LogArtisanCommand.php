<?php

namespace App\Listeners;

use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Log;

// Logs to the "cli" channel explicitly (rather than the default channel) so every
// artisan invocation is recorded regardless of how LOG_CHANNEL is configured.
class LogArtisanCommand
{
    private static ?float $startedAt = null;

    public function starting(CommandStarting $event): void
    {
        self::$startedAt = microtime(true);

        Log::channel('cli')->info('Artisan command starting', [
            'command' => $event->command,
            'arguments' => (string) $event->input,
        ]);
    }

    public function finished(CommandFinished $event): void
    {
        Log::channel('cli')->info('Artisan command finished', [
            'command' => $event->command,
            'arguments' => (string) $event->input,
            'exitCode' => $event->exitCode,
            'durationMs' => $this->durationMs(),
        ]);

        self::$startedAt = null;
    }

    private function durationMs(): ?int
    {
        if (self::$startedAt === null) {
            return null;
        }

        return (int) round((microtime(true) - self::$startedAt) * 1000);
    }
}
