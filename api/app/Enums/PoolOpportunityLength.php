<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolOpportunityLength
{
    use HasLocalization;

    case TERM_SIX_MONTHS;
    case TERM_ONE_YEAR;
    case TERM_TWO_YEARS;
    case INDETERMINATE;
    case VARIOUS;

    public static function getLangFilename(): string
    {
        return 'pool_opportunity_length';
    }
}
