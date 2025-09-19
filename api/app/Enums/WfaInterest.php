<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum WfaInterest
{
    use HasLocalization;

    case NOT_APPLICABLE;
    case TERM_ENDING;
    case LETTER_RECEIVED;
    case NOT_SURE;
    case VOLUNTARY_DEPARTURE;

    public static function getLangFilename(): string
    {
        return 'wfa_interest';
    }
}
