<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum NineBoxRating
{
    use HasLocalization;

    case LOW;
    case MEDIUM;
    case HIGH;

    public static function getLangFilename(): string
    {
        return 'nine_box_rating';
    }
}
