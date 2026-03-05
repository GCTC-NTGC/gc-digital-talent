<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ReferralPauseLength
{
    use HasLocalization;

    case ONE_MONTH;
    case THREE_MONTHS;
    case SIX_MONTHS;
    case ONE_YEAR;
    case UNTIL_EXPIRY;
    case OTHER;

    public static function getLangFilename(): string
    {

        return 'referral_pause_length';
    }
}
