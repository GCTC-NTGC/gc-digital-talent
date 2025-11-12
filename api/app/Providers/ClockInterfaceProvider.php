<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Illuminate\Support\ServiceProvider;
use Psr\Clock\ClockInterface;

class ClockInterfaceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ClockInterface::class, function () {
            // from https://github.com/bag2php/clock/blob/master/src/CarbonClock.php
            // A wrapper for the PSR-20 ClockInterface that just returns a Carbon datetime
            return new class implements ClockInterface
            {
                public function now(): DateTimeImmutable
                {
                    return new CarbonImmutable();
                }
            };
        });
    }
}
