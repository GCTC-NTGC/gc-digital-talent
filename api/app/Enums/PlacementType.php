<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PlacementType
{
    use HasLocalization;

    case PLACED_TENTATIVE;
    case PLACED_CASUAL;
    case PLACED_TERM;
    case PLACED_INDETERMINATE;

    public static function getLangFilename(): string
    {
        return 'placement_type';
    }
}
