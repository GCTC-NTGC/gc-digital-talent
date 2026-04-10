<?php

namespace Tests;

use Faker\Factory as FakerFactory;
use Faker\Generator as FakerGenerator;

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
     */
    protected function seedFaker(int $seed = 1): FakerGenerator
    {
        $faker = FakerFactory::create(config('app.faker_locale', 'en_US'));
        $faker->seed($seed);

        // Rebind the seeded faker to the container so all factories use it
        $this->app->instance(FakerGenerator::class, $faker);

        return $faker;
    }
}
