<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function makeFaker($locale = null)
    {
        return $this->app->make(\Faker\Generator::class);
    }
}
