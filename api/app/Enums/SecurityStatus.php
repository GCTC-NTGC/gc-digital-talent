<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum SecurityStatus
{
    use HasLocalization;

    case RELIABILITY;
    case SECRET;
    case TOP_SECRET;

    public static function getLangFilename(): string
    {
        return 'security_clearance';
    }
}
