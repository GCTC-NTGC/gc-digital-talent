<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EstimatedLanguageAbility
{
    use HasLocalization;

    case BEGINNER;
    case INTERMEDIATE;
    case ADVANCED;

    public static function getLangFilename(): string
    {
        return 'estimated_language_ability';
    }
}
