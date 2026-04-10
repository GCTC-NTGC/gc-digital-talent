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
     * 2. Forget any existing binding and re-bind as instance
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
        // Replace the entire array with just our seeded faker
        $property->setValue(null, [$locale => $faker]);

        // Get the container - need to use the same instance factories use
        $container = Container::getInstance();

        // Remove any existing binding/singleton/instance
        $container->forgetInstance(FakerGenerator::class);
        if ($container->bound(FakerGenerator::class)) {
            // Use reflection to remove the binding
            $bindingsProperty = new \ReflectionProperty($container, 'bindings');
            $bindingsProperty->setAccessible(true);
            $bindings = $bindingsProperty->getValue($container);
            unset($bindings[FakerGenerator::class]);
            $bindingsProperty->setValue($container, $bindings);
        }

        // Now bind our seeded faker as a singleton instance
        $container->instance(FakerGenerator::class, $faker);

        // Also bind to $this->app for any direct resolution in tests
        $this->app->forgetInstance(FakerGenerator::class);
        $this->app->instance(FakerGenerator::class, $faker);

        return $faker;
    }
}
