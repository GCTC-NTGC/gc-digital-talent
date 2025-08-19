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
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->text(),
            'start_date' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
            'end_date' => fn ($attributes) => $this->faker->optional()->dateTimeBetween($attributes['start_date'], '2019-12-31')?->format('Y-m-d'),
            'details' => $this->faker->text(),
        ];
    }
}
