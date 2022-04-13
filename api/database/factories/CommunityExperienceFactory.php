<?php

namespace Database\Factories;

use App\Models\CommunityExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityExperienceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CommunityExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->jobTitle(),
            'organization' => $this->faker->company(),
            'project' => $this->faker->bs(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->boolean() ? $this->faker->date() : null,
            'details' => $this->faker->text(),
        ];
    }
}
