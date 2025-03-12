<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TimeFrame
{
    use HasLocalization;

    case THIS_YEAR;
    case ONE_TO_TWO_YEARS;
    case THREE_OR_MORE_YEARS;

    public static function getLangFilename(): string
    {
        return 'time_frame';
    }
}
