<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum DisqualificationReason
{
    use HasLocalization;

    case SCREENED_OUT_APPLICATION;
    case SCREENED_OUT_ASSESSMENT;

    public static function getLangFilename(): string
    {
        return 'disqualification_reason';
    }
}
