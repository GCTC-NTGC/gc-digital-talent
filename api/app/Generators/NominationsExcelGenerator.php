<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
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
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

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
        $this->spreadsheet = new Spreadsheet;

        // Nominations overview sheet
        $overviewSheet = $this->spreadsheet->getActiveSheet();
        $overviewSheet->setTitle($this->getExcelSheetTitle('headings.nominations_overview'));

        // Nominee Profiles sheet
        $nomineeProfilesSheet = $this->spreadsheet->createSheet();
        $nomineeProfilesSheet->setTitle($this->getExcelSheetTitle('headings.nominee_profiles'));

        // Nomination Details sheet
        $nominationDetailsSheet = $this->spreadsheet->createSheet();
        $nominationDetailsSheet->setTitle($this->getExcelSheetTitle('headings.nominations_details'));

        // Generate data for sheets
        $this->generateOverviewTab($overviewSheet);
        $this->generateNomineeProfilesTab($nomineeProfilesSheet);
        $this->generateNominationDetailsTab($nominationDetailsSheet);

        return $this;
    }

    /**
     * Generate the overview tab
     */
    private function generateOverviewTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->overviewLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');
        $row = 2;
        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$row) {
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

                $sheet->fromArray($values, null, sprintf('A%d', $row));
                $row++;
            }
        });
    }

    /**
     * Generate the nominee profiles tab
     */
    private function generateNomineeProfilesTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->userProfileHeaderKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $row = 2;
        $processedUserIds = [];
        $query = $this->buildQuery();

        $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$row, &$processedUserIds) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $user = $talentNominationGroup->nominee;

                // Skip if already processed
                if (in_array($user->id, $processedUserIds)) {
                    continue;
                }

                $processedUserIds[] = $user->id;
                $consentToShare = $talentNominationGroup->consentToShareProfile;

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

                $sheet->fromArray($values, null, sprintf('A%d', $row));
                $row++;
            }
        });
    }

    /**
     * Generate the nomination details tab
     */
    private function generateNominationDetailsTab($sheet): void
    {
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->nominationDetailsHeaderKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');

        $row = 2;
        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($sheet, &$row) {
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
                        $submitter->getFullName() ?? '', // submitter's name
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

                    $sheet->fromArray($values, null, sprintf('A%d', $row));
                    $row++;
                }
            }
        });
    }

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
        $nomination->loadMissing('skills');

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
        if ($nomination->developmentPrograms->count() > 0 || $nomination->development_program_options_other) {
            $developmentPrograms = [];

            foreach ($nomination->developmentPrograms as $developmentProgram) {
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
                'developmentPrograms',
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
