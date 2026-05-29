<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CafEmploymentType;
use App\Enums\CafRank;
use App\Enums\CitizenshipStatus;
use App\Enums\CommunityInterestAdditionalDuty;
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
use App\Models\CommunityDevelopmentProgram;
use App\Models\CommunityExperience;
use App\Models\CommunityInterest;
use App\Models\DevelopmentProgram;
use App\Models\DevelopmentProgramUser;
use App\Models\EducationExperience;
use App\Models\ExperienceSkill;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\WorkExperience;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

class UserExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

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
        'team_group_division',
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
        'details_or_key_tasks',
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
        'procurement_sdo_status',
    ];

    private array $userIds = [];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->writer = new Writer();
        $this->writer->openToFile($this->getPath());
        $this->writer->getCurrentSheet()->setName(Lang::get('headings.user', [], $this->lang));

        $this->generateUsersSheet();

        $careerSheet = $this->writer->addNewSheetAndMakeItCurrent();
        $careerSheet->setName(Lang::get('headings.career_experience', [], $this->lang));
        $this->generateCareerExperienceSheet();

        $interestSheet = $this->writer->addNewSheetAndMakeItCurrent();
        $interestSheet->setName(Lang::get('headings.community_interest', [], $this->lang));
        $this->generateCommunityInterestSheet();

        $this->writer->close();

        return $this;
    }

    private function generateUsersSheet(): void
    {
        $columns = $this->userColumns();

        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), array_keys($columns))
        ));

        $this->buildQuery()->chunk(200, function ($users) use ($columns) {
            foreach ($users as $user) {
                $this->userIds[] = $user->id;
                $this->writer->addRow(Row::fromValues(
                    array_map(fn ($fn) => $fn($user), $columns)
                ));
            }
        });
    }

    /** @return array<string, callable> */
    private function userColumns(): array
    {
        return [
            'id' => fn ($u) => $u->id,
            'first_name' => fn ($u) => $u->first_name,
            'last_name' => fn ($u) => $u->last_name,
            'email' => fn ($u) => $u->email ?? '',
            'phone' => fn ($u) => $u->telephone ?? '',
            'updated_at' => fn ($u) => $u->updated_at ? $u->updated_at->format('Y-m-d H:i:s') : '',

            'armed_forces_status' => fn ($u) => $this->localizeEnum($u->armed_forces_status, ArmedForcesStatus::class),
            'citizenship' => fn ($u) => $this->localizeEnum($u->citizenship, CitizenshipStatus::class),
            'current_city' => fn ($u) => $u->current_city ?? '',
            'current_province' => fn ($u) => $this->localizeEnum($u->current_province, ProvinceOrTerritory::class),

            'preferred_communication_language' => fn ($u) => $this->localizeEnum($u->preferred_lang, Language::class),
            'interested_in_languages' => fn ($u) => $this->lookingForLanguages($u),
            'first_official_language' => fn ($u) => $this->localizeEnum($u->first_official_language, Language::class),
            'estimated_language_ability' => fn ($u) => $this->localizeEnum($u->estimated_language_ability, EstimatedLanguageAbility::class),
            'second_language_exam_completed' => fn ($u) => $this->yesOrNo($u->second_language_exam_completed),
            'second_language_exam_validity' => fn ($u) => $this->yesOrNo($u->second_language_exam_validity),
            'comprehension_level' => fn ($u) => $this->localizeEnum($u->comprehension_level, EvaluatedLanguageAbility::class),
            'writing_level' => fn ($u) => $this->localizeEnum($u->written_level, EvaluatedLanguageAbility::class),
            'oral_interaction_level' => fn ($u) => $this->localizeEnum($u->verbal_level, EvaluatedLanguageAbility::class),

            'government_employee' => fn ($u) => $this->yesOrNo($u->computed_is_gov_employee),
            'department' => fn ($u) => $u->department?->name[$this->lang] ?? '',
            'employee_type' => fn ($u) => $this->localizeEnum($u->computed_gov_employee_type, GovEmployeeType::class),
            'work_email' => fn ($u) => $u->work_email,
            'classification_current' => fn ($u) => $u->getClassification(),
            'priority_entitlement' => fn ($u) => $this->yesOrNo($u->has_priority_entitlement),
            'priority_number' => fn ($u) => $u->priority_number ?? '',

            'accept_temporary' => fn ($u) => $u->position_duration ? $this->yesOrNo($u->wouldAcceptTemporary()) : '',
            'accepted_operational_requirements' => fn ($u) => $this->localizeEnumArray($u->getOperationalRequirements()['accepted'], OperationalRequirement::class),
            'location_preferences' => fn ($u) => $this->localizeEnumArray(
                array_filter($u->location_preferences ?? [], fn ($l) => $l !== WorkRegion::TELEWORK->name),
                WorkRegion::class
            ),
            'flexible_work_locations' => fn ($u) => $this->localizeEnumArray($u->flexible_work_locations, FlexibleWorkLocation::class),
            'location_exemptions' => fn ($u) => $u->location_exemptions,

            'woman' => fn ($u) => $this->yesOrNo($u->is_woman),
            'indigenous' => fn ($u) => $this->localizeEnumArray(
                Arr::where($u->indigenous_communities ?? [], fn ($c) => $c !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name),
                IndigenousCommunity::class
            ),
            'visible_minority' => fn ($u) => $this->yesOrNo($u->is_visible_minority),
            'disability' => fn ($u) => $this->yesOrNo($u->has_disability),

            'skills' => fn ($u) => $u->userSkills->map(fn ($us) => $us->skill->name[$this->lang] ?? '')->join(', '),

            'career_planning_lateral_move_interest' => fn ($u) => $this->yesOrNo($u->employeeProfile?->career_planning_lateral_move_interest),
            'career_planning_lateral_move_time_frame' => fn ($u) => $this->localizeEnum($u->employeeProfile?->career_planning_lateral_move_time_frame, TimeFrame::class),
            'career_planning_lateral_move_organization_type' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class),
            'career_planning_promotion_move_interest' => fn ($u) => $this->yesOrNo($u->employeeProfile?->career_planning_promotion_move_interest),
            'career_planning_promotion_move_time_frame' => fn ($u) => $this->localizeEnum($u->employeeProfile?->career_planning_promotion_move_time_frame, TimeFrame::class),
            'career_planning_promotion_move_organization_type' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class),
            'career_planning_learning_opportunities_interest' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class),
            'eligible_retirement_year' => fn ($u) => $u->employeeProfile?->eligible_retirement_year?->format('Y') ?? '',
            'career_planning_mentorship_status' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_mentorship_status, Mentorship::class),
            'career_planning_mentorship_interest' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_mentorship_interest, Mentorship::class),
            'career_planning_exec_interest' => fn ($u) => $this->yesOrNo($u->employeeProfile?->career_planning_exec_interest),
            'career_planning_exec_coaching_status' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_exec_coaching_status, ExecCoaching::class),
            'career_planning_exec_coaching_interest' => fn ($u) => $this->localizeEnumArray($u->employeeProfile?->career_planning_exec_coaching_interest, ExecCoaching::class),

            'next_role_target_classification_group' => fn ($u) => $u->employeeProfile?->nextRoleClassification->group ?? '',
            'next_role_target_classification_level' => fn ($u) => $u->employeeProfile?->nextRoleClassification->level ?? '',
            'next_role_target_role' => fn ($u) => $this->localizeEnum($u->employeeProfile?->next_role_target_role, TargetRole::class),
            'next_role_is_c_suite_role' => fn ($u) => $this->yesOrNo($u->employeeProfile?->next_role_is_c_suite_role),
            'next_role_c_suite_role_title' => fn ($u) => $this->localizeEnum($u->employeeProfile?->next_role_c_suite_role_title, CSuiteRoleTitle::class),
            'next_role_job_title' => fn ($u) => $u->employeeProfile?->next_role_job_title ?? '',
            'next_role_functional_community' => fn ($u) => $u->employeeProfile?->nextRoleCommunity?->name[$this->lang] ?? '',
            'next_role_work_streams' => fn ($u) => $u->employeeProfile?->nextRoleWorkStreams->map(fn ($ws) => $ws->name[$this->lang] ?? '')->join(', '),
            'next_role_departments' => fn ($u) => $u->employeeProfile?->nextRoleDepartments->map(fn ($d) => $d->name[$this->lang] ?? '')->join(', '),
            'next_role_additional_information' => fn ($u) => $u->employeeProfile?->next_role_additional_information ?? '',

            'career_objective_target_classification_group' => fn ($u) => $u->employeeProfile?->careerObjectiveClassification->group ?? '',
            'career_objective_target_classification_level' => fn ($u) => $u->employeeProfile?->careerObjectiveClassification->level ?? '',
            'career_objective_target_role' => fn ($u) => $this->localizeEnum($u->employeeProfile?->career_objective_target_role, TargetRole::class),
            'career_objective_is_c_suite_role' => fn ($u) => $this->yesOrNo($u->employeeProfile?->career_objective_is_c_suite_role),
            'career_objective_c_suite_role_title' => fn ($u) => $this->localizeEnum($u->employeeProfile?->career_objective_c_suite_role_title, CSuiteRoleTitle::class),
            'career_objective_job_title' => fn ($u) => $u->employeeProfile?->career_objective_job_title ?? '',
            'career_objective_functional_community' => fn ($u) => $u->employeeProfile?->careerObjectiveCommunity?->name[$this->lang] ?? '',
            'career_objective_work_streams' => fn ($u) => $u->employeeProfile?->careerObjectiveWorkStreams->map(fn ($ws) => $ws->name[$this->lang] ?? '')->join(', '),
            'career_objective_departments' => fn ($u) => $u->employeeProfile?->careerObjectiveDepartments->map(fn ($d) => $d->name[$this->lang] ?? '')->join(', '),
            'career_objective_additional_information' => fn ($u) => $u->employeeProfile?->career_objective_additional_information ?? '',

            'career_planning_about_you' => fn ($u) => $u->employeeProfile?->career_planning_about_you ?? '',
            'career_planning_learning_goals' => fn ($u) => $u->employeeProfile?->career_planning_learning_goals ?? '',
            'career_planning_work_style' => fn ($u) => $u->employeeProfile?->career_planning_work_style ?? '',

            'digital_talent_processes' => fn ($u) => $u->poolCandidates->map(fn ($candidate) => sprintf(
                '%s - %s - %s - %s',
                $candidate->pool->classification->formattedGroupAndLevel,
                $candidate->pool->name[$this->lang] ?? '',
                $candidate->pool->process_number,
                $candidate->suspended_at
                    ? Lang::get('common.not_interested', [], $this->lang)
                    : Lang::get('common.open_to_job_offers', [], $this->lang)
            ))->join(', '),

            'off_platform_processes_not_verified' => fn ($u) => collect($u->offPlatformRecruitmentProcesses)
                ->map(fn ($process) => $this->formatOffPlatformProcess($process))
                ->join(', '),
        ];
    }

    private function generateCareerExperienceSheet(): void
    {
        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), $this->careerExperienceLocaleKeys)
        ));

        if (empty($this->userIds)) {
            return;
        }

        $this->addWorkExperiences();
        $this->addEducationExperiences();
        $this->addAwardExperiences();
        $this->addCommunityExperiences();
        $this->addPersonalExperiences();
    }

    private function addWorkExperiences(): void
    {
        WorkExperience::whereIn('user_id', $this->userIds)
            ->with(['user', 'department', 'classification', 'userSkills.skill', 'workStreams'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow(Row::fromValues($this->buildWorkExperienceRow($exp)));
                }
            });
    }

    private function addEducationExperiences(): void
    {
        EducationExperience::whereIn('user_id', $this->userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow(Row::fromValues($this->buildEducationExperienceRow($exp)));
                }
            });
    }

    private function addAwardExperiences(): void
    {
        AwardExperience::whereIn('user_id', $this->userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow(Row::fromValues($this->buildAwardExperienceRow($exp)));
                }
            });
    }

    private function addCommunityExperiences(): void
    {
        CommunityExperience::whereIn('user_id', $this->userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow(Row::fromValues($this->buildCommunityExperienceRow($exp)));
                }
            });
    }

    private function addPersonalExperiences(): void
    {
        PersonalExperience::whereIn('user_id', $this->userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow(Row::fromValues($this->buildPersonalExperienceRow($exp)));
                }
            });
    }

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

    private function baseExperienceRow(): array
    {
        return array_fill_keys($this->careerExperienceLocaleKeys, '');
    }

    private function sharedKlcFields($exp): array
    {
        return [
            'featured_skills' => $this->getFeaturedSkills($exp),
            'klc_achieve_results' => $this->getFeaturedSkillJustification($exp, 'achieve_results'),
            'klc_character_leadership' => $this->getFeaturedSkillJustification($exp, 'character_leadership'),
            'klc_collaborate_with_partners_and_stakeholders' => $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders'),
            'klc_create_vision_and_strategy' => $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy'),
            'klc_mobilize_people' => $this->getFeaturedSkillJustification($exp, 'mobilize_people'),
            'klc_promote_innovation_and_guide_change' => $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change'),
            'klc_uphold_integrity_and_respect' => $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect'),
        ];
    }

    private function buildWorkExperienceRow(WorkExperience $exp): array
    {
        [$departmentNumber, $departmentSize, $departmentType] = $this->getDepartmentInfo($exp);

        return array_values(array_merge($this->baseExperienceRow(), [
            'id' => $exp->user->id,
            'first_name' => $exp->user->first_name,
            'last_name' => $exp->user->last_name,
            'experience_type' => $this->getExperienceType($exp),
            'start_date' => $exp->start_date ? $exp->start_date->format('Y-m') : '',
            'end_date' => $exp->end_date ? $exp->end_date->format('Y-m') : '',
            'is_current' => $this->yesOrNo(empty($exp->end_date)),
            'number_of_months' => $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date),
            'role_or_title' => $exp->role ?? '',
            'organization_department' => $this->getOrganizationName($exp),
            'employment_category' => $this->localizeEnum($exp->employment_category, EmploymentCategory::class),
            'team_group_division' => $exp->division ?? '',
            'size_external_organization' => $this->localizeEnum($exp->ext_size_of_organization, ExternalSizeOfOrganization::class),
            'seniority_external_organization' => $this->localizeEnum($exp->ext_role_seniority, ExternalRoleSeniority::class),
            'gc_employment_type' => $this->localizeEnum($exp->gov_employment_type, GovEmployeeType::class),
            'gov_position_type' => $this->localizeEnum($exp->gov_position_type, GovPositionType::class),
            'classification' => $exp->classification?->group.($exp->classification?->level ? '-'.$exp->classification->level : ''),
            'gc_management_or_supervisory_status' => $this->yesOrNo($exp->supervisory_position),
            'gc_number_of_supervised_employees' => $exp->supervised_employees_number ?? '',
            'gc_annual_budget_allocation' => $exp->annual_budget_allocation ?? '',
            'c_suite_title' => $this->localizeEnum($exp->c_suite_role_title, CSuiteRoleTitle::class),
            'other_c_suite_title' => $exp->other_c_suite_title ?? '',
            'caf_employment_type' => $this->localizeEnum($exp->caf_employment_type, CafEmploymentType::class),
            'caf_rank_category' => $this->localizeEnum($exp->caf_rank, CafRank::class),
            'work_streams' => $this->getWorkStreams($exp),
            'details_or_key_tasks' => $exp->details ?? '',
            ...$this->sharedKlcFields($exp),
            'department_number' => $departmentNumber,
            'department_size' => $departmentSize,
            'department_type' => $departmentType,
        ]));
    }

    private function buildEducationExperienceRow(EducationExperience $exp): array
    {
        return array_values(array_merge($this->baseExperienceRow(), [
            'id' => $exp->user->id,
            'first_name' => $exp->user->first_name,
            'last_name' => $exp->user->last_name,
            'experience_type' => $this->getExperienceType($exp),
            'start_date' => $exp->start_date?->format('Y-m') ?? '',
            'end_date' => $exp->end_date?->format('Y-m') ?? '',
            'is_current' => $this->yesOrNo(empty($exp->end_date)),
            'number_of_months' => $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date),
            'organization_department' => $exp->institution ?? '',
            'type_of_education' => $this->localizeEnum($exp->type, EducationType::class),
            'area_of_study' => $exp->area_of_study ?? '',
            'education_status' => $this->localizeEnum($exp->status, EducationStatus::class),
            'thesis_title' => $exp->thesis_title ?? '',
            'details_or_key_tasks' => $exp->details ?? '',
            ...$this->sharedKlcFields($exp),
        ]));
    }

    private function buildAwardExperienceRow(AwardExperience $exp): array
    {
        return array_values(array_merge($this->baseExperienceRow(), [
            'id' => $exp->user->id,
            'first_name' => $exp->user->first_name,
            'last_name' => $exp->user->last_name,
            'experience_type' => $this->getExperienceType($exp),
            'role_or_title' => $exp->title ?? '',
            'organization_department' => $exp->issued_by ?? '',
            'award_recipient' => $this->localizeEnum($exp->awarded_to, AwardedTo::class),
            'awarded_scope' => $this->localizeEnum($exp->awarded_scope, AwardedScope::class),
            'date_awarded' => $exp->awarded_date?->format('Y-m-d') ?? '',
            'details_or_key_tasks' => $exp->details ?? '',
            ...$this->sharedKlcFields($exp),
        ]));
    }

    private function buildCommunityExperienceRow(CommunityExperience $exp): array
    {
        return array_values(array_merge($this->baseExperienceRow(), [
            'id' => $exp->user->id,
            'first_name' => $exp->user->first_name,
            'last_name' => $exp->user->last_name,
            'experience_type' => $this->getExperienceType($exp),
            'start_date' => $exp->start_date?->format('Y-m') ?? '',
            'end_date' => $exp->end_date?->format('Y-m') ?? '',
            'is_current' => $this->yesOrNo(empty($exp->end_date)),
            'number_of_months' => $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date),
            'role_or_title' => $exp->title ?? '',
            'organization_department' => $exp->organization ?? '',
            'team_group_division' => $exp->group ?? '',
            'community_project_or_product' => $exp->project ?? '',
            'details_or_key_tasks' => $exp->details ?? '',
            ...$this->sharedKlcFields($exp),
        ]));
    }

    private function buildPersonalExperienceRow(PersonalExperience $exp): array
    {
        return array_values(array_merge($this->baseExperienceRow(), [
            'id' => $exp->user->id,
            'first_name' => $exp->user->first_name,
            'last_name' => $exp->user->last_name,
            'experience_type' => $this->localizeEnum(ExperienceType::PERSONAL->name, ExperienceType::class),
            'start_date' => $exp->start_date?->format('Y-m') ?? '',
            'end_date' => $exp->end_date?->format('Y-m') ?? '',
            'is_current' => $this->yesOrNo(empty($exp->end_date)),
            'number_of_months' => $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date),
            'role_or_title' => $exp->title ?? '',
            'personal_learning_experience_description' => $exp->description ?? '',
            'details_or_key_tasks' => $exp->details ?? '',
            ...$this->sharedKlcFields($exp),
        ]));
    }

    private function generateCommunityInterestSheet(): void
    {
        if (empty($this->userIds)) {
            return;
        }

        $communityIds = CommunityInterest::authorizedToView(['userId' => $this->authenticatedUserId])
            ->whereIn('user_id', $this->userIds)
            ->isVerifiedGovEmployee()
            ->get('community_id')
            ->pluck('community_id')
            ->unique();

        $developmentPrograms = DevelopmentProgram::whereHas(
            'communityDevelopmentPrograms',
            function (Builder $query) use ($communityIds) {
                $query->whereIn('community_id', $communityIds);
            })->get();

        $generatedHeaders = [];
        $developmentProgramIds = [];
        foreach ($developmentPrograms as $program) {
            $generatedHeaders[] = $program->name[$this->lang];
            $generatedHeaders[] = $program->name[$this->lang].' - '.Lang::get('headings.linked_experience', [], $this->lang);
            $developmentProgramIds[] = $program->id;
        }

        $communityProgramIdsMap = [];
        CommunityDevelopmentProgram::whereIn('community_id', $communityIds)
            ->whereIn('development_program_id', $developmentProgramIds)
            ->get(['community_id', 'development_program_id'])
            ->each(function ($cdp) use (&$communityProgramIdsMap) {
                $communityProgramIdsMap[$cdp->community_id][] = $cdp->development_program_id;
            });

        $staticHeaders1 = array_map(fn ($key) => $this->localizeHeading($key), $this->communityInterestLocaleKeys1);
        $staticHeaders2 = array_map(fn ($key) => $this->localizeHeading($key), $this->communityInterestLocaleKeys2);

        $this->writer->addRow(Row::fromValues([...$staticHeaders1, ...$generatedHeaders, ...$staticHeaders2]));

        CommunityInterest::authorizedToView(['userId' => $this->authenticatedUserId])
            ->whereIn('user_id', $this->userIds)
            ->isVerifiedGovEmployee()
            ->whereIn('community_id', $communityIds)
            ->with([
                'user',
                'community',
                'workStreams',
                'user.developmentProgramUserRecords',
                'user.developmentProgramUserRecords.educationExperience',
            ])
            ->chunk(200, function ($interests) use ($developmentProgramIds, $communityProgramIdsMap) {
                foreach ($interests as $interest) {
                    $this->writer->addRow(Row::fromValues(
                        $this->buildCommunityInterestRow($interest, $developmentProgramIds, $communityProgramIdsMap)
                    ));
                }
            });
    }

    private function buildCommunityInterestRow(CommunityInterest $interest, array $developmentProgramIds, array $communityProgramIdsMap): array
    {
        $communityProgramIds = $communityProgramIdsMap[$interest->community_id] ?? [];
        $workStreams = $this->getWorkStreams($interest);

        $developmentProgramColumns = [];
        foreach ($developmentProgramIds as $programId) {
            if (in_array($programId, $communityProgramIds)) {
                $developmentProgramColumns[] = $this->getDevelopmentProgramInterest($programId, $interest);
                $developmentProgramColumns[] = $this->getDevelopmentProgramLinkedExperience($programId, $interest);
            } else {
                $developmentProgramColumns[] = null;
                $developmentProgramColumns[] = null;
            }
        }

        return [
            $interest->user->id,
            $interest->user->first_name,
            $interest->user->last_name,
            $interest->community->name[$this->lang] ?? '',
            $interest->job_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'),
            $interest->training_interest ? $this->localize('common.interested') : $this->localize('common.not_interested'),
            $workStreams,
            $interest->additional_information,
            ...$developmentProgramColumns,
            $interest->community->key === 'finance' ? $this->yesOrNo($interest->finance_is_chief) : '',
            $this->localizeEnumArray($interest->additional_duties, CommunityInterestAdditionalDuty::class),
            $this->localizeEnumArray($interest->finance_other_roles, FinanceChiefRole::class),
            $interest->finance_other_roles_other,
            $interest->community->key === 'procurement' ? $this->yesOrNo($interest->procurement_is_sdo) : '',
        ];
    }

    private function getWorkStreams($model): string
    {
        if (! $model->workStreams) {
            return '';
        }

        return $model->workStreams
            ->map(fn ($ws) => $ws->name[$this->lang] ?? '')
            ->filter()
            ->join(', ');
    }

    private function getFeaturedSkills($experience): string
    {
        if (! $experience->userSkills || $experience->userSkills->isEmpty()) {
            return '';
        }

        return $experience->userSkills
            ->filter(fn ($us) => $us->skill)
            ->map(fn ($us) => $us->skill->name[$this->lang] ?? '')
            ->filter()
            ->implode(', ');
    }

    private function getFeaturedSkillJustification($experience, string $targetSkill): string
    {
        if (empty($experience->userSkills)) {
            return '';
        }

        $targetNames = $this->getSkillNames($targetSkill) ?: [];
        if (empty($targetNames)) {
            return '';
        }

        foreach ($experience->userSkills as $userSkill) {
            if (! $skill = $userSkill->skill) {
                continue;
            }

            $skillName = $skill->name[$this->lang] ?? '';
            if (empty($skillName)) {
                continue;
            }

            foreach ($targetNames as $targetName) {
                if (stripos($skillName, $targetName) !== false) {
                    return $this->getJustificationFromExperienceSkill($experience, $userSkill);
                }
            }
        }

        return '';
    }

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

    private function getSkillNames(string $featuredSkillKey): array
    {
        $klcSkillNames = [
            'achieve_results' => ['en' => 'Achieve Results', 'fr' => 'Obtenir des résultats'],
            'character_leadership' => ['en' => 'Character Leadership', 'fr' => 'Leadership de caractère'],
            'collaborate_with_partners_and_stakeholders' => ['en' => 'Collaborate with Partners and Stakeholders', 'fr' => 'Collaborer avec les partenaires et les intervenants'],
            'create_vision_and_strategy' => ['en' => 'Create Vision and Strategy', 'fr' => 'Créer une vision et une stratégie'],
            'mobilize_people' => ['en' => 'Mobilize People', 'fr' => 'Mobiliser les personnes'],
            'promote_innovation_and_guide_change' => ['en' => 'Promote Innovation and Guide Change', 'fr' => "Promouvoir l'innovation et orienter le changement"],
            'uphold_integrity_and_respect' => ['en' => 'Uphold Integrity and Respect', 'fr' => "Préserver l'intégrité et le respect"],
        ];

        $skillNames = $klcSkillNames[$featuredSkillKey] ?? [];
        $currentLangName = trim($skillNames[$this->lang] ?? '');

        return ! empty($currentLangName) ? [$currentLangName] : [];
    }

    private function calculateMonths($startDate, $endDate): int
    {
        if (! $startDate) {
            return 0;
        }

        return $startDate->diffInMonths($endDate ?? now());
    }

    private function getDepartmentInfo(WorkExperience $exp): array
    {
        if (! $exp->department) {
            return ['', '', ''];
        }

        return [
            $exp->department->org_identifier ?? '',
            $this->localizeEnum($exp->department->size, DepartmentSize::class),
            $this->getDepartmentTypes($exp->department),
        ];
    }

    private function getDepartmentTypes($department): string
    {
        if (! $department) {
            return '';
        }

        $types = [];

        if ($department->is_core_public_administration) {
            $types[] = $this->localize('headings.core_public_administration');
        }
        if ($department->is_central_agency) {
            $types[] = $this->localize('headings.central_agency');
        }
        if ($department->is_science) {
            $types[] = $this->localize('headings.science');
        }
        if ($department->is_regulatory) {
            $types[] = $this->localize('headings.regulatory');
        }

        return implode(', ', $types);
    }

    private function getOrganizationName(WorkExperience $exp): string
    {
        if ($exp->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name && $exp->department) {
            return $exp->department?->name[$this->lang] ?? $exp->organization ?? '';
        }

        if ($exp->employment_category === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
            return $this->localizeEnum($exp->caf_employment_type, CafEmploymentType::class);
        }

        return $exp->organization ?? '';
    }

    private function getDevelopmentProgramInterest(string $programId, CommunityInterest $communityInterest)
    {
        $programInterest = $communityInterest->user->developmentProgramUserRecords->first(
            fn ($record) => $record->development_program_id === $programId
        );

        if (is_null($programInterest) || empty($programInterest)) {
            return null;
        }

        /** @var DevelopmentProgramUser $programInterest */
        switch ($programInterest->participation_status) {
            case DevelopmentProgramParticipationStatus::NOT_INTERESTED->name:
                return $this->localize('common.not_interested');
            case DevelopmentProgramParticipationStatus::INTERESTED->name:
                return $this->localize('common.interested_in_program');
            case DevelopmentProgramParticipationStatus::ENROLLED->name:
                return $this->localize('common.currently_enrolled');
            case DevelopmentProgramParticipationStatus::COMPLETED->name:
                return $programInterest->completion_date
                    ? $this->localize('common.completed_in').$programInterest->completion_date->format('F Y')
                    : $this->localize('common.successfully_completed');
        }
    }

    private function getDevelopmentProgramLinkedExperience(string $programId, CommunityInterest $communityInterest): ?string
    {
        $programInterest = $communityInterest->user->developmentProgramUserRecords->first(
            fn ($record) => $record->development_program_id === $programId
        );

        if (is_null($programInterest)) {
            return null;
        }

        /** @var DevelopmentProgramUser $programInterest */
        return $programInterest->educationExperience?->getTitle($this->lang) ?? null;
    }

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

    private function formatOffPlatformProcess($process): string
    {
        $location = $this->formatProcessLocation($process);
        $platform = $this->formatProcessPlatform($process);

        return sprintf('%s (%s - %s)', $location, $platform, $process->process_number);
    }

    private function formatProcessPlatform($process): string
    {
        if ($process->platform === HiringPlatform::OTHER->name) {
            return $process->platform_other;
        }

        return $this->localizeEnum($process->platform, HiringPlatform::class);
    }

    private function formatProcessLocation($process): string
    {
        $classification = $process->classification->formattedGroupAndLevel;

        if (! $process->department) {
            return $classification;
        }

        $with = $this->localize('common.with');
        $dept = $process->department->name[$this->lang] ?? '';

        return sprintf('%s %s %s', $classification, $with, $dept);
    }

    /** @return Builder<User> */
    private function buildQuery(): Builder
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

        /** @var Builder<User> $query */
        $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereUserFilterInputToSpecialLocationMatching($this->filters);

        return $query;
    }
}
