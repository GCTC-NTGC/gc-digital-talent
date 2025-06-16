<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\LearningOpportunitiesInterest;
use App\Enums\Mentorship;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Enums\WorkRegion;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class UserCsvGenerator extends CsvGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'first_name',
        'last_name',
        'armed_forces_status',
        'citizenship',
        'interested_in_languages',
        'first_official_language',
        'estimated_language_ability',
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
        'government_employee',
        'department',
        'employee_type',
        'work_email',
        'classification',
        'priority_entitlement',
        'priority_number',
        'accept_temporary',
        'accepted_operational_requirements',
        'location_preferences',
        'location_exemptions',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'skills',
        // new columns
        'career_planning_lateral_move_interest',
        'career_planning_lateral_move_time_frame',
        'career_planning_lateral_move_organization_type',
        'career_planning_promotion_move_interest',
        'career_planning_promotion_move_time_frame',
        'career_planning_promotion_move_organization_type',
        'career_planning_learning_opportunities_interest',
        'eligible_retirement_year',
        'career_planning_mentorship_status',
        'career_planning_mentorship_interest',
        'career_planning_exec_interest',
        'career_planning_exec_coaching_status',
        'career_planning_exec_coaching_interest',

        'next_role_target_classification_group',
        'next_role_target_classification_level',
        'next_role_target_role',
        'next_role_is_c_suite_role',
        'next_role_c_suite_role_title',
        'next_role_job_title',
        'next_role_functional_community',

        'next_role_work_streams',
        'next_role_departments',
        'next_role_additional_information',

        'career_objective_target_classification_group',
        'career_objective_target_classification_level',
        'career_objective_target_role',
        'career_objective_is_c_suite_role',
        'career_objective_c_suite_role_title',
        'career_objective_job_title',
        'career_objective_functional_community',

        'career_objective_work_streams',
        'career_objective_departments',

        'career_objective_additional_information',
        'career_planning_about_you',
        'career_planning_learning_goals',
        'career_planning_work_style',

        'digital_talent_processes',
        'off_platform_processes',
    ];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet;

        $sheet = $this->spreadsheet->getActiveSheet();
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $currentUser = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($users) use ($sheet, &$currentUser) {
            foreach ($users as $user) {

                $department = $user->department()->first();
                $preferences = $user->getOperationalRequirements();
                $indigenousCommunities = Arr::where($user->indigenous_communities ?? [], function ($community) {
                    return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
                });
                $userSkills = $user->userSkills->map(function ($userSkill) {
                    return $userSkill->skill->name[$this->lang] ?? '';
                });

                $employeeProfile = $user->employeeProfile;
                $nextRoleWorkStreams = $employeeProfile->nextRoleWorkStreams->map(function ($workStream) {
                    return $workStream->name[$this->lang] ?? '';
                });
                $nextRoleDepartments = $employeeProfile->nextRoleDepartments->map(function ($department) {
                    return $department->name[$this->lang] ?? '';
                });
                $careerObjectiveWorkStreams = $employeeProfile->careerObjectiveWorkStreams->map(function ($workStream) {
                    return $workStream->name[$this->lang] ?? '';
                });
                $careerObjectiveDepartments = $employeeProfile->careerObjectiveDepartments->map(function ($department) {
                    return $department->name[$this->lang] ?? '';
                });

                $appliedPools = $user->poolCandidates->map(function ($candidate) {
                    return $candidate->pool->classification->displayName
                            .' - '
                            .($candidate->pool->name[$this->lang] ?? '')
                            .' - '
                            .$candidate->pool->process_number
                            .' - '
                            .($candidate->suspended_at ? Lang::get('common.not_interested', [], $this->lang) : Lang::get('common.open_to_job_offers', [], $this->lang));
                });

                $values = [
                    $user->first_name, // First name
                    $user->last_name, // Last name
                    $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($user->citizenship, CitizenshipStatus::class),
                    $this->lookingForLanguages($user),
                    $this->localizeEnum($user->first_official_language, Language::class),
                    $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class),
                    $user->second_language_exam_completed ? Lang::get('common.yes', [], $this->lang) : '', // Bilingual evaluation
                    $this->yesOrNo($user->second_language_exam_validity),
                    $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->yesOrNo($user->computed_is_gov_employee), // Government employee
                    $department->name[$this->lang] ?? '', // Department
                    $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class),
                    $user->work_email, // Work email
                    $user->getClassification(), // Current classification
                    $this->yesOrNo($user->has_priority_entitlement), // Priority entitlement
                    $user->priority_number ?? '', // Priority number
                    $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : '', // Accept temporary
                    $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                    $this->localizeEnumArray($user->location_preferences, WorkRegion::class),
                    $user->location_exemptions, // Location exemptions
                    $user->is_woman ? Lang::get('common.yes', [], $this->lang) : '', // Woman
                    $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class),
                    $user->is_visible_minority ? Lang::get('common.yes', [], $this->lang) : '', // Visible minority
                    $user->has_disability ? Lang::get('common.yes', [], $this->lang) : '', // Disability
                    $userSkills->join(', '),
                    // new columns
                    $this->yesOrNo($employeeProfile->career_planning_lateral_move_interest), // Career planning - Lateral move interest
                    $this->localizeEnum($employeeProfile->career_planning_lateral_move_time_frame, TimeFrame::class), // Career planning - Lateral move time frame
                    $this->localizeEnumArray($employeeProfile->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class), // Career planning - Lateral move organization type
                    $this->yesOrNo($employeeProfile->career_planning_promotion_move_interest), // Career planning - Promotion move interest
                    $this->localizeEnum($employeeProfile->career_planning_promotion_move_time_frame, TimeFrame::class), // Career planning - Promotion move time frame
                    $this->localizeEnumArray($employeeProfile->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class), // Career planning - Promotion move organization type
                    $this->localizeEnumArray($employeeProfile->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class), // Career planning - Learning opportunities interest
                    $employeeProfile->eligible_retirement_year ? $employeeProfile->eligible_retirement_year->format('Y') : '', // Eligible retirement year
                    $this->localizeEnumArray($employeeProfile->career_planning_mentorship_status, Mentorship::class), // Career planning - Mentorship status
                    $this->localizeEnumArray($employeeProfile->career_planning_mentorship_interest, Mentorship::class), // Career planning - Mentorship interest
                    $this->yesOrNo($employeeProfile->career_planning_exec_interest), // Career planning - Executive interest
                    $this->localizeEnumArray($employeeProfile->career_planning_exec_coaching_status, ExecCoaching::class), // Career planning - Executive coaching status
                    $this->localizeEnumArray($employeeProfile->career_planning_exec_coaching_interest, ExecCoaching::class), // Career planning - Executive interest
                    $employeeProfile->nextRoleClassification ? $employeeProfile->nextRoleClassification->group : '', // Next role - target classification group
                    $employeeProfile->nextRoleClassification ? $employeeProfile->nextRoleClassification->level : '', // Next role - Target classification level
                    $this->localizeEnum($employeeProfile->next_role_target_role, TargetRole::class), // Next role - Target role
                    $this->yesOrNo($employeeProfile->next_role_is_c_suite_role), // Next role - C-suite role
                    $this->localizeEnum($employeeProfile->next_role_c_suite_role_title, CSuiteRoleTitle::class),
                    $employeeProfile->next_role_job_title, // Next role - Job title
                    $employeeProfile->nextRoleCommunity->name[$this->lang] ?? '', // Next role - Functional community
                    $nextRoleWorkStreams->join(','), // Next role - Work streams
                    $nextRoleDepartments->join(', '), // next role - Departments
                    $employeeProfile->next_role_additional_information, // Next role - Additional information
                    $employeeProfile->careerObjectiveClassification ? $employeeProfile->careerObjectiveClassification->group : '', // Career objective - Target classification group
                    $employeeProfile->careerObjectiveClassification ? $employeeProfile->careerObjectiveClassification->level : '', // Career objective - Target classification level
                    $this->localizeEnum($employeeProfile->career_objective_target_role, TargetRole::class), // Career objective - Target role
                    $this->yesOrNo($employeeProfile->career_objective_is_c_suite_role), // Career objective - C-suite role
                    $this->localizeEnum($employeeProfile->career_objective_c_suite_role_title, CSuiteRoleTitle::class), // Career objective - C-suite role title
                    $employeeProfile->career_objective_job_title, // Career objective - Job title
                    $employeeProfile->careerObjectiveCommunity->name[$this->lang] ?? ' ', // Career objective - Functional community
                    $careerObjectiveWorkStreams->join(', '), // career objective - Work streams
                    $careerObjectiveDepartments->join(', '), // career objective - Departments
                    $employeeProfile->career_objective_additional_information, // Career objective - Additional information
                    $employeeProfile->career_planning_about_you, // Career planning - About you
                    $employeeProfile->career_planning_learning_goals, // Career planning - Learning goals
                    $employeeProfile->career_planning_work_style, // Career planning - Work style
                    $appliedPools->join(', '), // Digital talent processes
                    $user->off_platform_recruitment_processes, // Off-platform processes
                ];

                // 1 is added to the key to account for the header row
                $sheet->fromArray($values, null, sprintf('A%d', $currentUser + 1));
                $currentUser++;
            }
        });

        return $this;
    }

    /**
     * Get looking for languages
     */
    private function lookingForLanguages(User $user): string
    {
        $languages = [];

        if ($user->looking_for_english) {
            $languages[] = $this->localize('language.en');
        }

        if ($user->looking_for_french) {
            $languages[] = $this->localize('language.fr');
        }

        if ($user->looking_for_bilingual) {
            $languages[] = $this->localize('common.bilingual');
        }

        return implode(', ', $languages);
    }

    private function buildQuery()
    {
        $query = User::with([
            'department',
            'currentClassification',
            'userSkills' => ['skill'],
            'employeeProfile',
            'employeeProfile.nextRoleClassification',
            'employeeProfile.careerObjectiveClassification',
            'employeeProfile.nextRoleCommunity',
            'employeeProfile.careerObjectiveCommunity',
            'employeeProfile.nextRoleWorkStreams',
            'employeeProfile.careerObjectiveWorkStreams',
            'employeeProfile.nextRoleDepartments',
            'employeeProfile.careerObjectiveDepartments',
            'poolCandidates' => function ($query) {
                $query->whereAuthorizedToView(['userId' => $this->userId]);
            },
            'poolCandidates.pool',
            'poolCandidates.pool.classification',
        ]);

        $this->applyFilters($query, [
            'roles' => 'roleAssignments',
            'skills' => 'skillsAdditive',
        ]);

        $query->whereAuthorizedToView(['userId' => $this->userId]);

        return $query;

    }
}
