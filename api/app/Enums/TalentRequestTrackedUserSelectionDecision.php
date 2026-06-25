<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserSelectionDecision
{
    use HasLocalization;

    case SELECTED;
    case NOT_SELECTED;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_selection_decision';
    }
}
