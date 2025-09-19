<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum HiringPlatform
{
    use HasLocalization;

    case GC_JOBS;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'hiring_platform';
    }
}
