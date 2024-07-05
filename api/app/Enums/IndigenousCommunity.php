<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum IndigenousCommunity
{
    use HasLocalization;

    case STATUS_FIRST_NATIONS;
    case NON_STATUS_FIRST_NATIONS;
    case INUIT;
    case METIS;
    case OTHER;
    case LEGACY_IS_INDIGENOUS;

    public static function getLangFilename(): string
    {
        return 'indigenous_community';
    }
}
