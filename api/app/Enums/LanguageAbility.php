<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum LanguageAbility
{
    use HasLocalization;

    case ENGLISH;
    case FRENCH;
    case BILINGUAL;

    public static function getLangFilename(): string
    {
        return 'language_ability';
    }
}
