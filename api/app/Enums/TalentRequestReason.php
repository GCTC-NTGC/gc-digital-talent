<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestReason
{
    use HasLocalization;

    case IMMEDIATE_HIRE;
    case UPCOMING_NEED;
    case GENERAL_INTEREST;
    case REQUIRED_BY_DIRECTIVE;

    public static function getLangFilename(): string
    {
        return 'talent_request_reason';
    }
}
