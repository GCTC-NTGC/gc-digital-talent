<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function tearDown(): void
    {
        // Faker's destructor re-randomises mt_rand, and cycle GC means it can fire
        // after the next test's seed() call. Force it to happen now instead.
        $this->faker = null;
        parent::tearDown();
        gc_collect_cycles();
    }

    protected function makeFaker($locale = null)
    {
        $faker = \Faker\Factory::create();
        $faker->addProvider(new \App\Faker\ExtendedFormatsProvider($faker));
        $this->app->instance(\Faker\Generator::class, $faker);

        return $faker;
    }
}
