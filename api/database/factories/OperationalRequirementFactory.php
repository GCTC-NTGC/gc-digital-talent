<?php

namespace Database\Factories;

use App\Models\OperationalRequirement;
use Illuminate\Database\Eloquent\Factories\Factory;

class OperationalRequirementFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OperationalRequirement::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;
        return [
            'key' => $faker->unique()->word,
            'name' => ['en' => $faker->name, 'fr' => $faker->name],
        ];
    }
}
