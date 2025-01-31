<?php

namespace Database\Factories;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\Mentorship;
use App\Enums\MoveInterest;
use App\Enums\NotificationFamily;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\PositionDuration;
use App\Enums\ProvinceOrTerritory;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Collection;
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

        $availableNotificationFamilies = array_filter(array_column(NotificationFamily::cases(), 'name'), function ($family) {
            return $family !== NotificationFamily::SYSTEM_MESSAGE->name;
        });

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
            'work_email' => $isGovEmployee ? $this->faker->firstName().'_'.$this->faker->unique()->userName().'@gc.ca' : null,
            'department' => $isGovEmployee && $randomDepartment ? $randomDepartment->id : null,
            'current_classification' => $isGovEmployee && $randomClassification ? $randomClassification->id : null,
            'is_woman' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'has_diploma' => $this->faker->boolean(90),
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
            'enabled_email_notifications' => $this->faker->optional->randomElements($availableNotificationFamilies, null),
            'enabled_in_app_notifications' => $this->faker->optional->randomElements($availableNotificationFamilies, null),
        ];
    }

    /**
     * Add an experience with skills to the user
     *
     * @param  User  $user  The user to atttach the experience to
     * @param  Collection<UserSkill>  $skills  The skills assigned to this experience
     * @param  Factory<AwardExperience | CommunityExperience | EducationExperience | PersonalExperience | WorkExperience>  $factory  Define a specific factory to use
     */
    private function createExperienceAndSyncSkills(User $user, Collection $skills, ?Factory $factory = null)
    {
        $experienceFactories = [
            AwardExperience::factory(['user_id' => $user->id]),
            CommunityExperience::factory(['user_id' => $user->id]),
            EducationExperience::factory(['user_id' => $user->id]),
            PersonalExperience::factory(['user_id' => $user->id]),
            WorkExperience::factory(['user_id' => $user->id]),
        ];

        $factory ??= $this->faker->randomElement($experienceFactories);

        $experience = $factory->create();
        $skillsForExperience = $this->faker->randomElements($skills, $this->faker->numberBetween(1, $skills->count()));
        $syncDataExperience = array_map(function ($skill) {
            return ['id' => $skill->id, 'details' => $this->faker->text()];
        }, $skillsForExperience);

        $experience->syncSkills($syncDataExperience);
    }

    public function withSkillsAndExperiences($count = 10, $skills = [])
    {
        return $this->afterCreating(function (User $user) use ($count, $skills) {
            $userSkills = $this->getUserSkills($user, $count, $skills);
            $this->createExperienceAndSyncSkills($user, $userSkills);
        });
    }

    /**
     * Is government employee.
     */
    public function asGovEmployee($isGovEmployee = true, $isVerified = true)
    {
        return $this->state(function () use ($isGovEmployee, $isVerified) {
            if (! $isGovEmployee) {
                return [
                    'is_gov_employee' => false,
                    'work_email' => null,
                    'current_classification' => null,
                    'gov_employee_type' => null,
                    'department' => null,

                ];
            }
            $randomClassification = Classification::inRandomOrder()->first();
            $randomDepartment = Department::inRandomOrder()->first();

            return [
                'is_gov_employee' => true,
                'work_email' => $this->faker->firstName().'_'.$this->faker->unique()->userName().'@gc.ca',
                'work_email_verified_at' => $isVerified ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
                'current_classification' => $randomClassification ? $randomClassification->id : null,
                'gov_employee_type' => $this->faker->randomElement(GovEmployeeType::cases())->name,
                'department' => $randomDepartment ? $randomDepartment->id : null,

            ];
        })->afterCreating(function (User $user) use ($isGovEmployee) {
            if (! $isGovEmployee) {
                return;
            }

            // Government employee counts as an user who has a work experience with
            //  - an employment type of government of Canada or Canadian armed forces and,
            //  - that experience has no end date (is current)
            $userSkills = $this->getUserSkills($user);
            $factory = WorkExperience::factory([
                'user_id' => $user->id,
                'end_date' => null,
                'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
            ]);
            $this->createExperienceAndSyncSkills($user, $userSkills, $factory);
        });
    }

    public function withEmployeeProfile()
    {
        return $this->afterCreating(function (User $user) {
            $community = Community::inRandomOrder()->first();
            if (is_null($community)) {
                $community = Community::factory()->withWorkStreams()->create();
            }
            $classification = Classification::inRandomOrder()->first();
            if (is_null($classification)) {
                $classification = Classification::factory()->create();
            }
            $workStream = $this->faker->randomElement($community->workStreams);
            $departments = Department::inRandomOrder()->limit($this->faker->numberBetween(1, 3))->get();

            $user->employeeProfile->dreamRoleDepartments()->sync($departments);

            $user->employeeProfile()->update([
                'career_planning_organization_type_interest' => $this->faker->randomElements(array_column(OrganizationTypeInterest::cases(), 'name'), null),
                'career_planning_move_interest' => $this->faker->randomElements(array_column(MoveInterest::cases(), 'name'), null),
                'career_planning_mentorship_status' => $this->faker->optional(weight: 70)->randomElements(array_column(Mentorship::cases(), 'name'), null),
                'career_planning_mentorship_interest' => $this->faker->optional(weight: 70)->randomElements(array_column(Mentorship::cases(), 'name'), null),
                'career_planning_exec_interest' => $this->faker->boolean(),
                'career_planning_exec_coaching_status' => $this->faker->optional(weight: 80)->randomElements(array_column(ExecCoaching::cases(), 'name'), null),
                'career_planning_exec_coaching_interest' => $this->faker->optional(weight: 80)->randomElements(array_column(ExecCoaching::cases(), 'name'), null),
                'career_planning_about_you' => $this->faker->paragraph(),
                'career_planning_career_goals' => $this->faker->paragraph(),
                'career_planning_learning_goals' => $this->faker->paragraph(),
                'career_planning_work_style' => $this->faker->paragraph(),
                'dream_role_title' => $this->faker->words(3, true),
                'dream_role_additional_information' => $this->faker->paragraph(),
                'dream_role_community_id' => $community->id,
                'dream_role_classification_id' => $classification->id,
                'dream_role_work_stream_id' => $workStream?->id,
            ]);
        });
    }

    public function withCommunityInterests(array $communityIds)
    {
        return $this->afterCreating(function (User $user) use ($communityIds) {
            foreach ($communityIds as $communityId) {
                CommunityInterest::factory()
                    ->withWorkStreams()
                    ->withDevelopmentProgramInterests()
                    ->create([
                        'user_id' => $user->id,
                        'community_id' => $communityId,
                    ]);
            }
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

    /**
     * Attach the process operator role to a user after creation.
     *
     * @param  string|array  $poolId  Id of the pool or pools to attach the role to
     * @return $this
     */
    public function asProcessOperator(string|array $poolId)
    {
        return $this->afterCreating(function (User $user) use ($poolId) {
            if (is_array($poolId)) {
                foreach ($poolId as $singlePoolId) {
                    $pool = Pool::find($singlePoolId);
                    $pool->addProcessOperators($user->id);
                }
            } else {
                $pool = Pool::find($poolId);
                $pool->addProcessOperators($user->id);
            }
        });
    }

    /**
     * Attach the community recruiter role to a user after creation.
     *
     * @param  string|array  $communityId  Id of the community or communities to attach the role to
     * @return $this
     */
    public function asCommunityRecruiter(string|array $communityId)
    {
        return $this->afterCreating(function (User $user) use ($communityId) {
            if (is_array($communityId)) {
                foreach ($communityId as $singleCommunityId) {
                    $community = Community::find($singleCommunityId);
                    $community->addCommunityRecruiters($user->id);
                }
            } else {
                $community = Community::find($communityId);
                $community->addCommunityRecruiters($user->id);
            }
        });
    }

    /**
     * Attach the community admin role to a user after creation.
     *
     * @param  string|array  $communityId  Id of the community or communities to attach the role to
     * @return $this
     */
    public function asCommunityAdmin(string|array $communityId)
    {
        return $this->afterCreating(function (User $user) use ($communityId) {
            if (is_array($communityId)) {
                foreach ($communityId as $singleCommunityId) {
                    $community = Community::find($singleCommunityId);
                    $community->addCommunityAdmins($user->id);
                }
            } else {
                $community = Community::find($communityId);
                $community->addCommunityAdmins($user->id);
            }
        });
    }

    /**
     * Get skills for use in experiences
     *
     * @param  User  $user  The user to connect skills to
     * @param  int  $count  Number of user skills to return
     * @param  array  $skills  A list of skills to get from.
     *                         If not provided, uses all available skills
     * @return Collection<UserSkill>
     */
    private function getUserSkills(User $user, $count = 10, array $skills = [])
    {
        $allSkills = $skills;
        if (empty($skills)) {
            $allSkills = Skill::select('id')->whereDoesntHave('userSkills', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->inRandomOrder()->take($count)->get();
        }
        $skillSequence = $allSkills->shuffle()->map(fn ($skill) => ['skill_id' => $skill['id']])->toArray();

        $userSkills = UserSkill::factory($count)->for($user)
            ->sequence(...$skillSequence)
            ->create();

        return $userSkills->map(fn ($us) => $us->skill);

    }
}
