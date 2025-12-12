<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateInterest
{
    use HasLocalization;

    case OPEN_TO_JOBS;
    case NOT_INTERESTED;
    case HIRED;

    public static function getLangFilename(): string
    {
        return 'candidate_interest';
    }
}
