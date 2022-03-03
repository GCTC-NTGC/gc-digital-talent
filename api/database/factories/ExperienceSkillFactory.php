<?php

namespace Database\Factories;

use App\Models\ExperienceSkill;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExperienceSkillFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ExperienceSkill::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'details' => $this->faker->text(),
        ];
    }
}
