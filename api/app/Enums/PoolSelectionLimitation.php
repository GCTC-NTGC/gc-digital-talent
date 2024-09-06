<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolSelectionLimitation
{
    use HasLocalization;

    case AT_LEVEL_ONLY;
    case DEPARTMENTAL_PREFERENCE;

    public static function getLangFilename(): string
    {
        return 'pool_selection_limitation';
    }
}
