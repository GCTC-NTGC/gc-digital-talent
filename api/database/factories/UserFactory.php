<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Classification;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;

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

        $randomDepartment = Department::inRandomOrder()->first();
        $randomClassification = Classification::inRandomOrder()->first();
        $isGovEmployee = $this->faker->boolean();
        $hasBeenEvaluated = $this->faker->boolean();

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'sub' => $this->faker->boolean(75) ? $this->faker->unique()->uuid() : null,
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
            'bilingual_evaluation' => $hasBeenEvaluated ? $this->faker->randomElement([
                    'COMPLETED_ENGLISH',
                    'COMPLETED_FRENCH',
                    ]) : 'NOT_COMPLETED',

            'comprehension_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'written_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'verbal_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'estimated_language_ability' => $hasBeenEvaluated ? null : $this->faker->randomElement([
                'BEGINNER',
                'INTERMEDIATE',
                'ADVANCED'
            ]),
            'is_gov_employee' => $isGovEmployee,
            'interested_in_later_or_secondment' => $this->faker->boolean(),
            'department' => $isGovEmployee && $randomDepartment ? $randomDepartment->id : null,
            'current_classification' => $randomClassification ? $randomClassification->id : null,
            'is_woman' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_indigenous' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'has_diploma' => $this->faker->boolean(),
            'language_ability' => $this->faker->randomElement(['FRENCH', 'ENGLISH', 'BILINGUAL']),
            'location_preferences' => $this->faker->randomElements(
                [
                    'TELEWORK',
                    'NATIONAL_CAPITAL',
                    'ATLANTIC',
                    'QUEBEC',
                    'ONTARIO',
                    'PRAIRIE',
                    'BRITISH_COLUMBIA',
                    'NORTH',
                ],
                3
            ),
            'location_exemptions' => "{$this->faker->city()}, {$this->faker->city()}, {$this->faker->city()}",
            'expected_salary' => $this->faker->randomElements(
                [
                    '_50_59K',
                    '_60_69K',
                    '_70_79K',
                    '_80_89K',
                    '_90_99K',
                    '_100K_PLUS',
                ],
                3
            ),
            'would_accept_temporary' => $this->faker->boolean(),
            'accepted_operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'gov_employee_type' => $this->faker->randomElement(ApiEnums::govEmployeeTypes()),
        ];
    }
}
