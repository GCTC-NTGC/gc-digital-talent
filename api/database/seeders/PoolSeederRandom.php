<?php

namespace Database\Seeders;

use App\Models\Pool;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;

class PoolSeederRandom extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Pool::factory()->draft()->create();
        Pool::factory()->count(3)->published()->withAssessments()->create();
        Pool::factory()->closed()->create();
        Pool::factory()->archived()->create();
    }
}
