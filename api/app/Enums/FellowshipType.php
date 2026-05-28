<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum FellowshipType
{
    use HasLocalization;

    case POST_DOCTORAL;
    case INDUSTRY;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'fellowship_type';
    }
}
