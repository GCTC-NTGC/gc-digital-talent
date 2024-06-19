<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum Language: string
{
    use HasLocalization;

    case EN = 'en';
    case FR = 'fr';

    public static function getLangFilename(): string
    {
        return 'language';
    }
}
