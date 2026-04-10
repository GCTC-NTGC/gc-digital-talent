<?php

namespace Tests;

use Faker\Generator as FakerGenerator;

/**
 * Trait for seeding Faker globally to ensure stable, reproducible test data.
 *
 * This trait seeds the Faker instance in Laravel's container, ensuring all
 * factories use the same seeded random sequence. This is essential for snapshot
 * tests where any change to factory faker usage could cause false positive diffs.
 *
 * Usage:
 *   use Tests\SeededFaker;
 *
 *   class MyTest extends TestCase {
 *       use SeededFaker;
 *       // ...
 *   }
 *
 * The seedFaker() method should be called in setUp() after parent::setUp().
 * This seeds the container's Faker instance that all factories share.
 */
trait SeededFaker
{
    /**
     * Seed the global Faker instance in Laravel's container.
     *
     * Call this method in setUp() to ensure all factories produce
     * reproducible data. Must be called after parent::setUp().
     *
     * @param  int  $seed  The seed value for reproducible random data
     */
    protected function seedFaker(int $seed = 0): void
    {
        // Seed the Faker instance in the container that factories use
        $faker = app(FakerGenerator::class);
        $faker->seed($seed);
    }
}
