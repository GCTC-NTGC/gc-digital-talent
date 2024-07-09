<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum AwardedTo
{
    use HasLocalization;

    case ME;
    case MY_TEAM;
    case MY_PROJECT;
    case MY_ORGANIZATION;

    public static function getLangFilename(): string
    {
        return 'awarded_to';
    }
}
