<?php

namespace App\Enums;

use App\Traits\HasLocalization;

// A decision that a nomination evaluator can make regarding a specific nomination option
enum TalentNominationGroupDecision
{
    use HasLocalization;

    case APPROVED;
    case REJECTED;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_group_decision';
    }
}
