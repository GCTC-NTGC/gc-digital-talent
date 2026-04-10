<?php

namespace Tests;

use Faker\Factory as FakerFactory;
use Faker\Generator as FakerGenerator;
use Illuminate\Container\Container;
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
     * Laravel factories use Container::getInstance()->make(Generator::class)
     * in their withFaker() method. We need to:
     * 1. Clear Laravel's static Faker cache in DatabaseServiceProvider
     * 2. Bind the seeded instance to the container as a singleton
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

        // Bind to the container singleton that factories use.
        // Factories call Container::getInstance()->make(Generator::class)
        // so we need to bind to the Container singleton directly.
        $container = Container::getInstance();
        $container->instance(FakerGenerator::class, $faker);

        // Also bind to $this->app for any direct resolution in tests
        $this->app->instance(FakerGenerator::class, $faker);

        return $faker;
    }
}
