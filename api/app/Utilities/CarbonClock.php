<?php

namespace App\Utilities;

use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Psr\Clock\ClockInterface;

// from https://github.com/bag2php/clock/blob/master/src/CarbonClock.php
// A wrapper for the PSR-20 ClockInterface that just returns a Carbon datetime
class CarbonClock implements ClockInterface
{
    public function now(): DateTimeImmutable
    {
        return new CarbonImmutable();
    }
}
