<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CafEmploymentType;
use App\Enums\CafRank;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\DepartmentSize;
use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\ExperienceType;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\FinanceChiefDuty;
use App\Enums\FinanceChiefRole;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\HiringPlatform;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\LearningOpportunitiesInterest;
use App\Enums\Mentorship;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\ProvinceOrTerritory;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Enums\WorkRegion;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\EducationExperience;
use App\Models\ExperienceSkill;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\WorkExperience;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'armed_forces_status',
        'citizenship',
        'current_city',
        'current_province',
        'preferred_communication_language',
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
        'flexible_work_locations',
        'location_exemptions',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'skills',

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
        'off_platform_processes_not_verified',
    ];

    protected array $careerExperienceLocaleKeys = [
        'id',
        'first_name',
        'last_name',
        'experience_type',
        'start_date',
        'end_date',
        'is_current',
        'number_of_months',
        'role_or_title',
        'organization_department',
        'employment_category',
        'team_group',
        'size_external_organization',
        'seniority_external_organization',
        'gc_employment_type',
        'gov_position_type',
        'classification',
        'gc_management_or_supervisory_status',
        'gc_number_of_supervised_employees',
        'gc_annual_budget_allocation',
        'c_suite_title',
        'other_c_suite_title',
        'caf_employment_type',
        'caf_rank_category',
        'work_streams',
        'type_of_education',
        'area_of_study',
        'education_status',
        'thesis_title',
        'community_project_or_product',
        'personal_learning_experience_description',
        'award_recipient',
        'issuing_org',
        'awarded_scope',
        'date_awarded',
        'additional_details',
        'featured_skills',
        'klc_achieve_results',
        'klc_character_leadership',
        'klc_collaborate_with_partners_and_stakeholders',
        'klc_create_vision_and_strategy',
        'klc_mobilize_people',
        'klc_promote_innovation_and_guide_change',
        'klc_uphold_integrity_and_respect',
        'department_number',
        'department_size',
        'department_type',
    ];

    protected array $communityInterestLocaleKeys1 = [
        'id',
        'first_name',
        'last_name',
        'community_interest',
        'job_interest',
        'training_interest',
        'work_streams',
        'additional_info',
    ];

    protected array $communityInterestLocaleKeys2 = [
        'cfo_status',
        'additional_duties',
        'other_roles',
        'other_sdo_position',
    ];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet;

        // Users sheet
        $usersSheet = $this->spreadsheet->getActiveSheet();
        $usersSheet->setTitle(Lang::get('headings.user', [], $this->lang));

        // Create Career Experience sheet
        $careerSheet = $this->spreadsheet->createSheet();
        $careerSheet->setTitle(Lang::get('headings.career_experience', [], $this->lang));

        // Create Community Interest sheet
        $interestSheet = $this->spreadsheet->createSheet();
        $interestSheet->setTitle(Lang::get('headings.community_interest', [], $this->lang));

        // Generate data for all sheets
        $this->generateUsersSheet($usersSheet);
        $this->generateCareerExperienceSheet($careerSheet);
        $this->generateCommunityInterestSheet($interestSheet);

        return $this;
    }

    // store user ids while generating users sheet
    private array $userIds = [];

    /**
     * Generate data for Users sheet
     */
    private function generateUsersSheet(Worksheet $sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $currentUser = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($users) use ($sheet, &$currentUser) {
            foreach ($users as $user) {
                $this->userIds[] = $user->id;
                $rowData = $this->buildUserRowData($user);
                $sheet->fromArray($rowData, null, sprintf('A%d', $currentUser + 1));
                $currentUser++;
            }
        });
    }

    /**
     * Generate data for Career Experience sheet
     */
    private function generateCareerExperienceSheet(Worksheet $sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->careerExperienceLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $userIds = $this->userIds;

        if (empty($userIds)) {
            return;
        }

        $this->addExperiencesToSheet($sheet, $userIds);
    }

    /**
     * Add experiences to Career Experience sheet
     */
    private function addExperiencesToSheet(Worksheet $sheet, array $userIds): void
    {
        $currentRow = 2;

        $this->addWorkExperiences($sheet, $userIds, $currentRow);
        $this->addEducationExperiences($sheet, $userIds, $currentRow);
        $this->addAwardExperiences($sheet, $userIds, $currentRow);
        $this->addCommunityExperiences($sheet, $userIds, $currentRow);
        $this->addPersonalExperiences($sheet, $userIds, $currentRow);
    }

    /**
     * Build user row data
     */
    private function buildUserRowData(User $user): array
    {
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
            return sprintf(
                '%s - %s - %s - %s',
                $candidate->pool->classification->formattedGroupAndLevel,
                $candidate->pool->name[$this->lang] ?? '',
                $candidate->pool->process_number,
                $candidate->suspended_at
                    ? Lang::get('common.not_interested', [], $this->lang)
                    : Lang::get('common.open_to_job_offers', [], $this->lang)
            );
        });

        $offPlatformProcesses = collect($user->offPlatformRecruitmentProcesses)->map(function ($process) {
            return $process->classification->formattedGroupAndLevel
                    .(is_null($process->department) ? '' : ' '.$this->localize('common.with').' '.($process->department->name[$this->lang] ?? ''))
                    .' ('
                    .($process->platform === HiringPlatform::OTHER->name ? $process->platform_other : $this->localizeEnum($process->platform, HiringPlatform::class))
                    .' - '
                    .$process->process_number
                    .')';
        });

        return [
            $user->id,
            $user->first_name,
            $user->last_name,
            $user->email ?? '',
            $user->telephone ?? '',
            $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class),
            $this->localizeEnum($user->citizenship, CitizenshipStatus::class),
            $user->current_city ?? '',
            $this->localizeEnum($user->current_province, ProvinceOrTerritory::class),
            $this->localizeEnum($user->preferred_lang, Language::class),
            $this->lookingForLanguages($user),
            $this->localizeEnum($user->first_official_language, Language::class),
            $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class),
            $this->yesOrNo($user->second_language_exam_completed), // Bilingual evaluation
            $this->yesOrNo($user->second_language_exam_validity), // Bilingual exam validity
            $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
            $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class), // Writing level
            $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
            $this->yesOrNo($user->computed_is_gov_employee), // Government employee
            $department?->name[$this->lang] ?? '', // Department
            $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class),
            $user->work_email, // Work email
            $user->getClassification(), // Current classification
            $this->yesOrNo($user->has_priority_entitlement), // Priority entitlement
            $user->priority_number ?? '', // Priority number
            $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : '', // Accept temporary
            $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
            /* remove 'Telework' from location preferences */
            $this->localizeEnumArray(
                array_filter($user->location_preferences ?? [], function ($location) {
                    return $location !== WorkRegion::TELEWORK->name;
                }),
                WorkRegion::class
            ), // Location preferences
            $this->localizeEnumArray($user->flexible_work_locations, FlexibleWorkLocation::class), // flexible work locations
            $user->location_exemptions, // Location exemptions
            $this->yesOrNo($user->is_woman),
            $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class),
            $this->yesOrNo($user->is_visible_minority), // Visible minority
            $this->yesOrNo($user->has_disability), // Disability
            $userSkills->join(', '),
            $this->yesOrNo($employeeProfile?->career_planning_lateral_move_interest), // Career planning - Lateral move interest
            $this->localizeEnum($employeeProfile?->career_planning_lateral_move_time_frame, TimeFrame::class), // Career planning - Lateral move time frame
            $this->localizeEnumArray($employeeProfile?->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class),  // Career planning - Lateral move organization type
            $this->yesOrNo($employeeProfile?->career_planning_promotion_move_interest), // Career planning Promotion move interest
            $this->localizeEnum($employeeProfile?->career_planning_promotion_move_time_frame, TimeFrame::class),  // Career planning - Promotion move time frame
            $this->localizeEnumArray($employeeProfile?->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class), // Career planning - Promotion move organization type
            $this->localizeEnumArray($employeeProfile?->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class), // Career planning - Learning opportunities interest
            $employeeProfile?->eligible_retirement_year?->format('Y') ?? '', // Eligible retirement year
            $this->localizeEnumArray($employeeProfile?->career_planning_mentorship_status, Mentorship::class), // Career planning - Mentorship status
            $this->localizeEnumArray($employeeProfile?->career_planning_mentorship_interest, Mentorship::class), // Career planning - Mentorship interest
            $this->yesOrNo($employeeProfile?->career_planning_exec_interest), // Career planning - Executive interest
            $this->localizeEnumArray($employeeProfile?->career_planning_exec_coaching_status, ExecCoaching::class), // Career planning - Executive coaching status
            $this->localizeEnumArray($employeeProfile?->career_planning_exec_coaching_interest, ExecCoaching::class), // Career planning - Executive interest
            $employeeProfile?->nextRoleClassification?->group ?? '', // Next role - target classification group
            $employeeProfile?->nextRoleClassification?->level ?? '', // Next role - Target classification level
            $this->localizeEnum($employeeProfile?->next_role_target_role, TargetRole::class), // Next role - Target role
            $this->yesOrNo($employeeProfile?->next_role_is_c_suite_role), // Next role - C-suite role
            $this->localizeEnum($employeeProfile?->next_role_c_suite_role_title, CSuiteRoleTitle::class),
            $employeeProfile?->next_role_job_title ?? '', // Next role - Job title
            $employeeProfile?->nextRoleCommunity?->name[$this->lang] ?? '', // Next role - Functional community
            $nextRoleWorkStreams->join(','), // Next role - Work streams
            $nextRoleDepartments->join(', '), // next role - Departments
            $employeeProfile?->next_role_additional_information ?? '', // Next role - Additional information
            $employeeProfile?->careerObjectiveClassification?->group ?? '', // Career objective - Target classification group
            $employeeProfile?->careerObjectiveClassification?->level ?? '', // Career objective - Target classification level
            $this->localizeEnum($employeeProfile?->career_objective_target_role, TargetRole::class), // Career objective - Target role
            $this->yesOrNo($employeeProfile?->career_objective_is_c_suite_role), // Career objective - C-suite role
            $this->localizeEnum($employeeProfile?->career_objective_c_suite_role_title, CSuiteRoleTitle::class), // Career objective - C-suite role title
            $employeeProfile?->career_objective_job_title ?? '', // Career objective - Job title
            $employeeProfile?->careerObjectiveCommunity?->name[$this->lang] ?? ' ', // Career objective - Functional community
            $careerObjectiveWorkStreams->join(', '), // career objective - Work streams
            $careerObjectiveDepartments->join(', '), // career objective - Departments
            $employeeProfile?->career_objective_additional_information ?? '', // Career objective - Additional information
            $employeeProfile?->career_planning_about_you ?? '', // Career planning - About you
            $employeeProfile?->career_planning_learning_goals ?? '',  // Career planning - Learning goals
            $employeeProfile?->career_planning_work_style ?? '', // Career planning - Work style
            $appliedPools->join(', '), // Digital talent processes
            $offPlatformProcesses->join(', '), // Off-platform processes
        ];
    }

    /**
     * Add work experiences to career experience sheet
     */
    private function addWorkExperiences(Worksheet $sheet, array $userIds, int &$currentRow): void
    {
        WorkExperience::whereIn('user_id', $userIds)
            ->with(['user', 'department', 'classification', 'userSkills.skill', 'workStreams'])
            ->chunk(200, function ($experiences) use ($sheet, &$currentRow) {
                foreach ($experiences as $exp) {
                    $rowData = $this->buildWorkExperienceRow($exp);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Get localized experience type for an experience
     */
    private function getExperienceType($experience): string
    {
        return match (get_class($experience)) {
            WorkExperience::class => $this->localizeEnum(ExperienceType::WORK->name, ExperienceType::class),
            EducationExperience::class => $this->localizeEnum(ExperienceType::EDUCATION->name, ExperienceType::class),
            AwardExperience::class => $this->localizeEnum(ExperienceType::AWARD->name, ExperienceType::class),
            CommunityExperience::class => $this->localizeEnum(ExperienceType::COMMUNITY->name, ExperienceType::class),
            PersonalExperience::class => $this->localizeEnum(ExperienceType::PERSONAL->name, ExperienceType::class),
            default => '',
        };
    }

    /**
     * Build work experience row
     */
    private function buildWorkExperienceRow(WorkExperience $exp): array
    {
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);
        $workStreams = $this->getWorkStreams($exp);
        [$departmentNumber, $departmentSize, $departmentType] = $this->getDepartmentInfo($exp);

        return [
            $exp->user->id, // user id
            $exp->user->first_name, // first name
            $exp->user->last_name, // last name
            $this->getExperienceType($exp),  // experience type
            $exp->start_date ? $exp->start_date->format('Y-m') : '', // start date
            $exp->end_date ? $exp->end_date->format('Y-m') : '', // end date
            $isCurrent, // currently active
            $numberOfMonths, // number of months calculated number of months based on the start and end date or start date and date of download for current experiences
            $exp->role ?? '', // Role or title: My role (work experience), My role (Community participation), Personal experience short title, Award title
            $exp->organization ?? '', // Organization, department, military force, or institution: Organization (external), Department (GC), Military force (CAF), Education institution, Group, organization, or community, Issuing organization
            $this->localizeEnum($exp->employment_category, EmploymentCategory::class),  // Employment category
            $exp->division ?? '', // team, group, division
            $this->localizeEnum($exp->ext_size_of_organization, ExternalSizeOfOrganization::class), // size external organization
            $this->localizeEnum($exp->ext_role_seniority, ExternalRoleSeniority::class), // seniority external organization
            $this->localizeEnum($exp->gov_employment_type, GovEmployeeType::class), // gc employment type
            $this->localizeEnum($exp->gov_position_type, GovPositionType::class), // gc position type
            $exp->classification?->group.($exp->classification?->level ? '-'.$exp->classification->level : ''), // Classification: group-level
            $this->yesOrNo($exp->supervisory_position), // gc management or supervisory status: Yes, No, empty
            $exp->supervised_employees_number ?? '', // GC number of supervised employees
            $exp->annual_budget_allocation ?? '', // GC annual budget allocation
            $this->localizeEnum($exp->c_suite_role_title, CSuiteRoleTitle::class), // GC C-suite role
            $exp->other_c_suite_title ?? '', // Other C-suite role title
            $this->localizeEnum($exp->caf_employment_type, CafEmploymentType::class), // CAF employment type
            $this->localizeEnum($exp->caf_rank, CafRank::class), // CAF rank category
            $workStreams, // Work streams: work streams linked to the experience separated by commas
            // Education fields - empty for work
            '', // 25: type_of_education
            '', // 26: area_study
            '', // 27: education_status
            '', // 28: thesis_title

            // Community/Personal fields - empty for work
            '', // 29: community_project_or_product
            '', // 30: personal_learning_experience_description

            // Award fields - empty for work
            '', // 31: award_recipient
            '', // 32: issuing_org
            '', // 33: awarded_scope
            '', // 34: date_awarded
            $exp->details ?? '',
            $this->getFeaturedSkills($exp),
            $this->getFeaturedSkillJustification($exp, 'achieve_results'), // achieve_results
            $this->getFeaturedSkillJustification($exp, 'character_leadership'), // character_leadership
            $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'), // collaborate_with_partners_and_stakeholders
            $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'), // create_vision_and_strategy
            $this->getFeaturedSkillJustification($exp, 'mobilize_people'), // mobilize_people
            $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'), // promote_innovation_and_guide_change
            $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'), // uphold_integrity_and_respect
            $departmentNumber,
            $departmentSize,
            $departmentType,
        ];
    }

    /**
     * Add education experiences to career experience sheet
     */
    private function addEducationExperiences(Worksheet $sheet, array $userIds, int &$currentRow): void
    {
        EducationExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) use ($sheet, &$currentRow) {
                foreach ($experiences as $exp) {
                    $rowData = $this->buildEducationExperienceRow($exp);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Build education experience row
     */
    private function buildEducationExperienceRow(EducationExperience $exp): array
    {
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $exp->user->first_name,
            $exp->user->last_name,
            $this->getExperienceType($exp),  // experience type
            $exp->start_date?->format('Y-m') ?? '', // start date
            $exp->end_date?->format('Y-m') ?? '', // end date
            $isCurrent, // currently active
            $numberOfMonths, // number of months
            // Work-specific fields (8-24) - mostly empty for education
            '', // role_or_title
            $exp->institution ?? '', // organization_department
            '', // employment_category
            '', // team_group
            '', // size_external_organization
            '', // seniority_external_organization
            '', // gc_employment_type
            '', // gc_position_type
            '', // classification
            '', // gc_management_or_supervisory_status
            '', // gc_number_of_supervised_employees
            '', // gc_annual_budget_allocation
            '', // c_suite_title
            '', // other_c_suite_title
            '', // caf_employment_type
            '', // rank_category
            '', // work_streams
            $this->localizeEnum($exp->type, EducationType::class),  // education type
            $exp->area_of_study ?? '', // area of study
            $this->localizeEnum($exp->status, EducationStatus::class), // education status
            $exp->thesis_title ?? '', // thesis title
            // Community/Personal fields - empty for education
            '', // community_project_or_product
            '', // personal_learning_experience_description

            // Award fields - empty for education
            '', // award_recipient
            '', // issuing_org
            '', // awarded_scope
            '', // date_awarded
            $exp->details ?? '', // additional details
            $this->getFeaturedSkills($exp), // featured skills
            $this->getFeaturedSkillJustification($exp, 'achieve_results'), // achieve_results
            $this->getFeaturedSkillJustification($exp, 'character_leadership'), // character_leadership
            $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'), // collaborate_with_partners_and_stakeholders
            $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'), // create_vision_and_strategy
            $this->getFeaturedSkillJustification($exp, 'mobilize_people'), // mobilize_people
            $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'), // promote_innovation_and_guide_change
            $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'), // uphold_integrity_and_respect
            // Department fields - empty for education
            '', // department_number
            '', // department_size
            '', // department_type
        ];
    }

    /**
     * Add award experiences to career experience sheet
     */
    private function addAwardExperiences(Worksheet $sheet, array $userIds, int &$currentRow): void
    {
        AwardExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) use ($sheet, &$currentRow) {
                foreach ($experiences as $exp) {
                    $rowData = $this->buildAwardExperienceRow($exp);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Build award experience row
     */
    private function buildAwardExperienceRow(AwardExperience $exp): array
    {
        $numberOfMonths = 0;

        return [
            $exp->user->id,
            $exp->user->first_name,
            $exp->user->last_name,
            $this->getExperienceType($exp),  // experience type
            '', // start date
            '', // end date
            $this->yesOrNo(false),  // is current
            $numberOfMonths, // number of months
            $exp->title ?? '', // role or title
            $exp->issued_by ?? '', // organization_department
            '', // employment_category
            '', // team_group
            '', // size_external_organization
            '', // seniority_external_organization
            '', // gc_employment_type
            '', // gc_position_type
            '', // classification
            '', // gc_management_or_supervisory_status
            '', // gc_number_of_supervised_employees
            '', // gc_annual_budget_allocation
            '', // c_suite_title
            '', // other_c_suite_title
            '', // caf_employment_type
            '', // rank_category
            '', // work_streams

            // Education fields - empty for awards
            '', // type_of_education
            '', // area_study
            '', // education_status
            '', // thesis_title

            // Community/Personal fields - empty for awards
            '', // community_project_or_product
            '', // personal_learning_experience_description
            $this->localizeEnum($exp->awarded_to, AwardedTo::class), // award_recipient
            '', // issued by
            $this->localizeEnum($exp->awarded_scope, AwardedScope::class), // award
            $exp->awarded_date?->format('Y-m-d') ?? '', // date awarded
            $exp->details ?? '', // additional details
            $this->getFeaturedSkills($exp), // featured skills
            $this->getFeaturedSkillJustification($exp, 'achieve_results'), // achieve_results
            $this->getFeaturedSkillJustification($exp, 'character_leadership'), // character_leadership
            $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'), // collaborate_with_partners_and_stakeholders
            $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'), // create_vision_and_strategy
            $this->getFeaturedSkillJustification($exp, 'mobilize_people'), // mobilize_people
            $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'), // promote_innovation_and_guide_change
            $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'), // uphold_integrity_and_respect
            // Department fields - empty for awards
            '', // department_number
            '', // department_size
            '', // department_type
        ];
    }

    /**
     * Add community experiences to career experience sheet
     */
    private function addCommunityExperiences(Worksheet $sheet, array $userIds, int &$currentRow): void
    {
        CommunityExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) use ($sheet, &$currentRow) {
                foreach ($experiences as $exp) {
                    $rowData = $this->buildCommunityExperienceRow($exp);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Build community experience row
     */
    private function buildCommunityExperienceRow(CommunityExperience $exp): array
    {
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $exp->user->first_name,
            $exp->user->last_name,
            $this->getExperienceType($exp),  // experience type
            $exp->start_date?->format('Y-m') ?? '', // start date
            $exp->end_date?->format('Y-m') ?? '', // end date
            $isCurrent, // is current
            $numberOfMonths, // number of months
            $exp->title ?? '', // role or title
            $exp->organization ?? '',
            '', // employment_category
            $exp->group ?? '', // team_group
            '', // size_external_organization
            '', // seniority_external_organization
            '', // gc_employment_type
            '', // gc_position_type
            '', // classification
            '', // gc_management_or_supervisory_status
            '', // gc_number_of_supervised_employees
            '', // gc_annual_budget_allocation
            '', // c_suite_title
            '', // other_c_suite_title
            '', // caf_employment_type
            '', // rank_category
            '', // work_streams
            // Education fields - empty for community
            '', // type_of_education
            '', // area_study
            '', // education_status
            '', // thesis_title
            $exp->project ?? '', // community_project_or_product
            '', // personal learning description
            // Award fields - empty for community
            '', // award recipient
            '', // issuing organization
            '', // awarded_scope
            '', // date awarded
            $exp->details ?? '', // additional details
            $this->getFeaturedSkills($exp),
            $this->getFeaturedSkillJustification($exp, 'achieve_results'), // achieve_results
            $this->getFeaturedSkillJustification($exp, 'character_leadership'), // character_leadership
            $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'), // collaborate_with_partners_and_stakeholders
            $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'), // create_vision_and_strategy
            $this->getFeaturedSkillJustification($exp, 'mobilize_people'), // mobilize_people
            $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'), // promote_innovation_and_guide_change
            $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'), // uphold_integrity_and_respect
            // Department fields - empty for community
            '', // department_number
            '', // department_size
            '', // department_type
        ];
    }

    /**
     * Add personal experiences to sheet
     */
    private function addPersonalExperiences(Worksheet $sheet, array $userIds, int &$currentRow): void
    {
        PersonalExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) use ($sheet, &$currentRow) {
                foreach ($experiences as $exp) {
                    $rowData = $this->buildPersonalExperienceRow($exp);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Build personal experience row
     */
    private function buildPersonalExperienceRow(PersonalExperience $exp): array
    {
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $exp->user->first_name,
            $exp->user->last_name,
            $this->localizeEnum(ExperienceType::PERSONAL->name, ExperienceType::class), // experience type
            $exp->start_date?->format('Y-m') ?? '', // start date
            $exp->end_date?->format('Y-m') ?? '', // end date
            $isCurrent, // is current
            $numberOfMonths, // number of months
            $exp->title ?? '', // role or title
            '', // organization_department
            '', // employment_category
            '', // team_group
            '', // size_external_organization
            '', // seniority_external_organization
            '', // gc_employment_type
            '', // gc_position_type
            '', // classification
            '', // gc_management_or_supervisory_status
            '', // gc_number_of_supervised_employees
            '', // gc_annual_budget_allocation
            '', // c_suite_title
            '', // other_c_suite_title
            '', // caf_employment_type
            '', // rank_category
            '', // work_streams

            // Education fields - empty for personal
            '', // type_of_education
            '', // area_study
            '', // education_status
            '', // thesis_title
            '', // Community project or product
            $exp->description ?? '', // personal learning experience description
            // Award fields - empty for education
            '', // award recipient
            '', // issuing organization
            '', // awarded_scope
            '', // date awarded
            $exp->details ?? '', // additional details
            $this->getFeaturedSkills($exp), // featured skills
            $this->getFeaturedSkillJustification($exp, 'achieve_results'), // achieve_results
            $this->getFeaturedSkillJustification($exp, 'character_leadership'), // character_leadership
            $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'), // collaborate_with_partners_and_stakeholders
            $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'), // create_vision_and_strategy
            $this->getFeaturedSkillJustification($exp, 'mobilize_people'), // mobilize_people
            $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'), // promote_innovation_and_guide_change
            $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'), // uphold_integrity_and_respect
            // Department fields - empty for education
            '', // department_number
            '', // department_size
            '', // department_type
        ];
    }

    /**
     * Get work streams from a model
     */
    private function getWorkStreams($model): string
    {
        if (! $model->workStreams) {
            return '';
        }

        return $model->workStreams
            ->map(fn ($workStream) => $workStream->name[$this->lang] ?? '')
            ->filter()
            ->join(', ');
    }

    /**
     * Get featured skills from experience
     */
    private function getFeaturedSkills($experience): string
    {
        if (! $experience->userSkills || $experience->userSkills->isEmpty()) {
            return '';
        }

        return $experience->userSkills
            ->filter(fn ($userSkill) => $userSkill->skill)
            ->map(fn ($userSkill) => $userSkill->skill->name[$this->lang] ?? '')
            ->filter()
            ->implode(', ');
    }

    /**
     * Get feature skill justification
     */
    private function getFeaturedSkillJustification($experience, string $targetSkill): string
    {
        if (empty($experience->userSkills)) {
            return '';
        }

        // Get name to match against
        $targetNames = $this->getSkillNames($targetSkill) ?: [];
        if (empty($targetNames)) {
            return '';
        }
        // check each featured skill on experience
        foreach ($experience->userSkills as $userSkill) {
            // skip if no skill
            if (! $skill = $userSkill->skill) {
                continue;
            }
            // Get skill name
            $skillName = $skill->name[$this->lang] ?? '';
            if (empty($skillName)) {
                continue;
            }
            // check if skill name matches any of the target names
            foreach ($targetNames as $targetName) {
                if (stripos($skillName, $targetName) !== false) {
                    return $this->getJustificationFromExperienceSkill($experience, $userSkill);
                }
            }
        }

        return '';
    }

    /**
     * Get featured skill justification from model
     */
    private function getJustificationFromExperienceSkill($experience, $userSkill): string
    {
        if (empty($experience->id) || empty($userSkill->id)) {
            return '';
        }

        $experienceSkill = ExperienceSkill::where('experience_id', $experience->id)
            ->where('experience_type', get_class($experience))
            ->where('user_skill_id', $userSkill->id)
            ->first();

        return $experienceSkill->details ?? '';
    }

    /**
     * Get all possible skill names for a skill key
     */
    private function getSkillNames(string $featuredSkillKey): array
    {
        $klcSkillNames = [
            'achieve_results' => [
                'en' => 'Achieve Results',
                'fr' => 'Obtenir des résultats',
            ],
            'character_leadership' => [
                'en' => 'Character Leadership',
                'fr' => 'Leadership de caractère',
            ],
            'collaborate_with_partners_and_stakeholders' => [
                'en' => 'Collaborate with Partners and Stakeholders',
                'fr' => 'Collaborer avec les partenaires et les intervenants',
            ],
            'create_vision_and_strategy' => [
                'en' => 'Create Vision and Strategy',
                'fr' => 'Créer une vision et une stratégie',
            ],
            'mobilize_people' => [
                'en' => 'Mobilize People',
                'fr' => 'Mobiliser les personnes',
            ],
            'promote_innovation_and_guide_change' => [
                'en' => 'Promote Innovation and Guide Change',
                'fr' => 'Promouvoir l\'innovation et orienter le changement',
            ],
            'uphold_integrity_and_respect' => [
                'en' => 'Uphold Integrity and Respect',
                'fr' => 'Préserver l\'intégrité et le respect',
            ],
        ];

        $skillNames = $klcSkillNames[$featuredSkillKey] ?? [];
        $currentLangName = trim($skillNames[$this->lang] ?? '');

        return ! empty($currentLangName) ? [$currentLangName] : [];
    }

    /**
     * Calculate number of months between dates
     */
    private function calculateMonths($startDate, $endDate): int
    {
        if (! $startDate) {
            return 0;
        }

        if (! $endDate) {
            $endDate = now();
        }

        return $startDate->diffInMonths($endDate);
    }

    /**
     * Get department from work experience
     */
    private function getDepartmentInfo(WorkExperience $exp): array
    {
        if (! $exp->department) {
            return ['', '', ''];
        }

        return [
            $exp->department->id ?? '',
            $this->localizeEnum($exp->department->size, DepartmentSize::class),
            $exp->department->type ?? '',
        ];
    }

    /**
     * Generate data for Community Interest sheet
     */
    private function generateCommunityInterestSheet(Worksheet $sheet): void
    {
        $userIds = $this->userIds;

        if (empty($userIds)) {
            return;
        }

        $localizedHeadersPart1 = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->communityInterestLocaleKeys1);
        $localizedHeadersPart2 = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->communityInterestLocaleKeys2);

        $communityIds = CommunityInterest::whereIn('user_id', $userIds)
            ->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee()
            ->get('community_id')
            ->pluck('community_id')
            ->unique();
        $developmentPrograms = DevelopmentProgram::whereIn('community_id', $communityIds)
            ->orderByDesc('community_id')
            ->get();

        $generatedHeaders = [];
        $developmentProgramIds = [];
        foreach ($developmentPrograms as $program) {
            $generatedHeaders[] = $program->name[$this->lang];
            $developmentProgramIds[] = $program->id;
        }

        $sheet->fromArray([
            ...$localizedHeadersPart1,
            ...$generatedHeaders,
            ...$localizedHeadersPart2,
        ], null, 'A1');

        $currentRow = 2;

        CommunityInterest::whereIn('user_id', $userIds)
            ->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee()
            ->with(['user', 'community', 'workStreams', 'interestInDevelopmentPrograms'])
            ->chunk(200, function ($interests) use ($sheet, &$currentRow, $developmentProgramIds) {
                foreach ($interests as $interest) {
                    $rowData = $this->buildCommunityInterestRow($interest, $developmentProgramIds);
                    $sheet->fromArray($rowData, null, sprintf('A%d', $currentRow));
                    $currentRow++;
                }
            });
    }

    /**
     * Build community interest row
     */
    private function buildCommunityInterestRow(CommunityInterest $interest, array $developmentPrograms): array
    {
        $workStreams = $this->getWorkStreams($interest);
        $developmentProgramInterests = array_map(function ($program) use ($interest) {
            return $this->getDevelopmentProgramInterest($program, $interest);
        }, $developmentPrograms);

        return [
            $interest->user->id, // user id
            $interest->user->first_name, // first name
            $interest->user->last_name, // last name
            $interest->community->name[$this->lang] ?? '', // community name
            $interest->job_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'), // job interest
            $interest->training_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'), // training interest
            $workStreams, // Work streams: work streams linked to the community interest separated by commas
            $interest->additional_information, // additional information
            ...$developmentProgramInterests, // Generated leadership and development columns
            $interest->community->key === 'finance' ? $this->yesOrNo($interest->finance_is_chief) : '', // CFO status
            $this->localizeEnumArray($interest->finance_additional_duties, FinanceChiefDuty::class), // additional duties
            $this->localizeEnumArray($interest->finance_other_roles, FinanceChiefRole::class), // other roles
            $interest->finance_other_roles_other, // other SDO position
        ];
    }

    /**
     * Get interest in a development program
     */
    private function getDevelopmentProgramInterest(string $programId, CommunityInterest $communityInterest)
    {
        $programInterest = $communityInterest->interestInDevelopmentPrograms->first(function ($interest) use ($programId) {
            return $interest->development_program_id === $programId;
        });

        if (is_null($programInterest)) {
            return null;
        }

        switch ($programInterest->participation_status) {
            case DevelopmentProgramParticipationStatus::NOT_INTERESTED:
                return $this->localize('common.not_interested');
            case DevelopmentProgramParticipationStatus::INTERESTED:
                return $this->localize('common.interested_in_program');
            case DevelopmentProgramParticipationStatus::ENROLLED:
                return $this->localize('common.currently_enrolled');
            case DevelopmentProgramParticipationStatus::COMPLETED:
                return $this->localize('common.completed_in').$programInterest->completion_date->format('F Y');
        }
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
            'userSkills' => function ($query) {
                $query->with([
                    'skill' => function ($query) {
                        $query->select('id', 'key', 'name');
                    },
                ]);
            },
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
                $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId]);
            },
            'poolCandidates.pool',
            'poolCandidates.pool.classification',
            'offPlatformRecruitmentProcesses',
            'offPlatformRecruitmentProcesses.classification',
            'offPlatformRecruitmentProcesses.department',
            'workExperiences.userSkills.skill',
            'educationExperiences.userSkills.skill',
            'awardExperiences.userSkills.skill',
            'communityExperiences.userSkills.skill',
            'personalExperiences.userSkills.skill',
        ]);

        $this->applyFilters($query, [
            'poolFilters' => 'wherePoolExists',
            'isProfileComplete' => 'whereProfileComplete',
            'isGovEmployee' => 'whereIsGovEmployee',
            'telephone' => 'whereTelephone',
            'email' => 'whereEmail',
            'workEmail' => 'whereWorkEmail',
            'name' => 'whereName',
            'generalSearch' => 'whereGeneralSearch',
            'roles' => 'whereRoleIn',

            // Applicant filter input renames
            'equity' => 'whereEquityIn',
            'hasDiploma' => 'whereHasDiploma',
            'languageAbility' => 'whereLanguageAbility',
            'operationalRequirements' => 'whereOperationalRequirementsIn',
            'positionDuration' => 'wherePositionDurationIn',
            'pools' => 'whereAvailableInPools',
            'skills' => 'whereSkillsAdditive',
            'skillsIntersectional' => 'whereSkillsIntersectional',
            'qualifiedInClassifications' => 'whereQualifiedInClassificationsIn',
            'qualifiedInWorkStreams' => 'whereQualifiedInWorkStreamsIn',
            'community' => 'whereCandidatesInCommunity',
        ]);

        $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereUserFilterInputToSpecialLocationMatching($this->filters);

        return $query;

    }
}
