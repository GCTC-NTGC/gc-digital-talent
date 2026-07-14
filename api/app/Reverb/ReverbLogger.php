<?php

namespace App\Reverb;

use Illuminate\Log\Logger as IlluminateLogger;
use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Contracts\Logger;

class ReverbLogger implements Logger
{
    protected IlluminateLogger $logger;

    public function __construct()
    {
        // Reverb runs as a separate process from the web server, so it can't
        // use the default (Azure) logging channel. On-demand channel writes
        // straight to a local file instead. https://laravel.com/docs/13.x/logging#on-demand-channels
        $this->logger = Log::build([
            'driver' => 'single',
            'path' => storage_path('logs/reverb.log'),
        ]);
    }

    public function error(string $message): void
    {
        $this->logger->error($message);
    }

    public function info(string $title, ?string $message = null): void {}

    public function message(string $message): void {}

    public function line(int $lines = 1): void {}
}
