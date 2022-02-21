<?php

namespace Database\Factories;

use App\Models\AwardExperience;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Eloquent\Factories\Factory;

class AwardExperienceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AwardExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->jobTitle(),
            'issued_by' => $this->faker->company(),
            'awarded_date' => $this->faker->date(),
            'awarded_to' => $this->faker->randomElement(
                [
                    'ME',
                    'MY_TEAM',
                    'MY_PROJECT',
                    'MY_ORGANIZATION',
                ]
            ),
            'awarded_scope' => $this->faker->randomElement(
                [
                    'INTERNATIONAL',
                    'NATIONAL',
                    'PROVINCIAL',
                    'LOCAL',
                    'COMMUNITY',
                    'ORGANIZATIONAL',
                    'SUB_ORGANIZATIONAL',
                ]
            ),
        ];
    }
}
