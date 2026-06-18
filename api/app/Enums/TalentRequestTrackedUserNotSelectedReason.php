<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserNotSelectedReason
{
    use HasLocalization;

    case OTHER;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_not_selected_reason';
    }
}
