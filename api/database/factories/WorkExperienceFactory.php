<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkExperience;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = WorkExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $startDate = $this->faker->date();

        return [
            'user_id' => User::factory(),
            'role' => $this->faker->jobTitle(),
            'organization' => $this->faker->company(),
            'division' => $this->faker->bs(),
            'start_date' => $startDate,
            'end_date' => $this->faker->boolean() ? $this->faker->dateTimeBetween($startDate) : null,
            'details' => $this->faker->text(),
        ];
    }
}
