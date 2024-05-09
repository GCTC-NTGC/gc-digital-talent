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
            'group' => $faker->regexify('[A-Z]{2}'),
            'name' => ['en' => $faker->name, 'fr' => $faker->name],
            'level' => $faker->numberBetween(0, 5),
            'min_salary' => $faker->randomElement([50000, 60000, 70000]),
            'max_salary' => $faker->randomElement([80000, 90000, 100000]),
        ];
    }
}
