<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum Language
{
    use HasLocalization;

    case EN;
    case FR;

    public function localeMatches(?string $locale)
    {
        return strcasecmp($this->name, $locale) == 0;
    }

    public function toLower()
    {
        return strtolower($this->name);
    }

    public static function getLangFilename(): string
    {
        return 'language';
    }
}
