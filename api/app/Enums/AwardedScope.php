<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum AwardedScope
{
    use HasLocalization;

    case INTERNATIONAL;
    case NATIONAL;
    case PROVINCIAL;
    case LOCAL;
    case COMMUNITY;
    case ORGANIZATIONAL;
    case SUB_ORGANIZATIONAL;

    public static function getLangFilename(): string
    {
        return 'awarded_scope';
    }
}
