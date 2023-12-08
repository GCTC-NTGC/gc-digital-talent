<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class DemoHandlerService
{
    public function handle(
        int $delaySeconds,
        string $magicWord
    ) {
        sleep($delaySeconds);
        Log::debug('The magic word is '.$magicWord);
    }
}
