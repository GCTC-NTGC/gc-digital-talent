<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum GovPositionType
{
    use HasLocalization;

    case SUBSTANTIVE;
    case ACTING;
    case SECONDMENT;
    case ASSIGNMENT;

    public static function getLangFilename(): string
    {
        return 'gov_position_type';
    }
}
