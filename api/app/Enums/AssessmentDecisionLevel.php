<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum AssessmentDecisionLevel
{
    use HasLocalization;

    case AT_REQUIRED;
    case ABOVE_REQUIRED;
    case ABOVE_AND_BEYOND_REQUIRED;

    public static function getLangFilename(): string
    {
        return 'assessment_decision_level';
    }
}
