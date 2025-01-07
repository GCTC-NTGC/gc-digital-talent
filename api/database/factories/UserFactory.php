<?php

namespace Database\Factories;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
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
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;

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
                'current_classification' => $randomClassification ? $randomClassification->id : null,
                'gov_employee_type' => $this->faker->randomElement(GovEmployeeType::cases())->name,
                'department' => $randomDepartment ? $randomDepartment->id : null,

            ];
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
                'dream_role_work_stream_id' => $workStream->id,
            ]);
        });
    }

    public function withCommunityInterests(int $limit = 3, int $workStreamLimit = 3)
    {
        $count = $this->faker->numberBetween(1, $limit);
        $workStreamCount = $this->faker->numberBetween(1, $workStreamLimit);

        return $this->afterCreating(function (User $user) use ($count, $workStreamCount) {
            CommunityInterest::factory()->withWorkStreams($workStreamCount)->count($count)
                ->state(new Sequence(fn () => ['community_id' => Community::factory()->withWorkStreams()->create()]))
                ->create([
                    'user_id' => $user->id,
                ]);
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
     * Attach the manager role to a user after creation.
     *
     * @return $this
     */
    public function asManager()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('manager');
        });
    }
}
