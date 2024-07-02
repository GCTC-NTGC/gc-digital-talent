<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum AssessmentDecision
{
    use HasLocalization;

    case HOLD;
    case SUCCESSFUL;
    case UNSUCCESSFUL;

    public static function getLangFilename(): string
    {
        return 'assessment_decision';
    }
}
