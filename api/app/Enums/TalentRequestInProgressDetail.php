<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestInProgressDetail
{
    use HasLocalization;

    case INITIAL_CONVERSATION;
    case TALENT_SENT;
    case FOLLOW_UP_SENT;
    case DISCUSSION_ONGOING;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'talent_request_in_progress_detail';
    }
}
