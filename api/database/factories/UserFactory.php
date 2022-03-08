<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Classification;
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
        $evaluatedLanguageAbility = [
            'X',
            'A',
            'B',
            'C',
            'E',
            'P',
        ];

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail,
            //'sub' => filled in User::creating event
            'telephone' => $this->faker->e164PhoneNumber(),
            'preferred_lang' => $this->faker->randomElement(['en', 'fr']),
            'roles' => [],
            'job_looking_status' => $this->faker->randomElement([
                'ACTIVELY_LOOKING',
                'OPEN_TO_OPPORTUNITIES',
                'INACTIVE',
            ]),
            'current_province' => $this->faker->randomElement([
                'BRITISH_COLUMBIA',
                'ALBERTA',
                'SASKATCHEWAN',
                'MANITOBA',
                'ONTARIO',
                'QUEBEC',
                'NEW_BRUNSWICK',
                'NOVA_SCOTIA',
                'PRINCE_EDWARD_ISLAND',
                'NEWFOUNDLAND_AND_LABRADOR',
                'YUKON',
                'NORTHWEST_TERRITORIES',
                'NUNAVUT',
            ]),
            'current_city' => $this->faker->city(),
            'looking_for_english' => $this->faker->boolean(),
            'looking_for_french' => $this->faker->boolean(),
            'looking_for_bilingual' => $this->faker->boolean(),
            'bilingual_evaluation' => $this->faker->optional->randomElement([
                'COMPLETED_ENGLISH',
                'COMPLETED_FRENCH',
                'NOT_COMPLETED',
            ]),
            'comprehension_level' => $this->faker->randomElement(
                $evaluatedLanguageAbility
            ),
            'written_level' => $this->faker->randomElement(
                $evaluatedLanguageAbility
            ),
            'verbal_level' => $this->faker->randomElement(
                $evaluatedLanguageAbility
            ),
            'estimated_language_ability' => $this->faker->optional->randomElement([
                'BEGINNER',
                'INTERMEDIATE',
                'ADVANCED'
            ]),
            'is_gov_employee' => $this->faker->boolean(),
            'interested_in_later_or_secondment' => $this->faker->boolean(),
            'current_classification' => Classification::factory(),
        ];
    }
}
