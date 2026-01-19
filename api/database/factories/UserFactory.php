<?php

namespace Database\Factories;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\Mentorship;
use App\Enums\NotificationFamily;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\PositionDuration;
use App\Enums\ProvinceOrTerritory;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Enums\WfaInterest;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\Experience;
use App\Models\OffPlatformRecruitmentProcess;
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
            'preferred_lang' => $this->faker->randomElement(Language::cases())->toLower(),
            'preferred_language_for_interview' => $this->faker->randomElement(Language::cases())->toLower(),
            'preferred_language_for_exam' => $this->faker->randomElement(Language::cases())->toLower(),
            'current_province' => $this->faker->randomElement(ProvinceOrTerritory::cases())->name,
            'current_city' => $this->faker->city(),
            'looking_for_english' => $lookingEnglish,
            'looking_for_french' => $lookingFrench,
            'looking_for_bilingual' => $lookingBilingual,
            'first_official_language' => $lookingBilingual ?
                $this->faker->randomElement(Language::cases())->toLower()
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
            'computed_is_gov_employee' => $isGovEmployee,
            'work_email' => $isGovEmployee ? $this->faker->firstName().'_'.$this->faker->unique()->userName().'@gc.ca' : null,
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
            'flexible_work_locations' => $this->faker->randomElements(
                array_column(FlexibleWorkLocation::cases(), 'name'),
                $this->faker->numberBetween(1, 3)
            ),
            'location_exemptions' => "{$this->faker->city()}, {$this->faker->city()}, {$this->faker->city()}",
            'position_duration' => $this->faker->boolean() ?
                array_column(PositionDuration::cases(), 'name')
                : [PositionDuration::PERMANENT->name], // always accepting PERMANENT
            'accepted_operational_requirements' => $this->faker->optional->randomElements(array_column(OperationalRequirement::cases(), 'name'), 2),
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
            'off_platform_recruitment_processes' => $this->faker->optional->paragraph(7),
        ];
    }

    /**
     * Sync user skills to an experience
     *
     * @param  Experience  $experience  The experience to attach the skills to
     * @param  Collection<UserSkill>  $skills  The skills assigned to this experience
     */
    private function syncSkillsToExperience(Experience $experience)
    {
        $skills = $this->getUserSkills($experience->user);
        $skillsForExperience = $this->faker->randomElements($skills, $this->faker->numberBetween(1, $skills->count()));
        $syncDataExperience = array_map(function ($skill) {
            return ['id' => $skill->id, 'details' => $this->faker->text()];
        }, $skillsForExperience);

        $experience->syncSkills($syncDataExperience);
    }

    /**
     * Set certain fields and create related models based on not being a gov employee
     */
    public function withNonGovProfile()
    {
        return $this->state(function () {
            return [
                'work_email' => null,
                'computed_is_gov_employee' => false,
                'computed_classification' => null,
                'computed_gov_employee_type' => null,
                'computed_gov_position_type' => null,
                'computed_gov_end_date' => null,
                'computed_department' => null,
                'computed_gov_role' => null,

            ];
        })->afterCreating(function (User $user) {
            // Don't include work experience to avoid it being government
            $experienceFactories = [
                AwardExperience::factory(['user_id' => $user->id]),
                CommunityExperience::factory(['user_id' => $user->id]),
                EducationExperience::factory(['user_id' => $user->id]),
                PersonalExperience::factory(['user_id' => $user->id]),
            ];
            $experience = $this->faker->randomElement($experienceFactories)->create();
            $this->syncSkillsToExperience($experience);

            OffPlatformRecruitmentProcess::factory()
                ->count(3)
                ->create([
                    'user_id' => $user->id,
                ]);
        });
    }

    /**
     * Set certain fields and create related models based on being a gov employee
     */
    public function withGovEmployeeProfile()
    {
        return $this->state(function () {
            $randomClassification = Classification::inRandomOrder()->first();
            $randomDepartment = Department::inRandomOrder()->first();

            return [
                'work_email' => $this->faker->firstName().'_'.$this->faker->unique()->userName().'@gc.ca',
                'work_email_verified_at' => $this->faker->dateTimeBetween('2010-01-01', '2019-12-31')->format('Y-m-d'),
                'computed_is_gov_employee' => true,
                'computed_classification' => $randomClassification ? $randomClassification->id : null,
                'computed_department' => $randomDepartment ? $randomDepartment->id : null,
                'computed_gov_employee_type' => $this->faker->randomElement(GovEmployeeType::cases())->name,
                'computed_gov_position_type' => $this->faker->randomElement(GovPositionType::cases())->name,
                'computed_gov_end_date' => $this->faker->dateTimeBetween('2030-01-01', '2039-12-31')->format('Y-m-d'),
                'computed_gov_role' => $this->faker->jobTitle(),
            ];
        })->afterCreating(function (User $user) {
            // Government employee counts as an user who has a work experience with
            //  - an employment type of government of Canada or Canadian armed forces and,
            //  - that experience has no end date (is current)
            $experience = WorkExperience::factory([
                'user_id' => $user->id,
                'end_date' => null,
                'employment_category' => EmploymentCategory::GOVERNMENT_OF_CANADA->name,
                'gov_employment_type' => $this->faker->randomElement([
                    GovEmployeeType::INDETERMINATE->name,
                    GovEmployeeType::TERM->name,
                ]),
            ])->asSubstantive()->create();

            $this->syncSkillsToExperience($experience);

            $user->wfa_interest = $this->faker->randomElement(WfaInterest::cases())->name;
            $user->wfa_date = $this->faker->dateTimeBetween('2028-01-01', '2029-12-31')->format('Y-m-d');
            $user->saveQuietly();

            OffPlatformRecruitmentProcess::factory()
                ->count(3)
                ->create([
                    'user_id' => $user->id,
                ]);

            // Fill employee profile data
            $lateralMoveInterestBool = $this->faker->boolean();
            $promotionMoveInterestBool = $this->faker->boolean();
            $retirementYearKnownBool = $this->faker->boolean();

            $nextRoleCommunity = $this->faker->boolean(80) ?
                Community::inRandomOrder()->firstOr(fn () => Community::factory()->withWorkStreams()->create()) :
                null;
            $careerObjectiveCommunity = $this->faker->boolean(80) ?
                Community::inRandomOrder()->firstOr(fn () => Community::factory()->withWorkStreams()->create()) :
                null;

            $nextRoleTargetRole = $this->faker->randomElement(array_column(TargetRole::cases(), 'name'));
            $careerObjectiveTargetRole = $this->faker->randomElement(array_column(TargetRole::cases(), 'name'));

            $nextRoleIsCSuite = $this->faker->boolean(40);
            $careerObjectiveIsCSuite = $this->faker->boolean(40);

            $user->employeeProfile->nextRoleDepartments()
                ->sync(Department::inRandomOrder()->limit($this->faker->numberBetween(1, 3))->get('id'));
            $user->employeeProfile->careerObjectiveDepartments()
                ->sync(Department::inRandomOrder()->limit($this->faker->numberBetween(1, 3))->get('id'));

            if (isset($nextRoleCommunity)) {
                $user->employeeProfile->nextRoleWorkStreams()
                    ->sync($this->faker->randomElements(
                        $nextRoleCommunity
                            ->workStreams
                            ->pluck('id'),
                        $this->faker->numberBetween(0, $nextRoleCommunity->workStreams->count())
                    ));
            }
            if (isset($careerObjectiveCommunity)) {
                $user->employeeProfile->careerObjectiveWorkStreams()
                    ->sync($this->faker->randomElements(
                        $careerObjectiveCommunity
                            ->workStreams
                            ->pluck('id'),
                        $this->faker->numberBetween(0, $careerObjectiveCommunity->workStreams->count())
                    ));
            }

            $user->employeeProfile()->update([
                'career_planning_lateral_move_interest' => $lateralMoveInterestBool,
                'career_planning_lateral_move_time_frame' => $lateralMoveInterestBool ? $this->faker->randomElement(array_column(TimeFrame::cases(), 'name')) : null,
                'career_planning_lateral_move_organization_type' => $lateralMoveInterestBool ? $this->faker->randomElements(array_column(OrganizationTypeInterest::cases(), 'name')) : null,
                'career_planning_promotion_move_interest' => $promotionMoveInterestBool,
                'career_planning_promotion_move_time_frame' => $promotionMoveInterestBool ? $this->faker->randomElement(array_column(TimeFrame::cases(), 'name')) : null,
                'career_planning_promotion_move_organization_type' => $promotionMoveInterestBool ? $this->faker->randomElements(array_column(OrganizationTypeInterest::cases(), 'name')) : null,
                'career_planning_mentorship_status' => $this->faker->optional(weight: 70)->randomElements(array_column(Mentorship::cases(), 'name'), null),
                'career_planning_mentorship_interest' => $this->faker->optional(weight: 70)->randomElements(array_column(Mentorship::cases(), 'name'), null),
                'career_planning_exec_interest' => $this->faker->boolean(),
                'career_planning_exec_coaching_status' => $this->faker->optional(weight: 80)->randomElements(array_column(ExecCoaching::cases(), 'name'), null),
                'career_planning_exec_coaching_interest' => $this->faker->optional(weight: 80)->randomElements(array_column(ExecCoaching::cases(), 'name'), null),
                'career_planning_about_you' => $this->faker->paragraph(),
                'career_planning_learning_goals' => $this->faker->paragraph(),
                'career_planning_work_style' => $this->faker->paragraph(),
                'next_role_job_title' => $this->faker->words(3, true),
                'career_objective_job_title' => $this->faker->words(3, true),
                'next_role_additional_information' => $this->faker->paragraph(),
                'career_objective_additional_information' => $this->faker->paragraph(),
                'next_role_community_id' => isset($nextRoleCommunity) ? $nextRoleCommunity->id : null,
                'career_objective_community_id' => isset($careerObjectiveCommunity) ? $careerObjectiveCommunity->id : null,
                'next_role_community_other' => ! isset($nextRoleCommunity) ? $this->faker->company() : null,
                'career_objective_community_other' => ! isset($careerObjectiveCommunity) ? $this->faker->company() : null,
                'eligible_retirement_year_known' => $retirementYearKnownBool,
                'eligible_retirement_year' => $retirementYearKnownBool ? $this->faker->dateTimeBetween('2030-01-01', '2049-12-31')->format('Y-m-d') : null,

                'next_role_classification_id' => Classification::inRandomOrder()->firstOr(fn () => Classification::factory()->create())->id,
                'career_objective_classification_id' => Classification::inRandomOrder()->firstOr(fn () => Classification::factory()->create())->id,

                'next_role_target_role' => $nextRoleTargetRole,
                'career_objective_target_role' => $careerObjectiveTargetRole,
                'next_role_target_role_other' => $nextRoleTargetRole === TargetRole::OTHER->name
                        ? $this->faker->words(3, true)
                        : null,
                'career_objective_target_role_other' => $careerObjectiveTargetRole === TargetRole::OTHER->name
                        ? $this->faker->words(3, true)
                        : null,

                'next_role_is_c_suite_role' => $nextRoleIsCSuite,
                'career_objective_is_c_suite_role' => $careerObjectiveIsCSuite,
                'next_role_c_suite_role_title' => $nextRoleIsCSuite ? $this->faker->randomElement(array_column(CSuiteRoleTitle::cases(), 'name')) : null,
                'career_objective_c_suite_role_title' => $careerObjectiveIsCSuite ? $this->faker->randomElement(array_column(CSuiteRoleTitle::cases(), 'name')) : null,
            ]);
        });
    }

    public function withCommunityInterests(array $communityIds, bool $consent = true)
    {
        return $this->afterCreating(function (User $user) use ($communityIds, $consent) {
            foreach ($communityIds as $communityId) {
                CommunityInterest::factory()
                    ->withWorkStreams()
                    ->withDevelopmentProgramInterests()
                    ->create([
                        'consent_to_share_profile' => $consent,
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
     * Attach the community talent coordinator role to a user after creation.
     *
     * @param  string|array  $communityId  Id of the community or communities to attach the role to
     * @return $this
     */
    public function asCommunityTalentCoordinator(string|array $communityId)
    {
        return $this->afterCreating(function (User $user) use ($communityId) {
            if (is_array($communityId)) {
                foreach ($communityId as $singleCommunityId) {
                    $community = Community::find($singleCommunityId);
                    $community->addCommunityTalentCoordinator($user->id);
                }
            } else {
                $community = Community::find($communityId);
                $community->addCommunityTalentCoordinator($user->id);
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
        $availableSkills = collect($skills);

        if ($availableSkills->isEmpty()) {
            $availableSkills = Skill::whereDoesntHave('userSkills', fn ($q) => $q->where('user_id', $user->id))
                ->inRandomOrder()
                ->take($count)
                ->get();

            $toCreate = $count - $availableSkills->count();
            if ($toCreate > 0) {
                $createdSkills = Skill::factory($toCreate)->create();
                $availableSkills = $availableSkills->concat($createdSkills);
            }
        }

        $availableSkills = $availableSkills->filter(fn ($s) => $s && $s->id)->shuffle()->take($count);

        if ($availableSkills->isEmpty()) {
            throw new \LogicException('No skills available to attach to user.');
        }

        $userSkills = collect();
        foreach ($availableSkills as $skill) {
            $userSkills->push(UserSkill::factory()->for($user)->create([
                'skill_id' => $skill->id,
            ]));
        }

        return $userSkills->map(fn ($us) => $us->skill);

    }
}
