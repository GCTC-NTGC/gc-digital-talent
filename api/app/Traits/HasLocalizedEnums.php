<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait HasLocalizedEnums
{
    protected function localizeEnum(?string $value, $enum)
    {
        if (! $value || ! method_exists($enum, 'localizedString')) {
            // It implements `HasLocalization`, the value is just null
            if ($value) {
                Log::warning("$enum is not localized.");
            }

            return $value;
        }

        return [
            // Need to convert backed Language enum back to case
            'value' => strtoupper($value),
            'label' => $enum::localizedString($value),
        ];
    }

    protected function localizeEnumArray(?array $values, $enum)
    {
        if (! $values) {
            return $values;
        }

        return array_map(function ($value) use ($enum) {
            return $this->localizeEnum($value, $enum);
        }, $values);
    }
}
