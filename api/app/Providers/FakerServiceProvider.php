<?php

namespace App\Providers;

use App\Faker\LocalizedStringProvider;
use Faker\Factory;
use Faker\Generator;
use Illuminate\Support\ServiceProvider;

class FakerServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Generator::class, function () {
            $faker = Factory::create();
            $faker->addProvider(new LocalizedStringProvider($faker));

            return $faker;
        });
    }
}
