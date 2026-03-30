<?php

namespace Database\Factories;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Models\AwardExperience;
use App\Models\User;
use App\Traits\ExperienceFactoryWithSkills;
use Illuminate\Database\Eloquent\Factories\Factory;

class AwardExperienceFactory extends Factory
{
    use ExperienceFactoryWithSkills;

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
        $awardedTo = $this->faker->randomElement(array_column(AwardedTo::cases(), 'name'));

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'issued_by' => $this->faker->company(),
            'awarded_date' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
            'awarded_to' => $awardedTo,
            'awarded_scope' => $this->faker->randomElement(array_column(AwardedScope::cases(), 'name')),
            'details' => $this->faker->text(),
            'project_name' => $awardedTo === AwardedTo::MY_PROJECT->name ? $this->faker->words(3, true) : null
        ];
    }
}
