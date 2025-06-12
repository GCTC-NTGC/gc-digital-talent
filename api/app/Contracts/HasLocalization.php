<?php

namespace App\Contracts;

interface HasLocalization
{
    public static function getLangFilename(): string;

    public static function localizedString(string $value, ?string $parentKey = null): array;
}
