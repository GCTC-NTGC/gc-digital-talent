<?php

namespace Database\Helpers;

class FactoryHelpers
{
    public static function toFakeLocalizedString(string $str): array
    {
        return ['en' => $str.' EN', 'fr' => $str.' FR'];
    }
}
