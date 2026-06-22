<?php

namespace App\Providers;

use App\Faker\ExtendedFormatsProvider;
use Faker\Factory;
use Faker\Generator;
use Illuminate\Support\ServiceProvider;

class FakerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Generator::class, function () {
            $faker = Factory::create();
            $faker->addProvider(new ExtendedFormatsProvider($faker));

            return $faker;
        });
    }
}
