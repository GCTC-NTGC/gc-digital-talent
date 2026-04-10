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
 * IMPORTANT: The seed must be reset BEFORE each factory create() call to ensure
 * stability. If any factory definition changes its faker usage (adds/removes calls),
 * it would shift the random sequence for all subsequent factory calls.
 *
 * Usage:
 *   use Tests\SeededFaker;
 *
 *   class MyTest extends TestCase {
 *       use SeededFaker;
 *
 *       public function setUp(): void {
 *           parent::setUp();
 *           // Seed once at start
 *           $this->seedFaker(0);
 *
 *           // Or reseed before each factory for maximum stability
 *           $this->seedFaker(1);
 *           Community::factory()->create();
 *
 *           $this->seedFaker(2);
 *           User::factory()->create();
 *       }
 *   }
 *
 * For snapshot tests, consider using seedFaker() with different seeds before
 * each factory create() to isolate each factory's random sequence.
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
