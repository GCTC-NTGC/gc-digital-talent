<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PositionDuration
{
    use HasLocalization;

    case TEMPORARY;
    case PERMANENT;

    public static function getLangFilename(): string
    {
        return 'position_duration';
    }
}
