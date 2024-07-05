<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum WorkRegion
{
    use HasLocalization;

    case TELEWORK;
    case NATIONAL_CAPITAL;
    case ATLANTIC;
    case QUEBEC;
    case ONTARIO;
    case PRAIRIE;
    case BRITISH_COLUMBIA;
    case NORTH;

    public static function getLangFilename(): string
    {
        return 'work_region';
    }
}
