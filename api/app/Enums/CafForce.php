<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum CafForce
{
    use HasLocalization;

    case CANADIAN_ARMY;
    case ROYAL_CANADIAN_AIR_FORCE;
    case ROYAL_CANADIAN_NAVY;

    public static function getLangFilename(): string
    {
        return 'caf_force';
    }
}
