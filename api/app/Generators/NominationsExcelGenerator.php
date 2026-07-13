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
use App\Enums\EducationStatus;
use App\Enums\EducationType;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\ExperienceType;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
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
use App\Enums\TalentNominationGroupDecision;
use App\Enums\TalentNominationGroupStatus;
use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Enums\WorkRegion;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\DevelopmentProgram;
use App\Models\EducationExperience;
use App\Models\ExperienceSkill;
use App\Models\PersonalExperience;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use App\Models\WorkExperience;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use OpenSpout\Writer\XLSX\Writer;

class NominationsExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $overviewLocaleKeys = [
        'nominee_user_id',
        'nominee_first_name',
        'nominee_last_name',
        'nomination_status',
        'nominators',
        'nomination_options',
        'advancement_approval',
        'advancement_approval_notes',
        'lateral_movement_approval',
        'lateral_movement_approval_notes',
        'development_program_approval',
        'development_program_approval_notes',
    ];

    protected array $userProfileHeaderKeys = [
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

    protected array $nominationDetailsHeaderKeys = [
        'nominee_user_id',
        'nominee_first_name',
        'nominee_last_name',
        'nomination_date',
        'nomination_options',
        'nominator',
        'relationship_to_nominee',
        'nominator_email',
        'nominator_classification',
        'nominator_department',
        'submitters_name',
        'submitters_email',
        'submitters_relationship_to_nominator',
        'reference_name',
        'reference_email',
        'reference_classification',
        'reference_department',
        'lateral_experience_recommendations',
        'other_lateral_experience',
        'development_program_recommendations',
        'other_development_program_experience',
        'rationale',
        'leadership_competencies',
        'additional_comments',
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

    // store user ids while generating users sheet
    private array $userIds = [];

    // store each nominee consent to share profile
    private array $consentToShareByUserId = [];

    public function __construct(public string $fileName, protected string $talentNominationEventId, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    private function getExcelSheetTitle(string $key): string
    {
        $title = Lang::get($key, [], $this->lang);

        return substr($title, 0, 31);
    }

    public function generate(): self
    {
        $this->writer = new Writer();
        $this->writer->openToFile($this->getPath());

        try {
            // Nominations overview sheet
            $this->writer->getCurrentSheet()->setName($this->getExcelSheetTitle('headings.nominations_overview'));
            $this->generateOverviewTab();

            // Nominee Profiles sheet
            $nomineeProfilesSheet = $this->writer->addNewSheetAndMakeItCurrent();
            $nomineeProfilesSheet->setName($this->getExcelSheetTitle('headings.nominee_profiles'));
            $this->generateNomineeProfilesTab();

            // Nomination Details sheet
            $nominationDetailsSheet = $this->writer->addNewSheetAndMakeItCurrent();
            $nominationDetailsSheet->setName($this->getExcelSheetTitle('headings.nominations_details'));
            $this->generateNominationDetailsTab();

            // Career experience sheet
            $careerExperienceSheet = $this->writer->addNewSheetAndMakeItCurrent();
            $careerExperienceSheet->setName($this->getExcelSheetTitle('headings.career_experience'));
            $this->generateCareerExperienceTab();

            // Community Interest sheet
            $communityInterestSheet = $this->writer->addNewSheetAndMakeItCurrent();
            $communityInterestSheet->setName($this->getExcelSheetTitle('headings.community_interest'));
            $this->generateCommunityInterestTab();
        } finally {
            $this->writer->close();
        }

        return $this;
    }

    /**
     * Generate the overview tab
     */
    private function generateOverviewTab(): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->overviewLocaleKeys);

        $this->writer->addRow($this->row($localizedHeaders));

        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $consentToShare = $talentNominationGroup->consentToShareProfile;
                $user = $talentNominationGroup->nominee;
                $nominators = $talentNominationGroup->nominations->map(function ($nomination) {
                    $name = $nomination->nominator_fallback_name;
                    if ($nomination->nominator) {
                        $name = "{$nomination->nominator->first_name} {$nomination->nominator->last_name}";
                    }

                    return $name;
                });
                $optionsStr = $this->getNominationOptions($talentNominationGroup);

                $values = [
                    $user->id,
                    $this->canShare($consentToShare, $user->first_name),
                    $this->canShare($consentToShare, $user->last_name),
                    $this->localizeEnum($talentNominationGroup->status, TalentNominationGroupStatus::class),
                    $nominators->join(', '),
                    $optionsStr,
                    $this->localizeEnum($this->isNominatedForAdvancement($talentNominationGroup) ? $talentNominationGroup->advancement_decision : null, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $this->isNominatedForAdvancement($talentNominationGroup) ? $this->sanitizeString(strip_tags($talentNominationGroup->advancement_notes ?? '')) : ''),
                    $this->localizeEnum($this->isNominatedForLateralMovement($talentNominationGroup) ? $talentNominationGroup->lateral_movement_decision : null, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $this->isNominatedForLateralMovement($talentNominationGroup) ? $this->sanitizeString(strip_tags($talentNominationGroup->lateral_movement_notes ?? '')) : ''),
                    $this->localizeEnum($this->isNominatedForDevelopmentPrograms($talentNominationGroup) ? $talentNominationGroup->development_programs_decision : null, TalentNominationGroupDecision::class),
                    $this->canShare($consentToShare, $this->isNominatedForDevelopmentPrograms($talentNominationGroup) ? $this->sanitizeString(strip_tags($talentNominationGroup->development_programs_notes ?? '')) : ''),
                ];

                $this->writer->addRow($this->row($values));
            }
        });
    }

    /**
     * Generate the nominee profiles tab
     */
    private function generateNomineeProfilesTab(): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->userProfileHeaderKeys);

        $this->writer->addRow($this->row($localizedHeaders));

        $query = $this->buildQuery();

        $query->chunk(200, function ($talentNominationGroups) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $user = $talentNominationGroup->nominee;

                // Skip if already processed
                if (in_array($user->id, $this->userIds)) {
                    continue;
                }

                $this->userIds[] = $user->id;
                $consentToShare = $talentNominationGroup->consentToShareProfile;
                $this->consentToShareByUserId[$user->id] = $consentToShare;

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

                $values = [
                    $user->id,
                    $this->canShare($consentToShare, $user->first_name),
                    $this->canShare($consentToShare, $user->last_name),
                    $this->canShare($consentToShare, $user->email ?? ''),
                    $this->canShare($consentToShare, $user->telephone ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class)),
                    $this->canShare($consentToShare, $this->localizeEnum($user?->citizenship, CitizenshipStatus::class)),
                    $this->canShare($consentToShare, $user->current_city ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnum($user?->current_province, ProvinceOrTerritory::class)),
                    $this->canShare($consentToShare, $this->localizeEnum($user?->preferred_lang, Language::class)),
                    $this->canShare($consentToShare, $this->lookingForLanguages($user)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->first_official_language, Language::class)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_completed)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->second_language_exam_validity)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class)),
                    $this->canShare($consentToShare, $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->computed_is_gov_employee)),
                    $this->canShare($consentToShare, $department?->name[$this->lang] ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class)),
                    $this->canShare($consentToShare, $user->work_email),
                    $this->canShare($consentToShare, $user->getClassification()),
                    $this->canShare($consentToShare, $this->yesOrNo($user->has_priority_entitlement)),
                    $this->canShare($consentToShare, $user->priority_number ?? ''),
                    $this->canShare($consentToShare, $this->yesOrNo($user->position_duration ? $user->wouldAcceptTemporary() : null)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray(
                        array_filter($user->location_preferences ?? [], function ($location) {
                            return $location !== WorkRegion::TELEWORK->name;
                        }),
                        WorkRegion::class
                    )),
                    $this->canShare($consentToShare, $this->localizeEnumArray($user->flexible_work_locations, FlexibleWorkLocation::class)),
                    $this->canShare($consentToShare, $user->location_exemptions),
                    $this->canShare($consentToShare, $this->yesOrNo($user->is_woman)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->is_visible_minority)),
                    $this->canShare($consentToShare, $this->yesOrNo($user->has_disability)),
                    $this->canShare($consentToShare, $userSkills->join(', ')),
                    $this->canShare($consentToShare, $this->yesOrNo($employeeProfile?->career_planning_lateral_move_interest)),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->career_planning_lateral_move_time_frame, TimeFrame::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($employeeProfile?->career_planning_promotion_move_interest)),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->career_planning_promotion_move_time_frame, TimeFrame::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class)),
                    $this->canShare($consentToShare, $employeeProfile?->eligible_retirement_year?->format('Y') ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_mentorship_status, Mentorship::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_mentorship_interest, Mentorship::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($employeeProfile?->career_planning_exec_interest)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_exec_coaching_status, ExecCoaching::class)),
                    $this->canShare($consentToShare, $this->localizeEnumArray($employeeProfile?->career_planning_exec_coaching_interest, ExecCoaching::class)),
                    $this->canShare($consentToShare, $employeeProfile?->nextRoleClassification->group ?? ''),
                    $this->canShare($consentToShare, $employeeProfile?->nextRoleClassification->level ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->next_role_target_role, TargetRole::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($employeeProfile?->next_role_is_c_suite_role)),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->next_role_c_suite_role_title, CSuiteRoleTitle::class)),
                    $this->canShare($consentToShare, $employeeProfile->next_role_job_title ?? ''),
                    $this->canShare($consentToShare, $employeeProfile?->nextRoleCommunity?->name[$this->lang] ?? ''),
                    $this->canShare($consentToShare, $nextRoleWorkStreams->join(',')),
                    $this->canShare($consentToShare, $nextRoleDepartments->join(', ')),
                    $this->canShare($consentToShare, $employeeProfile->next_role_additional_information ?? ''),
                    $this->canShare($consentToShare, $employeeProfile?->careerObjectiveClassification->group ?? ''),
                    $this->canShare($consentToShare, $employeeProfile?->careerObjectiveClassification->level ?? ''),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->career_objective_target_role, TargetRole::class)),
                    $this->canShare($consentToShare, $this->yesOrNo($employeeProfile?->career_objective_is_c_suite_role)),
                    $this->canShare($consentToShare, $this->localizeEnum($employeeProfile?->career_objective_c_suite_role_title, CSuiteRoleTitle::class)),
                    $this->canShare($consentToShare, $employeeProfile->career_objective_job_title ?? ''),
                    $this->canShare($consentToShare, $employeeProfile?->careerObjectiveCommunity?->name[$this->lang] ?? ' '),
                    $this->canShare($consentToShare, $careerObjectiveWorkStreams->join(', ')),
                    $this->canShare($consentToShare, $careerObjectiveDepartments->join(', ')),
                    $this->canShare($consentToShare, $employeeProfile->career_objective_additional_information ?? ''),
                    $this->canShare($consentToShare, $employeeProfile->career_planning_about_you ?? ''),
                    $this->canShare($consentToShare, $employeeProfile->career_planning_learning_goals ?? ''),
                    $this->canShare($consentToShare, $employeeProfile->career_planning_work_style ?? ''),
                    $this->canShare($consentToShare, $appliedPools->join(', ')),
                    $this->canShare($consentToShare, $offPlatformProcesses->join(', ')),
                ];

                $this->writer->addRow($this->row($values));
            }
        });
    }

    /**
     * Generate the nomination details tab
     */
    private function generateNominationDetailsTab(): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->nominationDetailsHeaderKeys);

        $this->writer->addRow($this->row($localizedHeaders));

        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $consentToShare = $talentNominationGroup->consentToShareProfile;
                $user = $talentNominationGroup->nominee;

                foreach ($talentNominationGroup->nominations as $nomination) {
                    $nominator = $nomination->nominator;
                    $submitter = $nomination->submitter;

                    $optionsStr = $this->getNominationOptionsForNomination($nomination);
                    $submitterRelationshipStr = $this->getSubmitterRelationship($nomination);
                    $lateralMovementOptionsStr = $this->getLateralMovementOptions($nomination);
                    $developmentProgramsStr = $this->getDevelopmentPrograms($nomination);
                    $referenceDetails = $this->getReferenceDetails($nomination);
                    $leadershipCompetenciesStr = $this->getLeadershipCompetencies($nomination);

                    $values = [
                        $user->id,
                        $this->canShare($consentToShare, $user->first_name), // nominee's first name
                        $this->canShare($consentToShare, $user->last_name), // nominee's last name
                        $nomination->submitted_at ? $nomination->submitted_at->format('Y-m-d') : '', // Date received
                        $optionsStr, // nomination options
                        $nominator?->getFullName() ?? $nomination->nominator_fallback_name, // nominator
                        $this->localizeEnum($nomination->nominee_relationship_to_nominator, TalentNominationNomineeRelationshipToNominator::class), // Nominee's relationship to nominator
                        $nominator->work_email ?? $nomination->nominator_fallback_work_email,
                        $nominator->currentClassification->formattedGroupAndLevel ?? '', // nominator classification
                        $nominator->department?->name[$this->lang] ?? '', // nominator department
                        $submitter?->getFullName() ?? '', // submitter's name
                        $submitter->work_email ?? '', // submitter's work email
                        $submitterRelationshipStr, // submitter's relationship to nominator
                        $referenceDetails['name'], // reference name
                        $referenceDetails['email'], // reference email
                        $referenceDetails['classification'], // reference classification
                        $referenceDetails['department'], // reference department
                        $this->canShare($consentToShare, $lateralMovementOptionsStr),  // lateral experience recommendations
                        $this->canShare($consentToShare, $nomination->lateral_movement_options_other ?? ''), // other lateral experience
                        $this->canShare($consentToShare, $developmentProgramsStr),   // development program recommendations
                        $this->canShare($consentToShare, $nomination->development_program_options_other ?? ''), // other development program experience
                        $this->canShare($consentToShare, $nomination->nomination_rationale ?? ''), // rationale
                        $leadershipCompetenciesStr, // leadership competencies
                        $this->canShare($consentToShare, $nomination->additional_comments ?? ''), // additional comments
                    ];

                    $this->writer->addRow($this->row($values));
                }
            }
        });
    }

    /**
     * Generate the career experience tab
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
     * Build work experience row
     */
    private function buildWorkExperienceRow(WorkExperience $exp): array
    {
        $consentToShare = $this->consentToShareByUserId[$exp->user_id] ?? false;
        $user = $exp->user;

        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);
        $workStreams = $this->getWorkStreams($exp);
        [$departmentNumber, $departmentSize, $departmentType] = $this->getDepartmentInfo($exp);

        return [
            $exp->user->id, // user id
            $this->canShare($consentToShare, $user->first_name),
            $this->canShare($consentToShare, $user->last_name),
            $this->canShare($consentToShare, $this->getExperienceType($exp)),
            $this->canShare($consentToShare, $exp->start_date ? $exp->start_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $exp->end_date ? $exp->end_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $isCurrent),
            $this->canShare($consentToShare, $numberOfMonths),
            $this->canShare($consentToShare, $exp->role ?? ''),
            $this->canShare($consentToShare, $this->getOrganizationName($exp)),
            $this->canShare($consentToShare, $this->localizeEnum($exp->employment_category, EmploymentCategory::class)),
            $this->canShare($consentToShare, $exp->division ?? ''),
            $this->canShare($consentToShare, $this->localizeEnum($exp->ext_size_of_organization, ExternalSizeOfOrganization::class)),
            $this->canShare($consentToShare, $this->localizeEnum($exp->ext_role_seniority, ExternalRoleSeniority::class)),
            $this->canShare($consentToShare, $this->localizeEnum($exp->gov_employment_type, GovEmployeeType::class)),
            $this->canShare($consentToShare, $this->localizeEnum($exp->gov_position_type, GovPositionType::class)),
            $this->canShare($consentToShare, $exp->classification?->group.($exp->classification?->level ? '-'.$exp->classification->level : '')),
            $this->canShare($consentToShare, $this->yesOrNo($exp->supervisory_position)),
            $this->canShare($consentToShare, $exp->supervised_employees_number ?? ''),
            $this->canShare($consentToShare, $exp->annual_budget_allocation ?? ''),
            $this->canShare($consentToShare, $this->localizeEnum($exp->c_suite_role_title, CSuiteRoleTitle::class)),
            $this->canShare($consentToShare, $exp->other_c_suite_title ?? ''),
            $this->canShare($consentToShare, $this->localizeEnum($exp->caf_employment_type, CafEmploymentType::class)),
            $this->canShare($consentToShare, $this->localizeEnum($exp->caf_rank, CafRank::class)),
            $this->canShare($consentToShare, $workStreams),
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
            $this->canShare($consentToShare, $exp->details ?? ''),
            $this->canShare($consentToShare, $this->getFeaturedSkills($exp)),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'achieve_results')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'character_leadership')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'mobilize_people')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect')),
            $this->canShare($consentToShare, $departmentNumber),
            $this->canShare($consentToShare, $departmentSize),
            $this->canShare($consentToShare, $departmentType),
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
        $consentToShare = $this->consentToShareByUserId[$exp->user_id] ?? false;
        $user = $exp->user;
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $this->canShare($consentToShare, $user->first_name),
            $this->canShare($consentToShare, $user->last_name),
            $this->canShare($consentToShare, $this->getExperienceType($exp)),
            $this->canShare($consentToShare, $exp->start_date ? $exp->start_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $exp->end_date ? $exp->end_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $isCurrent),
            $this->canShare($consentToShare, $numberOfMonths),
            // Work-specific fields (8-24) - mostly empty for education
            '', // role_or_title
            $this->canShare($consentToShare, $exp->institution ?? ''),
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
            $this->canShare($consentToShare, $this->localizeEnum($exp->type, EducationType::class)),
            $this->canShare($consentToShare, $exp->area_of_study ?? ''),
            $this->canShare($consentToShare, $this->localizeEnum($exp->status, EducationStatus::class)),
            $this->canShare($consentToShare, $exp->thesis_title ?? ''),
            // Community/Personal fields - empty for education
            '', // community_project_or_product
            '', // personal_learning_experience_description

            // Award fields - empty for education
            '', // award_recipient
            '', // issuing_org
            '', // awarded_scope
            '', // date_awarded
            $this->canShare($consentToShare, $exp->details ?? ''),
            $this->canShare($consentToShare, $this->getFeaturedSkills($exp)),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'achieve_results')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'character_leadership')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'mobilize_people')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect')),
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
        $consentToShare = $this->consentToShareByUserId[$exp->user_id] ?? false;
        $user = $exp->user;

        $isCurrent = $this->yesOrNo(empty($exp->end_date));

        return [
            $exp->user->id,
            $this->canShare($consentToShare, $user->first_name),
            $this->canShare($consentToShare, $user->last_name),
            $this->canShare($consentToShare, $this->getExperienceType($exp)),
            '', // start date
            '', // end date
            $this->canShare($consentToShare, $isCurrent),
            $this->canShare($consentToShare, $numberOfMonths),
            $this->canShare($consentToShare, $exp->title ?? ''),
            $this->canShare($consentToShare, $exp->issued_by ?? ''),
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
            $this->canShare($consentToShare, $this->localizeEnum($exp->awarded_to, AwardedTo::class)),
            $this->canShare($consentToShare, $exp->issued_by ?? ''),
            $this->canShare($consentToShare, $this->localizeEnum($exp->awarded_scope, AwardedScope::class)),
            $this->canShare($consentToShare, $exp->awarded_date?->format('Y-m-d') ?? ''),
            $this->canShare($consentToShare, $exp->details ?? ''),
            $this->canShare($consentToShare, $this->getFeaturedSkills($exp)),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'achieve_results')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'character_leadership')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'mobilize_people')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect')),
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
        $consentToShare = $this->consentToShareByUserId[$exp->user_id] ?? false;
        $user = $exp->user;
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $this->canShare($consentToShare, $user->first_name),
            $this->canShare($consentToShare, $user->last_name),
            $this->canShare($consentToShare, $this->getExperienceType($exp)),
            $this->canShare($consentToShare, $exp->start_date ? $exp->start_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $exp->end_date ? $exp->end_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $isCurrent),
            $this->canShare($consentToShare, $numberOfMonths),
            $this->canShare($consentToShare, $exp->title ?? ''),
            // $exp->organization ?? '',
            $this->canShare($consentToShare, $exp->organization ?? ''),
            '', // employment_category
            $this->canShare($consentToShare, $exp->group ?? ''),
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
            $this->canShare($consentToShare, $exp->project ?? ''),
            '', // personal learning description
            // Award fields - empty for community
            '', // award recipient
            '', // issuing organization
            '', // awarded_scope
            '', // date awarded
            $this->canShare($consentToShare, $exp->details ?? ''),
            $this->canShare($consentToShare, $this->getFeaturedSkills($exp)),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'achieve_results')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'character_leadership')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'mobilize_people')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect')),
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
        $consentToShare = $this->consentToShareByUserId[$exp->user_id] ?? false;
        $user = $exp->user;
        $isCurrent = $this->yesOrNo(empty($exp->end_date));
        $numberOfMonths = $exp->number_of_months ?? $this->calculateMonths($exp->start_date, $exp->end_date);

        return [
            $exp->user->id,
            $this->canShare($consentToShare, $user->first_name),
            $this->canShare($consentToShare, $user->last_name),
            $this->canShare($consentToShare, $this->getExperienceType($exp)),
            $this->canShare($consentToShare, $exp->start_date ? $exp->start_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $exp->end_date ? $exp->end_date->format('Y-m') : ''),
            $this->canShare($consentToShare, $isCurrent),
            $this->canShare($consentToShare, $numberOfMonths),
            $this->canShare($consentToShare, $exp->title ?? ''),
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
            $this->canShare($consentToShare, $exp->description ?? ''),
            // Award fields - empty for education
            '', // award recipient
            '', // issuing organization
            '', // awarded_scope
            '', // date awarded
            $this->canShare($consentToShare, $exp->details ?? ''),
            $this->canShare($consentToShare, $this->getFeaturedSkills($exp)),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'achieve_results')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'character_leadership')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'collaborate_with_partners_and_stakeholders')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'create_vision_and_strategy')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'mobilize_people')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'promote_innovation_and_guide_change')),
            $this->canShare($consentToShare, $this->getFeaturedSkillJustification($exp, 'uphold_integrity_and_respect')),
            // Department fields - empty for education
            '', // department_number
            '', // department_size
            '', // department_type
        ];

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

    /**
     * Generate the community interest tab
     */
    private function generateCommunityInterestTab() {}

    /**
     * Helper to check if nominated for advancement
     */
    private function isNominatedForAdvancement(TalentNominationGroup $group): bool
    {
        return $group->advancement_nomination_count > 0;
    }

    /**
     *  Helper to check if nominated for lateral movement
     */
    private function isNominatedForLateralMovement(TalentNominationGroup $group): bool
    {
        return $group->lateral_movement_nomination_count > 0;
    }

    /**
     * Helper to check if nominated for development programs
     */
    private function isNominatedForDevelopmentPrograms(TalentNominationGroup $group): bool
    {
        return $group->development_programs_nomination_count > 0;
    }

    /**
     * Get leadership competencies from nomination skills
     */
    private function getLeadershipCompetencies(TalentNomination $nomination): string
    {
        if ($nomination->skills->isEmpty()) {
            return '';
        }

        return $nomination->skills
            ->map(fn ($skill) => $skill->name[$this->lang] ?? '')
            ->filter()
            ->implode(', ');
    }

    /**
     * Helper to get reference details
     */
    private function getReferenceDetails(TalentNomination $nomination): array
    {
        $details = $this->getDetailsFromReferenceUser($nomination);

        if (empty($details['name']) && $nomination->advancement_reference_fallback_name) {
            $details['name'] = $nomination->advancement_reference_fallback_name;
        }

        if (empty($details['email']) && $nomination->advancement_reference_fallback_work_email) {
            $details['email'] = $nomination->advancement_reference_fallback_work_email;
        }

        if (empty($details['classification'])) {
            $details['classification'] = $this->getFallbackClassification($nomination);
        }

        if (empty($details['department'])) {
            $details['department'] = $this->getFallbackDepartment($nomination);
        }

        return $details;
    }

    /**
     * Helper to get reference details from reference user
     */
    private function getDetailsFromReferenceUser(TalentNomination $nomination): array
    {
        $details = [
            'name' => '',
            'email' => '',
            'classification' => '',
            'department' => '',
        ];

        $reference = $nomination->advancementReference
            ?? ($nomination->advancement_reference_id
                ? User::with(['currentClassification', 'department'])->find($nomination->advancement_reference_id)
                : null);

        if ($reference) {
            $details['name'] = $reference->getFullName();
            $details['email'] = $reference->work_email ?? $reference->email ?? '';
            $details['classification'] = $reference->currentClassification->formattedGroupAndLevel ?? '';
            $details['department'] = $reference->department?->name[$this->lang] ?? '';
        }

        return $details;
    }

    /**
     * Helper to get fallback classification from nomination
     */
    private function getFallbackClassification(TalentNomination $nomination): string
    {
        if ($nomination->advancementReferenceFallbackClassification) {
            return $nomination->advancementReferenceFallbackClassification->formattedGroupAndLevel;
        }

        if (isset($nomination->advancement_reference_fallback_classification_group) &&
            isset($nomination->advancement_reference_fallback_classification_level) &&
            $nomination->advancement_reference_fallback_classification_group &&
            $nomination->advancement_reference_fallback_classification_level) {
            return $nomination->advancement_reference_fallback_classification_group.'-'.
                   $nomination->advancement_reference_fallback_classification_level;
        }

        return '';
    }

    /**
     * Helper to get fallback department from nomination
     */
    private function getFallbackDepartment(TalentNomination $nomination): string
    {
        if ($nomination->advancementReferenceFallbackDepartment) {
            return $nomination->advancementReferenceFallbackDepartment->name[$this->lang] ?? '';
        }

        if (isset($nomination->advancement_reference_fallback_department_name) &&
        $nomination->advancement_reference_fallback_department_name) {
            return $nomination->advancement_reference_fallback_department_name;
        }

        return '';
    }

    /**
     * Helper to extract lateral movement options logic
     */
    private function getLateralMovementOptions(TalentNomination $nomination): string
    {
        $lateralMovementOptionsStr = '';
        $otherLateralExperience = $nomination->lateral_movement_options_other ?? '';

        if ($nomination->lateral_movement_options) {
            $lateralMovementOptions = [];
            foreach ($nomination->lateral_movement_options as $option) {
                if ($option === 'OTHER') {
                    continue;
                }
                $lateralMovementOptions[] = $this->localizeEnum($option, TalentNominationLateralMovementOption::class);
            }

            if ($otherLateralExperience) {
                $lateralMovementOptions[] = $this->localizeHeading('other').' '.$otherLateralExperience;
            }

            $lateralMovementOptionsStr = implode(', ', $lateralMovementOptions);
        }

        return $lateralMovementOptionsStr;
    }

    /**
     * Helper to extract development programs logic
     */
    private function getDevelopmentPrograms(TalentNomination $nomination): string
    {
        $developmentProgramsStr = '';
        if ($nomination->developmentProgramsThroughPivot->count() > 0 || $nomination->development_program_options_other) {
            $developmentPrograms = [];

            /** @var DevelopmentProgram $developmentProgram */
            foreach ($nomination->developmentProgramsThroughPivot as $developmentProgram) {
                $developmentPrograms[] = $developmentProgram->name[$this->lang];
            }

            if ($nomination->development_program_options_other) {
                $developmentPrograms[] = $this->localizeHeading('other').' '.$nomination->development_program_options_other;
            }

            $developmentProgramsStr = implode(', ', $developmentPrograms);
        }

        return $developmentProgramsStr;
    }

    /**
     * Extract nomination options logic
     */
    private function getNominationOptions(TalentNominationGroup $talentNominationGroup): string
    {
        $options = [];
        if ($this->isNominatedForAdvancement($talentNominationGroup)) {
            $options[] = $this->localizeHeading('advancement')." ({$talentNominationGroup->advancement_nomination_count})";
        }
        if ($this->isNominatedForLateralMovement($talentNominationGroup)) {
            $options[] = $this->localizeHeading('lateral_movement')." ({$talentNominationGroup->lateral_movement_nomination_count})";
        }
        if ($this->isNominatedForDevelopmentPrograms($talentNominationGroup)) {
            $options[] = $this->localizeHeading('development_programs')." ({$talentNominationGroup->development_programs_nomination_count})";
        }

        return implode(', ', $options);
    }

    /**
     * Helper to extract nomination options for a single nomination
     */
    private function getNominationOptionsForNomination(TalentNomination $nomination): string
    {
        $options = [];
        if ($nomination->nominate_for_advancement) {
            $options[] = $this->localizeHeading('advancement');
        }
        if ($nomination->nominate_for_lateral_movement) {
            $options[] = $this->localizeHeading('lateral_movement');
        }
        if ($nomination->nominate_for_development_programs) {
            $options[] = $this->localizeHeading('development_programs');
        }

        return implode(', ', $options);
    }

    /**
     * Helper to extract submitter relationship logic
     */
    private function getSubmitterRelationship(TalentNomination $nomination): string
    {
        if ($nomination->submitter_relationship_to_nominator_other) {
            return $nomination->submitter_relationship_to_nominator_other;
        }

        if (! $nomination->submitter_relationship_to_nominator) {
            return '';
        }

        return $this->localizeEnum(
            $nomination->submitter_relationship_to_nominator->name,
            TalentNominationSubmitterRelationshipToNominator::class
        );
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
        $query = TalentNominationGroup::with([
            'talentNominationEvent',
            'nominee' => function ($query) {
                $query->with([
                    'department',
                    'currentClassification',
                    'userSkills.skill:id,key,name',
                    'personalExperiences',
                    'personalExperiences.userSkills.skill',
                    'employeeProfile' => [
                        'nextRoleWorkStreams',
                        'nextRoleDepartments',
                        'careerObjectiveWorkStreams',
                        'careerObjectiveDepartments',
                        'nextRoleClassification',
                        'careerObjectiveClassification',
                        'nextRoleCommunity',
                        'careerObjectiveCommunity',
                    ],
                    'poolCandidates' => function ($query) {
                        $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
                            ->with('pool.classification');
                    },
                    'offPlatformRecruitmentProcesses.classification',
                    'offPlatformRecruitmentProcesses.department',
                ]);
            },
            'nominations' => [
                'nominator.department',
                'nominator.currentClassification',
                'submitter',
                'advancementReference.department',
                'advancementReference.currentClassification',
                'nominatorFallbackClassification',
                'nominatorFallbackDepartment',
                'advancementReferenceFallbackClassification',
                'advancementReferenceFallbackDepartment',
                'developmentProgramsThroughPivot',
                'skills',
            ],
        ])->where('talent_nomination_event_id', $this->talentNominationEventId);

        $this->applyFilters($query, []);

        /** @var Builder<TalentNominationGroup> $query */
        $query
            ->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee();

        return $query;

    }
}
