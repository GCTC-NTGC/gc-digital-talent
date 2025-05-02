<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum Language
{
    use HasLocalization;

    case EN;
    case FR;

    public static function getLangFilename(): string
    {
        return 'language';
    }
}
