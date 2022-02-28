<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail,
            //'sub' => filled in User::creating event
            'telephone' => $this->faker->e164PhoneNumber(),
            'preferred_lang' => $this->faker->randomElement(['en', 'fr']),
            'roles' => [],
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            AwardExperience::factory()->count($this->faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            CommunityExperience::factory()->count($this->faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            EducationExperience::factory()->count($this->faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            PersonalExperience::factory()->count($this->faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
            WorkExperience::factory()->count($this->faker->biasedNumberBetween($min = 0, $max = 3,
                $function = 'Faker\Provider\Biased::linearLow'))->for($user)->create();
        });
    }
}
