<?php

namespace App\Traits;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

trait HasLocalization
{
    abstract public static function getLangFilename(): string;

    public static function caseKey(string $case)
    {
        // Some backed enums are not uppercase
        $enumCase = strtoupper($case);

        return Str::lower(constant("self::$enumCase")->name);
    }

    public static function localizedString(string $value)
    {
        $key = sprintf(
            '%s.%s',
            self::getLangFilename(),
            self::caseKey($value)
        );

        return [
            'en' => Lang::get($key, [], 'en'),
            'fr' => Lang::get($key, [], 'fr'),
        ];
    }
}
