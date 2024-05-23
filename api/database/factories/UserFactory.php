<?php

namespace Database\Factories;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\NotificationFamily;
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
use App\Models\UserSkill;
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
        $isDeclared = $this->faker->boolean();

        $lookingEnglish = $this->faker->boolean();
        $lookingFrench = $this->faker->boolean();
        $lookingBilingual = $this->faker->boolean();
        if (! $lookingEnglish && ! $lookingFrench && ! $lookingBilingual) {
            $lookingEnglish = true;
        }

        $examCompleted = $lookingBilingual ? $this->faker->boolean() : null;
        $examValid = $examCompleted ? $this->faker->boolean() : null;
        $examLevels = null;
        if ($examCompleted) {
            $examLevels = true;
        }

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->firstName().'_'.$this->faker->unique()->safeEmail(),
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
            'first_official_language' => $lookingBilingual ?
                $this->faker->randomElement(Language::cases())->value
                : null,
            'estimated_language_ability' => $lookingBilingual ?
                $this->faker->randomElement(EstimatedLanguageAbility::cases())->name
                : null,
            'second_language_exam_completed' => $examCompleted,
            'second_language_exam_validity' => $examValid,
            'comprehension_level' => $examLevels ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
            'written_level' => $examLevels ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
            'verbal_level' => $examLevels ?
                $this->faker->randomElement(EvaluatedLanguageAbility::cases())->name
                : null,
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
            'armed_forces_status' => $this->faker->boolean() ?
                ArmedForcesStatus::NON_CAF->name
                : $this->faker->randomElement(ArmedForcesStatus::cases())->name,
            'has_priority_entitlement' => $hasPriorityEntitlement,
            'priority_number' => $hasPriorityEntitlement ? $this->faker->word() : null,
            'indigenous_declaration_signature' => $isDeclared ? $this->faker->firstName() : null,
            'indigenous_communities' => $isDeclared ? [$this->faker->randomElement(IndigenousCommunity::cases())->name] : [],
            'ignored_email_notifications' => $this->faker->optional->randomElements(array_column(NotificationFamily::cases(), 'name'), null),
            'ignored_in_app_notifications' => $this->faker->optional->randomElements(array_column(NotificationFamily::cases(), 'name'), null),
        ];
    }

    private function createExperienceAndSyncSkills($user, $skills)
    {
        $experienceFactories = [
            AwardExperience::factory(['user_id' => $user->id]),
            CommunityExperience::factory(['user_id' => $user->id]),
            EducationExperience::factory(['user_id' => $user->id]),
            PersonalExperience::factory(['user_id' => $user->id]),
            WorkExperience::factory(['user_id' => $user->id]),
        ];

        $experience = $this->faker->randomElement($experienceFactories)->create();
        $skillsForExperience = $this->faker->randomElements($skills, $this->faker->numberBetween(1, $skills->count()));
        $syncDataExperience = array_map(function ($skill) {
            return ['id' => $skill->id, 'details' => $this->faker->text()];
        }, $skillsForExperience);

        $experience->syncSkills($syncDataExperience);
    }

    public function withSkillsAndExperiences($count = 10, $skills = [])
    {
        if (empty($skills)) {
            $allSkills = Skill::select('id')->inRandomOrder()->take($count)->get();
        } else {
            $allSkills = $skills;
        }
        $allSkills = Skill::select('id')->inRandomOrder()->take($count)->get();

        return $this->afterCreating(function (User $user) use ($count, $allSkills) {
            $skillSequence = $allSkills->shuffle()->map(fn ($skill) => ['skill_id' => $skill['id']])->toArray();

            $userSkills = UserSkill::factory($count)->for($user)
                ->sequence(...$skillSequence)
                ->create();
            $skills = $userSkills->map(fn ($us) => $us->skill);

            $this->createExperienceAndSyncSkills($user, $skills);
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
