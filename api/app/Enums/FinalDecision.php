<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum FinalDecision
{
    use HasLocalization;

    case DISQUALIFIED;
    case DISQUALIFIED_PENDING;
    case DISQUALIFIED_REMOVED;

    case QUALIFIED;
    case QUALIFIED_EXPIRED;
    case QUALIFIED_PENDING;
    case QUALIFIED_PLACED;
    case QUALIFIED_REMOVED;

    case REMOVED;

    case TO_ASSESS;
    case TO_ASSESS_REMOVED;

    public static function getLangFilename(): string
    {
        return 'final_decision';
    }
}
