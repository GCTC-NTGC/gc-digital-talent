<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateSuspendedFilter
{
    use HasLocalization;

    case ACTIVE;
    case SUSPENDED;
    case ALL;

    public static function getLangFilename(): string
    {
        return 'candidate_suspended_filter';
    }
}
