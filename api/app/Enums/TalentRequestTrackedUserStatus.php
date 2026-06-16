<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestTrackedUserStatus
{
    use HasLocalization;

    case NOT_REFERRED;
    case REFERRED;
    case SELECTED;
    case NOT_SELECTED;

    public static function getLangFilename(): string
    {
        return 'talent_request_tracked_user_status';
    }
}
