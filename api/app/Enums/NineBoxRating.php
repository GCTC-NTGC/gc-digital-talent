<?php

namespace App\Enums;

enum NineBoxRating
{
    case LOW;
    case MEDIUM;
    case HIGH;

    public static function getLangFilename(): string
    {
        return 'nine_box_rating';
    }
}
