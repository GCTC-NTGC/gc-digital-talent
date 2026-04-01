<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateReferralFilter
{
    use HasLocalization;

    case REFERRING;
    case NOT_REFERRING;
    case ALL;

    public static function getLangFilename(): string
    {
        return 'candidate_referral_filter';
    }
}
