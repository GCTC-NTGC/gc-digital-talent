<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolPublishedRange
{
    use HasLocalization;

    case UNDER_48_HOURS;
    case UNDER_30_DAYS;
    case OVER_30_DAYS;

    public static function getLangFilename(): string
    {
        return 'pool_published_range';
    }
}
