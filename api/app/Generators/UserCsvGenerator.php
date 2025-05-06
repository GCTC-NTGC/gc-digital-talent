<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\Classification;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\LearningOpportunitiesInterest;
use App\Enums\Mentorship;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\TimeFrame;
use App\Enums\WorkRegion;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
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
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
        'estimated_language_ability',
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

        // TODO: check
        'next_role_target_classification_group', // next role - target classification group
        'next_role_target_classification_level', // Next role - Target classification level
        'next_role_target_role',
        'next_role_is_c_suite_role',
        'next_role_c_suite_role_title',
        'next_role_job_title',

        // TODO: check
        'next_role_functional_community', // Next role - Functional community:

        // TODO: Implement
        'next_role_work_streams', // Next role - Work streams
        'next_role_departments', // Next role - Departments

        'next_role_additional_information',

        // TODO: check
        'career_objective_target_classification_group', // career objective - target classification group
        'career_objective_target_classification_level', // career objective -target classification level
        'career_objective_target_role',
        'career_objective_is_c_suite_role',
        'career_objective_c_suite_role_title',
        'career_objective_job_title',

        // TODO: check
        'career_objective_functional_community', // Career objective - Functional community

        // TODO: Implement
        'career_objective_work_streams', // Career objective - Work streams
        'career_objective_work_departments', // Career objective - Departments

        'career_objective_additional_information',
        'career_planning_about_you',
        'career_planning_learning_goals',
        'career_planning_work_style',
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

                $values = [
                    $user->first_name, // First name
                    $user->last_name, // Last name
                    $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($user->citizenship, CitizenshipStatus::class),
                    $this->lookingForLanguages($user),
                    $this->localizeEnum($user->first_official_language, Language::class),
                    is_null($user->second_language_exam_completed) ? '' : $this->yesOrNo($user->second_language_exam_completed), // Bilingual evaluation
                    $this->yesOrNo($user->second_language_exam_validity),
                    $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class),
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
                    $this->yesOrNo($user->is_woman), // Woman
                    $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class),
                    $this->yesOrNo($user->is_visible_minority), // Visible minority
                    $this->yesOrNo($user->has_disability), // Disability
                    $userSkills->join(', '),
                    // new columns
                    $this->yesOrNo($user->career_planning_lateral_move_interest),
                    $this->localizeEnum($user->career_planning_lateral_move_time_frame, TimeFrame::class),
                    $this->localizeEnumArray($user->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class),
                    $this->yesOrNo($user->career_planning_promotion_move_interest),
                    $this->localizeEnum($user->career_planning_promotion_move_time_frame, TimeFrame::class),
                    $this->localizeEnumArray($user->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class),
                    $this->localizeEnumArray($user->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class),
                    $user->eligible_retirement_year ? $user->eligible_retirement_year->format('Y') : '',
                    $this->localizeEnumArray($user->career_planning_mentorship_status, Mentorship::class),
                    $user->career_planning_mentorship_interest,
                    $this->yesOrNo($user->career_planning_exec_interest),
                    $this->localizeEnumArray($user->career_planning_exec_coaching_status, Mentorship::class),
                    $user->career_planning_exec_coaching_interest,

                    // TODO: check
                    $user->employeeProfile->next_role_target_classification_group->group[$this->lang] ?? '', // next role - target classification group
                    $user->employeeProfile->next_role_target_classification_level->level[$this->lang] ?? '', // next role - target classification level

                    $user->employeeProfile->next_role_target_role,
                    $this->yesOrNo($user->next_role_is_c_suite_role),
                    $user->next_role_c_suite_role_title,
                    $user->next_role_job_title,

                    // TODO: check
                    $user->employeeProfile->next_role_functional_community->name[$this->lang] ?? '', // Next role - Functional community
                    // next role - Work streams
                    // next role - Departments

                    $user->next_role_additional_information,

                    // TODO: check
                    $user->career_objective_target_classification_group->group[$this->lang] ?? '', // Career objective - Target classification group
                    $user->career_objective_target_classification_level->level[$this->lang] ?? '', // Career objective - Target classification level

                    $user->career_objective_target_role,
                    $this->yesOrNo($user->career_objective_is_c_suite_role),
                    $user->career_objective_c_suite_role_title,
                    $user->career_objective_job_title,

                    // TODO: check
                    $user->career_objective_functional_community->name[$this->lang] ?? '',
                    // career objective - Work streams
                    // career objective - Departments

                    $user->career_objective_additional_information,
                    $user->career_planning_about_you,
                    $user->career_planning_learning_goals,
                    $user->career_planning_work_style,
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
        ]);

        $this->applyFilters($query, [
            'roles' => 'roleAssignments',
            'skills' => 'skillsAdditive',
        ]);

        /** @var Builder<User> $query */
        $query->authorizedToView(['userId' => $this->userId]);

        return $query;

    }
}
