<?php

namespace App\Faker;

use Faker\Provider\Base;

class ExtendedFormatsProvider extends Base
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
    public function localizedString(?string $value = null, ?string $method = 'sentence', ?bool $suffixLocale = true): array
    {
        $faker = $this->generator;

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
     * Pick a single random name from a pure Enum case list.
     *
     * @template TEnum of \UnitEnum
     *
     * @param  class-string<TEnum>  $enumClass
     *
     * @phpstan-template TEnum of \UnitEnum
     *
     * @phpstan-param class-string<TEnum> $enumClass
     *
     * @phpstan-return string
     */
    public function enum(string $enumClass): string
    {
        $names = array_map(fn ($case) => $case->name, $enumClass::cases());

        return $this->generator->randomElement($names);
    }

    /**
     * Pick multiple random names from a pure Enum case list.
     *
     * @template TEnum of \UnitEnum
     *
     * @param  class-string<TEnum>  $enumClass
     *
     * @phpstan-template TEnum of \UnitEnum
     *
     * @phpstan-param class-string<TEnum> $enumClass
     * @phpstan-param int $count
     *
     * @phpstan-return list<string>
     */
    public function enums(string $enumClass, int $count = 2): array
    {
        $names = array_map(fn ($case) => $case->name, $enumClass::cases());

        return $this->generator->randomElements($names, min($count, count($names)));
    }
}
