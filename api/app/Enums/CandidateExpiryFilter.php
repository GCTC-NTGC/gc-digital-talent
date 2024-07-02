<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateExpiryFilter
{
    use HasLocalization;

    case ACTIVE;
    case EXPIRED;
    case ALL;

    public static function getLangFilename(): string
    {
        return 'candidate_expiry_filter';
    }
}
