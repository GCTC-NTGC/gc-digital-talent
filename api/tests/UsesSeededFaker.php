<?php

namespace Tests;

use Faker\Factory as FakerFactory;
use Faker\Generator as FakerGenerator;
use Illuminate\Database\DatabaseServiceProvider;
use ReflectionClass;

/**
 * Trait to seed the Faker instance in Laravel's container.
 *
 * This ensures ALL factory calls (including nested factories) use the
 * same seeded Faker instance, producing deterministic output regardless
 * of the number or order of faker calls.
 *
 * Usage in snapshot tests:
 *   use UsesSeededFaker;
 *
 *   protected function setUp(): void
 *   {
 *       parent::setUp();
 *       $this->seedFaker(12345);
 *       // ... rest of setup
 *   }
 */
trait UsesSeededFaker
{
    /**
     * Seed the Faker instance bound to Laravel's container.
     *
     * This replaces the container's Faker instance with a seeded one,
     * ensuring all factories use deterministic random values.
     *
     * IMPORTANT: Laravel caches Faker instances in a static array inside
     * DatabaseServiceProvider. We must clear that cache before binding
     * our seeded instance.
     */
    protected function seedFaker(int $seed = 1): FakerGenerator
    {
        $locale = config('app.faker_locale', 'en_US');

        // Create seeded faker
        $faker = FakerFactory::create($locale);
        $faker->seed($seed);

        // Clear Laravel's static Faker cache via reflection.
        // DatabaseServiceProvider caches fakers in static::$fakers[$locale]
        // which would bypass our container binding.
        $reflection = new ReflectionClass(DatabaseServiceProvider::class);
        $property = $reflection->getProperty('fakers');
        $property->setAccessible(true);
        $fakers = $property->getValue();
        $fakers[$locale] = $faker;
        $property->setValue(null, $fakers);

        // Also bind to container for any direct resolution
        $this->app->instance(FakerGenerator::class, $faker);

        return $faker;
    }
}
