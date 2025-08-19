<?php

namespace Database\Factories;

use App\Models\EducationExperience;
use App\Models\User;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class EducationExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EducationExperience::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'institution' => $this->faker->company(),
            'area_of_study' => $this->faker->jobTitle(),
            'thesis_title' => $this->faker->bs(),
            'start_date' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
            'end_date' => fn ($attributes) => $this->faker->optional()->dateTimeBetween($attributes['start_date'], '2019-12-31')?->format('Y-m-d'),
            'type' => $this->faker->randomElement(
                [
                    'DIPLOMA',
                    'BACHELORS_DEGREE',
                    'MASTERS_DEGREE',
                    'PHD',
                    'POST_DOCTORAL_FELLOWSHIP',
                    'ONLINE_COURSE',
                    'CERTIFICATION',
                    'OTHER',
                ]
            ),
            'status' => $this->faker->randomElement(
                [
                    'SUCCESS_CREDENTIAL',
                    'SUCCESS_NO_CREDENTIAL',
                    'IN_PROGRESS',
                    'AUDITED',
                    'DID_NOT_COMPLETE',
                ]
            ),
            'details' => $this->faker->text(),
        ];
    }
}
