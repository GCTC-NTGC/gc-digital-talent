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
 * The trait automatically seeds faker with seed 0 in setUp().
 * Call seedFaker($seed) to re-seed with a specific value if needed.
 */
trait SeededFaker
{
    /**
     * Seed the global Faker instance in Laravel's container.
     *
     * @param  int  $seed  The seed value for reproducible random data
     */
    protected function seedFaker(int $seed = 0): void
    {
        // Seed the Faker instance in the container that factories use
        $faker = app(FakerGenerator::class);
        $faker->seed($seed);
    }

    /**
     * Boot the SeededFaker trait.
     * This is called automatically by Laravel's testing framework.
     */
    protected function setUpSeededFaker(): void
    {
        $this->seedFaker(0);
    }
}
