<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

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

        // validator for a single localized enum
        $singleEnumValidator = Validator::make($snapshot, [
            $snapshotField.'.value' => 'required|string',
            $snapshotField.'.label.en' => 'nullable|string',
            $snapshotField.'.label.fr' => 'nullable|string',
        ]);
        if ($singleEnumValidator->passes()) {
            return true;
        }

        // validator for an array of localized enums
        $arrayEnumValidator = Validator::make($snapshot, [
            $snapshotField => 'array',
            $snapshotField.'.*.value' => 'required|string',
            $snapshotField.'.*.label.en' => 'nullable|string',
            $snapshotField.'.*.label.fr' => 'nullable|string',
        ]);
        if ($arrayEnumValidator->passes()) {
            return true;
        }

        return false;
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
     * @param  bool  $isLocalizedEnum  If true, this field is a localizedEnum
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
