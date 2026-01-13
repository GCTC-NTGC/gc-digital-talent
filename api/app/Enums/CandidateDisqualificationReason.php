<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CandidateDisqualificationReason
{
    use HasLocalization;

    case APPLICATION;
    case ASSESSMENT;

    public static function getLangFilename(): string
    {
        return 'candidate_disqualification_reason';
    }
}
