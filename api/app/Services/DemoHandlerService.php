<?php

namespace App\Services;

class DemoHandlerService
{
    public function handle(
        int $delaySeconds,
        string $magicWord
    ): string {
        sleep($delaySeconds);

        return 'I finished thinking about your word '.$magicWord.' after '.$delaySeconds.' seconds.';

    }
}
