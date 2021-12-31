<?php

namespace Database\Factories;

use App\Models\Classification;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Classification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;
        return [
            'group' => $faker->name,
            'name' => ['en' => $faker->name, 'fr' => $faker->name],
            'level' => $faker->numberBetween(0,5),
            'min_salary' => $faker->numberBetween(0,1000),
            'max_salary' => $faker->numberBetween(1000,10000),
        ];
    }
}
