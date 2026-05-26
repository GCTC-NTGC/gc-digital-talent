<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestStatus
{
    use HasLocalization;

    case NEW;
    case IN_PROGRESS;
    case COMPLETE;

    public static function getLangFilename(): string
    {
        return 'talent_request_status';
    }
}
