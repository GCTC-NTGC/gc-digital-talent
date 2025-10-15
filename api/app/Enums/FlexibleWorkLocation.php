<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum FlexibleWorkLocation
{
    use HasLocalization;

    case REMOTE;
    case HYBRID;
    case ONSITE;

    public static function getLangFilename(): string
    {
        return 'flexible_work_locations';
    }
}
