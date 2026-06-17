<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserNotSelectedReason
{
    use HasLocalization;

    case LACKS_EXPERIENCE;
    case REQUIREMENT_MISMATCH;
    case DECLINED_BY_CANDIDATE;
    case OTHER_CANDIDATE_SELECTED;
    case NO_REASON;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_not_selected_reason';
    }
}
