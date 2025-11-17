<?php

namespace App\Providers;

use App\Services\CarbonClockService;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

class ClockInterfaceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ClockInterface::class, CarbonClockService::class);
    }
}
