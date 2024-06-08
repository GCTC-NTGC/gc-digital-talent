<?php

namespace App\Traits;

use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;

trait HasLocalization
{
    abstract public static function getLangFilename(): string;

    public static function caseKey(string $case)
    {
        return Str::lower(constant("self::$case")->name);
    }

    public static function localizedString(string $value, ?string $intermediaryKey)
    {
        $key = sprintf(
            '%s%s.%s',
            self::getLangFilename(),
            $intermediaryKey ? '.'.$intermediaryKey : '',
            self::caseKey($value)
        );

        return [
            'en' => Lang::get($key, [], 'en'),
            'fr' => Lang::get($key, [], 'fr'),
        ];
    }
}
