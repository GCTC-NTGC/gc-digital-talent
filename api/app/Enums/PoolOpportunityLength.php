<?php

namespace App\Enums;

enum PoolOpportunityLength
{
    case TERM_SIX_MONTHS;
    case TERM_ONE_YEAR;
    case TERM_TWO_YEARS;
    case INDETERMINATE;
    case VARIOUS;
}
