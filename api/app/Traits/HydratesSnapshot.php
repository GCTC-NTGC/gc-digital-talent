<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * Helpers for hydrating models from a snapshot
 */
trait HydratesSnapshot
{
    /**
     * Hydrate a snapshot
     *
     * @param  mixed  $snapshot  The snapshot being hydrated
     * @return Model|Collection Either the hydrated model or a collection of hydrated models
     */
    abstract public static function hydrateSnapshot(mixed $snapshot): Model|array;

    public static function isFieldLocalizedEnum(mixed $snapshot, mixed $snapshotField): bool
    {
        if (! isset($snapshot[$snapshotField]) || is_string($snapshot[$snapshotField])) {
            return false;
        }

        $value = $snapshot[$snapshotField];

        // a single localized enum
        if (self::isLocalizedEnumValue($value)) {
            return true;
        }

        // an array of localized enums
        return is_array($value) && array_all($value, fn ($item) => self::isLocalizedEnumValue($item));
    }

    // Plain checks, not a Validator: this runs for every field of every snapshot
    private static function isLocalizedEnumValue(mixed $item): bool
    {
        if (! is_array($item) || ! is_string($item['value'] ?? null) || trim($item['value']) === '') {
            return false;
        }

        foreach (['en', 'fr'] as $locale) {
            $label = data_get($item, 'label.'.$locale);
            if (! is_null($label) && ! is_string($label)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Hydrates a assoc array of fields on the model ffApp
     *
     * @param  mixed  $snapshot  The snapshot being hydrated
     * @param  array  $fields  Assoc array of fields to be hydrated
     *                         ['model_attribute' => 'snapshotKey']
     * @param  Model  $model  The model being hydrated
     * @return Model The hydrated model
     */
    public static function hydrateFields(mixed $snapshot, array $fields, Model $model): Model
    {
        foreach ($fields as $attribute => $snapshotField) {
            $isLocalizedEnum = self::isFieldLocalizedEnum($snapshot, $snapshotField);
            if ($hydratedField = self::hydrateField($snapshot, $snapshotField, $isLocalizedEnum)) {
                $model->$attribute = $hydratedField;
            }
        }

        return $model;
    }

    /**
     * Hydrates a specific field from a snapshot
     *
     * @param  mixed  $snapshot  The snapshot being hydrated
     * @param  string  $key  The key of the field from the snapshot to hydrate
     * @param  bool  $localizedEnum  If true, this field is a localizedEnum
     * @return mixed|null
     */
    public static function hydrateField(mixed $snapshot, string $key, bool $localizedEnum = false)
    {
        if (! isset($snapshot[$key])) {
            return null;
        }

        $value = $snapshot[$key];
        if ($localizedEnum) {
            if (Arr::isList($value)) {
                $value = array_map(function ($item) {
                    return isset($item['value']) ? $item['value'] : null;
                }, $value);
            } else {
                $value = $value['value'];
            }
        }

        return $value ?? null;
    }
}
