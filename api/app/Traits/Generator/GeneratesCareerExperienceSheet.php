<?php

namespace App\Traits\Generator;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CafEmploymentType;
use App\Enums\CafRank;
use App\Enums\CSuiteRoleTitle;
use App\Enums\DepartmentSize;
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\EmploymentCategory;
use App\Enums\ExperienceType;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\ExperienceSkill;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;

/**
 * Builds the Career Experience sheet shared by the user and nominations excel
 * generators. Relies on GeneratesSharedExcelData for getWorkStreams().
 */
trait GeneratesCareerExperienceSheet
{
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

    /**
     * Generate data for Career Experience sheet
     */
    private function generateCareerExperienceTab(): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->careerExperienceLocaleKeys);

        $this->writer->addRow($this->row($localizedHeaders));

        $userIds = $this->userIds;

        if (empty($userIds)) {
            return;
        }

        $this->addExperiencesToSheet($userIds);
    }

    /**
     * Add experiences to Career Experience sheet
     */
    private function addExperiencesToSheet(array $userIds): void
    {
        $this->addWorkExperiences($userIds);
        $this->addEducationExperiences($userIds);
        $this->addAwardExperiences($userIds);
        $this->addCommunityExperiences($userIds);
        $this->addPersonalExperiences($userIds);
    }

    /**
     * Add work experiences to career experience sheet
     */
    private function addWorkExperiences(array $userIds): void
    {
        WorkExperience::whereIn('user_id', $userIds)
            ->with(['user', 'department', 'classification', 'userSkills.skill', 'workStreams'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow($this->row($this->buildWorkExperienceRow($exp)));
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
            $this->getOrganizationName($exp),  // Organization, department, military force, or institution: Organization (external), Department (GC), Military force (CAF), Education institution, Group, organization, or community, Issuing organization
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
    private function addEducationExperiences(array $userIds): void
    {
        EducationExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow($this->row($this->buildEducationExperienceRow($exp)));
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
    private function addAwardExperiences(array $userIds): void
    {
        AwardExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow($this->row($this->buildAwardExperienceRow($exp)));
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
    private function addCommunityExperiences(array $userIds): void
    {
        CommunityExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow($this->row($this->buildCommunityExperienceRow($exp)));
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
    private function addPersonalExperiences(array $userIds): void
    {
        PersonalExperience::whereIn('user_id', $userIds)
            ->with(['user', 'userSkills.skill'])
            ->chunk(200, function ($experiences) {
                foreach ($experiences as $exp) {
                    $this->writer->addRow($this->row($this->buildPersonalExperienceRow($exp)));
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
            $exp->department->org_identifier ?? '',
            $this->localizeEnum($exp->department->size, DepartmentSize::class),
            $this->getDepartmentTypes($exp->department),
        ];
    }

    /**
     * Get department types
     */
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

    /**
     * Get organization name
     * for goc employees use department name
     * for caf employees use localized employment type
     * for external use organization field
     *
     * @param  WorkExperience  $exp  The work experience
     * @return string The organization name
     */
    private function getOrganizationName(WorkExperience $exp): string
    {
        // goc employee
        if ($exp->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name && $exp->department) {
            // return localized department name
            return $exp->department?->name[$this->lang] ?? $exp->organization ?? '';
        }

        // CAF employee
        if ($exp->employment_category === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
            // return localized caf employment type
            return $this->localizeEnum($exp->caf_employment_type, CafEmploymentType::class);
        }

        // external organization
        if ($exp->employment_category === EmploymentCategory::EXTERNAL_ORGANIZATION->name) {
            // return organization field for external experience
            return $exp->organization ?? '';
        }

        // fallback
        return $exp->organization ?? '';
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
}
