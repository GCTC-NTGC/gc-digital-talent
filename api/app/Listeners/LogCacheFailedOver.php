<?php

namespace App\Listeners;

use Illuminate\Cache\Events\CacheFailedOver;
use Illuminate\Support\Facades\Log;

class LogCacheFailedOver
{
    public function handle(CacheFailedOver $event): void
    {
        Log::warning('Cache store failed, falling back to the next store', [
            'store' => $event->storeName,
            'error' => $event->exception->getMessage(),
        ]);
    }
}
