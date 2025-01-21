<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateRemovalReason
{
    use HasLocalization;

    case REQUESTED_TO_BE_WITHDRAWN;
    case NOT_RESPONSIVE;
    case INELIGIBLE;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'candidate_removal_reason';
    }
}
