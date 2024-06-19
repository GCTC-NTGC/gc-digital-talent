<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ArmedForcesStatus
{
    use HasLocalization;

    case VETERAN;
    case MEMBER;
    case NON_CAF;

    public static function getLangFilename(): string
    {
        return 'armed_forces_status';
    }
}
