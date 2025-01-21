<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class LocalizedString implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (is_null($value) || $value === '' || $value === 'null') {
            return null;
        }

        $decodedValue = is_array($value) ? $value : json_decode($value, true);
        $locale = App::getLocale() ?? 'en';

        return [
            ...$decodedValue,
            'localized' => $decodedValue[$locale] ?? null,
        ];
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return json_encode($value);
    }
}
