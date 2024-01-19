<?php

namespace Database\Factories;

use App\Enums\ArmedForcesStatus;
use App\Enums\BilingualEvaluation;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\PositionDuration;
use App\Enums\ProvinceOrTerritory;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Skill;
use App\Models\User;
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
        $randomDepartment = Department::inRandomOrder()->first();
        $randomClassification = Classification::inRandomOrder()->first();
        $isGovEmployee = $this->faker->boolean();
        $hasPriorityEntitlement = $this->faker->boolean(10);
        $hasBeenEvaluated = $this->faker->boolean();
        $isDeclared = $this->faker->boolean();

        $lookingEnglish = $this->faker->boolean();
        $lookingFrench = $this->faker->boolean();
        $lookingBilingual = $this->faker->boolean();
        if (! $lookingEnglish && ! $lookingFrench && ! $lookingBilingual) {
            $lookingEnglish = true;
        }

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'sub' => $this->faker->boolean(75) ? $this->faker->unique()->uuid() : null,
            'telephone' => $this->faker->e164PhoneNumber(),
            'preferred_lang' => $this->faker->randomElement(Language::cases())->value,
            'preferred_language_for_interview' => $this->faker->randomElement(Language::cases())->value,
            'preferred_language_for_exam' => $this->faker->randomElement(Language::cases())->value,
            'current_province' => $this->faker->randomElement(ProvinceOrTerritory::cases())->name,
            'current_city' => $this->faker->city(),
            'looking_for_english' => $lookingEnglish,
            'looking_for_french' => $lookingFrench,
            'looking_for_bilingual' => $lookingBilingual,
            'bilingual_evaluation' => $hasBeenEvaluated ? $this->faker->randomElement([
                BilingualEvaluation::COMPLETED_ENGLISH->name,
                BilingualEvaluation::COMPLETED_FRENCH->name,
            ]) : BilingualEvaluation::NOT_COMPLETED->name,

            'comprehension_level' => $hasBeenEvaluated ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
            'written_level' => $hasBeenEvaluated ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
            'verbal_level' => $hasBeenEvaluated ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
            'estimated_language_ability' => $hasBeenEvaluated ?
                null
                : $this->faker->randomElement(EstimatedLanguageAbility::cases())->name,
            'is_gov_employee' => $isGovEmployee,
            'department' => $isGovEmployee && $randomDepartment ? $randomDepartment->id : null,
            'current_classification' => $isGovEmployee && $randomClassification ? $randomClassification->id : null,
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
            'position_duration' => $this->faker->boolean() ?
                array_column(PositionDuration::cases(), 'name')
                : [PositionDuration::PERMANENT->name], // always accepting PERMANENT
            'accepted_operational_requirements' => $this->faker->optional->randomElements(array_column(OperationalRequirement::cases(), 'name'), 2),
            'gov_employee_type' => $isGovEmployee ? $this->faker->randomElement(GovEmployeeType::cases())->name : null,
            'citizenship' => $this->faker->randomElement(CitizenshipStatus::cases())->name,
            'armed_forces_status' => $this->faker->randomElement(ArmedForcesStatus::cases())->name,
            'has_priority_entitlement' => $hasPriorityEntitlement,
            'priority_number' => $hasPriorityEntitlement ? $this->faker->word() : null,
            'indigenous_declaration_signature' => $isDeclared ? $this->faker->firstName() : null,
            'indigenous_communities' => $isDeclared ? [$this->faker->randomElement(IndigenousCommunity::cases())->name] : [],
        ];
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

        return $this->withSkills()->afterCreating(function (User $user) use ($types, $count) {
            for ($i = 0; $i < $count; $i++) {
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
            if (! $user->experiences->count()) {
                WorkExperience::factory()->create(['user_id' => $user->id]);
                $user->refresh();
            }

            // Take $count random skills and assign each to a random experience of this user.
            $skills = Skill::inRandomOrder()->take($count)->get();
            $experience = $this->faker->randomElement($user->experiences);
            $experience->syncSkills($skills);
        });
    }

    /**
     * Is government employee.
     */
    public function asGovEmployee($isGovEmployee = true)
    {
        return $this->state(function () use ($isGovEmployee) {
            if (! $isGovEmployee) {
                return [
                    'is_gov_employee' => false,
                    'current_classification' => null,
                    'gov_employee_type' => null,
                    'department' => null,

                ];
            }
            $randomClassification = Classification::inRandomOrder()->first();
            $randomDepartment = Department::inRandomOrder()->first();

            return [
                'is_gov_employee' => true,
                'current_classification' => $randomClassification ? $randomClassification->id : null,
                'gov_employee_type' => $this->faker->randomElement(GovEmployeeType::cases())->name,
                'department' => $randomDepartment ? $randomDepartment->id : null,

            ];
        });
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('base_user');
        });
    }

    /**
     * Attach the guest role to a user after creation.
     *
     * @return $this
     */
    public function asGuest()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('guest');
        });
    }

    /**
     * Attach the applicant role to a user after creation.
     *
     * @return $this
     */
    public function asApplicant()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('applicant');
        });
    }

    /**
     * Attach the request responder role to a user after creation.
     *
     * @return $this
     */
    public function asRequestResponder()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('request_responder');
        });
    }

    /**
     * Attach the pool operator role to a user after creation.
     *
     * @param  string|array  $team  Name of the team or teams to attach the role to
     * @return $this
     */
    public function asPoolOperator(string|array $team)
    {
        return $this->afterCreating(function (User $user) use ($team) {
            if (is_array($team)) {
                foreach ($team as $singleTeam) {
                    $user->addRole('pool_operator', $singleTeam);
                }
            } else {
                $user->addRole('pool_operator', $team);
            }
        });
    }

    /**
     * Attach the Community Manager role to a user after creation.
     *
     * @return $this
     */
    public function asCommunityManager()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('community_manager');
        });
    }

    /**
     * Attach the admin role to a user after creation.
     *
     * @return $this
     */
    public function asAdmin()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('platform_admin');
        });
    }
}
