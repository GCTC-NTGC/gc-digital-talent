<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * BaseFactory
 *
 * Abstract base for Laravel model factories providing common utility helpers:
 */
abstract class BaseFactory extends Factory
{
    /**
     * Generate a localized string array for 'en' and 'fr' locales.
     * Uses a faker method or provided string for both locales, and can suffix with locale.
     *
     * @param  string|null  $value  If provided, used for both locales.
     * @param  string|null  $method  Faker method for string generation (default: 'sentence'). Examples: 'word', 'company', 'paragraph'.
     * @param  bool  $suffixLocale  If true, appends the locale string (" (en)", " (fr)") to each value.
     *
     * @phpstan-param string|null $value
     * @phpstan-param string|null $method
     * @phpstan-param bool $suffixLocale
     *
     * @return array{en: string, fr: string}
     *
     * @phpstan-return array{en: string, fr: string}
     *
     * @throws \InvalidArgumentException If `$method` is not available in Faker or its providers.
     */
    protected function localizedString(?string $value = null, ?string $method = 'sentence', ?bool $suffixLocale = true): array
    {
        $faker = $this->faker;

        if ($value !== null) {
            return [
                'en' => $suffixLocale ? "{$value} (en)" : $value,
                'fr' => $suffixLocale ? "{$value} (fr)" : $value,
            ];
        }

        try {
            $base = $faker->$method();
        } catch (\Throwable $e) {
            throw new \InvalidArgumentException("Faker method '{$method}' does not exist or isn't provided: {$e->getMessage()}");
        }

        return [
            'en' => $suffixLocale ? "{$base} (en)" : $base,
            'fr' => $suffixLocale ? "{$base} (fr)" : $base,
        ];
    }

    /**
     * Return a random model instance or create one if none exist.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $model  Eloquent model class name
     *
     * @phpstan-template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @phpstan-param class-string<TModel> $model
     *
     * @return TModel
     *
     * @phpstan-return TModel
     */
    protected function firstOrCreate(string $model)
    {
        return $model::inRandomOrder()->firstOr(fn () => $model::factory()->create());
    }

    /**
     * Pick one or more random names from a pure Enum's case list.
     *
     * Returns a single string (case name) for $count=1, or an array of strings for $count > 1.
     *
     * @template TEnum of \UnitEnum
     *
     * @param  class-string<TEnum>  $enumClass  Pure Enum class name
     * @param  int  $count  Number of names to return. Returns string for 1, string[] for >1.
     *
     * @phpstan-template TEnum of \UnitEnum
     *
     * @phpstan-param class-string<TEnum> $enumClass
     * @phpstan-param int $count
     *
     * @return string|string[]
     *
     * @phpstan-return ( $count is 1 ? string : list<string> )
     */
    protected function randomEnum(string $enumClass, int $count = 1)
    {
        $names = array_map(fn ($case) => $case->name, $enumClass::cases());
        $picked = (array) $this->faker->randomElements($names, min($count, count($names)));

        return $count === 1 ? $picked[0] : $picked;
    }
}
