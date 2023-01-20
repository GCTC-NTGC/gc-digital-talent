<?php

namespace Database\Factories;

use App\Models\AwardExperience;
use App\Models\User;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\GenericJobTitle;
use App\Models\PersonalExperience;
use App\Models\Skill;
use App\Models\WorkExperience;
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
        $hasPriorityEntitlement = $this->faker->boolean(10);
        $hasBeenEvaluated = $this->faker->boolean();
        $isDeclared = $this->faker->boolean();

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'sub' => $this->faker->boolean(75) ? $this->faker->unique()->uuid() : null,
            'telephone' => $this->faker->e164PhoneNumber(),
            'preferred_lang' => $this->faker->randomElement(['en', 'fr']),
            'preferred_language_for_interview' => $this->faker->randomElement(['en', 'fr']),
            'preferred_language_for_exam' => $this->faker->randomElement(['en', 'fr']),

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
            'department' => $isGovEmployee && $randomDepartment ? $randomDepartment->id : null,
            'current_classification' => $randomClassification ? $randomClassification->id : null,
            'is_woman' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'has_diploma' => $this->faker->boolean(90), // temporary fix for Cypress workflows
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
            'position_duration' => $this->faker->boolean() ?
                [ApiEnums::POSITION_DURATION_PERMANENT, ApiEnums::POSITION_DURATION_TEMPORARY]
                : [ApiEnums::POSITION_DURATION_PERMANENT], // always accepting PERMANENT
            'accepted_operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'gov_employee_type' => $this->faker->randomElement(ApiEnums::govEmployeeTypes()),
            'citizenship' => $this->faker->randomElement(ApiEnums::citizenshipStatuses()),
            'armed_forces_status' => $this->faker->randomElement(ApiEnums::armedForcesStatuses()),
            'has_priority_entitlement' => $hasPriorityEntitlement,
            'priority_number' => $hasPriorityEntitlement? $this->faker->word() : null,
            'indigenous_declaration_signature' => $isDeclared ? $this->faker->firstName() : null,
            'indigenous_communities' => $isDeclared ? [$this->faker->randomElement(ApiEnums::indigenousCommunities())] : [],
            // mirroring migration where isIndigenous = false maps to []
        ];
    }

    public function activelyLooking()
    {
        return $this->state(function () {
            return [
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING
            ];
        });
    }

    /**
     * GenericJobTitleSeeder must have already been run.
     */
    public function withExpectedGenericJobTitles()
    {
        return $this->afterCreating(function (User $user) {
            $user->expectedGenericJobTitles()->saveMany(
                GenericJobTitle::inRandomOrder()->take(3)->get()
            );
        });
    }

    public function withExperiences($count = 10)
    {
        $types = [
            AwardExperience::factory(),
            CommunityExperience::factory(),
            EducationExperience::factory(),
            PersonalExperience::factory(),
            WorkExperience::factory(),
        ];
        return $this->afterCreating(function (User $user) use ($types, $count) {
            for($i = 0; $i < $count; $i++) {
                $type = $this->faker->randomElement($types);
                $type->create([
                    'user_id' => $user->id,
                ]);
            }
        });
    }

    /**
     * Skills must have already been generated.
     */
    public function withSkills($count = 10)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // If user has no experiences yet, create one.
            if (!$user->experiences->count()) {
                WorkExperience::factory()->create(['user_id' => $user->id]);
                $user->refresh();
            }
            // Tale $count random skills and assign each to a random experience of this user.
            foreach(Skill::inRandomOrder()->take($count)->get() as $skill) {
                $experience = $this->faker->randomElement($user->experiences);
                $experience->skills()->save($skill);
            }
        });
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $user->expectedGenericJobTitles()->saveMany(
                GenericJobTitle::inRandomOrder()->take(1)->get()
            );
        });
    }
}
