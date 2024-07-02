<?php

namespace App\Traits;

trait HasLocalizedEnums
{
    protected function localizeEnum(?string $value, $enum)
    {
        if (! $value || is_object($enum) || ! method_exists($enum, 'localizedString')) {
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
