<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum MoveInterest
{
    use HasLocalization;

    case ABOVE_LEVEL;
    case AT_LEVEL;
    case BELOW_LEVEL;

    public static function getLangFilename(): string
    {
        return 'move_interest';
    }
}
