<?php

namespace Database\Factories;

use App\Models\PersonalExperience;
use App\Models\User;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonalExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PersonalExperience::class;

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
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->text(),
            'start_date' => $startDate,
            'end_date' => $this->faker->boolean() ? $this->faker->dateTimeBetween($startDate) : null,
            'details' => $this->faker->text(),
        ];
    }
}
