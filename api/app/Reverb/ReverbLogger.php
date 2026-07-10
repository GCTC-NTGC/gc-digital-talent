<?php

namespace App\Reverb;

use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Contracts\Logger;

class ReverbLogger implements Logger
{
    public function error(string $message): void
    {
        Log::error($message);
    }

    public function info(string $title, ?string $message = null): void {}

    public function message(string $message): void {}

    public function line(int $lines = 1): void {}
}
