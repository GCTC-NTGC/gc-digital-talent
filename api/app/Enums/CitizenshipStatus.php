<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CitizenshipStatus
{
    use HasLocalization;

    case PERMANENT_RESIDENT;
    case CITIZEN;
    case OTHER;

    public static function getLangFilename(): string
    {

        return 'citizenship_status';
    }
}
