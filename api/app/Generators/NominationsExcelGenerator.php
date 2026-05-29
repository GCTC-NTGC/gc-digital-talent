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
use App\Models\DevelopmentProgram;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

class NominationsExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    public function __construct(public string $fileName, protected string $talentNominationEventId, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->writer = new Writer();
        $this->writer->openToFile($this->getPath());
        $this->writer->getCurrentSheet()->setName($this->getExcelSheetTitle('headings.nominations_overview'));

        $this->generateOverviewTab();

        $profileSheet = $this->writer->addNewSheetAndMakeItCurrent();
        $profileSheet->setName($this->getExcelSheetTitle('headings.nominee_profiles'));
        $this->generateNomineeProfilesTab();

        $detailsSheet = $this->writer->addNewSheetAndMakeItCurrent();
        $detailsSheet->setName($this->getExcelSheetTitle('headings.nominations_details'));
        $this->generateNominationDetailsTab();

        $this->writer->close();

        return $this;
    }

    private function generateOverviewTab(): void
    {
        $columns = $this->overviewColumns();

        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), array_keys($columns))
        ));

        $this->buildQuery()->chunk(200, function ($groups) use ($columns) {
            foreach ($groups as $group) {
                $this->writer->addRow(Row::fromValues(
                    array_map(fn ($fn) => $fn($group), $columns)
                ));
            }
        });
    }

    /** @return array<string, callable> */
    private function overviewColumns(): array
    {
        return [
            'nominee_user_id' => fn ($group) => $group->nominee->id,
            'nominee_first_name' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->first_name),
            'nominee_last_name' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->last_name),

            'nomination_status' => fn ($group) => $this->localizeEnum($group->status, TalentNominationGroupStatus::class),
            'nominators' => fn ($group) => $group->nominations->map(function ($nomination) {
                $name = $nomination->nominator_fallback_name;
                if ($nomination->nominator) {
                    $name = "{$nomination->nominator->first_name} {$nomination->nominator->last_name}";
                }

                return $name;
            })->join(', '),
            'nomination_options' => fn ($group) => $this->getNominationOptions($group),

            'advancement_approval' => fn ($group) => $this->localizeEnum(
                $this->isNominatedForAdvancement($group) ? $group->advancement_decision : null,
                TalentNominationGroupDecision::class
            ),
            'advancement_approval_notes' => fn ($group) => $this->canShare(
                $group->consentToShareProfile,
                $this->isNominatedForAdvancement($group) ? $this->sanitizeString(strip_tags($group->advancement_notes ?? '')) : ''
            ),

            'lateral_movement_approval' => fn ($group) => $this->localizeEnum(
                $this->isNominatedForLateralMovement($group) ? $group->lateral_movement_decision : null,
                TalentNominationGroupDecision::class
            ),
            'lateral_movement_approval_notes' => fn ($group) => $this->canShare(
                $group->consentToShareProfile,
                $this->isNominatedForLateralMovement($group) ? $this->sanitizeString(strip_tags($group->lateral_movement_notes ?? '')) : ''
            ),

            'development_program_approval' => fn ($group) => $this->localizeEnum(
                $this->isNominatedForDevelopmentPrograms($group) ? $group->development_programs_decision : null,
                TalentNominationGroupDecision::class
            ),
            'development_program_approval_notes' => fn ($group) => $this->canShare(
                $group->consentToShareProfile,
                $this->isNominatedForDevelopmentPrograms($group) ? $this->sanitizeString(strip_tags($group->development_programs_notes ?? '')) : ''
            ),
        ];
    }

    private function generateNomineeProfilesTab(): void
    {
        $columns = $this->profileColumns();

        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), array_keys($columns))
        ));

        $processedUserIds = [];

        $this->buildQuery()->chunk(200, function ($groups) use ($columns, &$processedUserIds) {
            foreach ($groups as $group) {
                $user = $group->nominee;

                if (in_array($user->id, $processedUserIds)) {
                    continue;
                }

                $processedUserIds[] = $user->id;

                $this->writer->addRow(Row::fromValues(
                    array_map(fn ($fn) => $fn($group), $columns)
                ));
            }
        });
    }

    /** @return array<string, callable> */
    private function profileColumns(): array
    {
        return [
            'id' => fn ($group) => $group->nominee->id,
            'first_name' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->first_name),
            'last_name' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->last_name),
            'email' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->email ?? ''),
            'phone' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->telephone ?? ''),

            'armed_forces_status' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->armed_forces_status, ArmedForcesStatus::class)),
            'citizenship' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->citizenship, CitizenshipStatus::class)),
            'current_city' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->current_city ?? ''),
            'current_province' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->current_province, ProvinceOrTerritory::class)),

            'preferred_communication_language' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->preferred_lang, Language::class)),
            'interested_in_languages' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->lookingForLanguages($group->nominee)),
            'first_official_language' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->first_official_language, Language::class)),
            'estimated_language_ability' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->estimated_language_ability, EstimatedLanguageAbility::class)),
            'second_language_exam_completed' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->second_language_exam_completed)),
            'second_language_exam_validity' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->second_language_exam_validity)),
            'comprehension_level' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->comprehension_level, EvaluatedLanguageAbility::class)),
            'writing_level' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->written_level, EvaluatedLanguageAbility::class)),
            'oral_interaction_level' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->verbal_level, EvaluatedLanguageAbility::class)),

            'government_employee' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->computed_is_gov_employee)),
            'department' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->department?->name[$this->lang] ?? ''),
            'employee_type' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->computed_gov_employee_type, GovEmployeeType::class)),
            'work_email' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->work_email),
            'classification' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->getClassification()),
            'priority_entitlement' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->has_priority_entitlement)),
            'priority_number' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->priority_number ?? ''),

            'accept_temporary' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->position_duration ? $group->nominee->wouldAcceptTemporary() : null)),
            'accepted_operational_requirements' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->getOperationalRequirements()['accepted'], OperationalRequirement::class)),
            'location_preferences' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray(
                array_filter($group->nominee->location_preferences ?? [], fn ($l) => $l !== WorkRegion::TELEWORK->name),
                WorkRegion::class
            )),
            'flexible_work_locations' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->flexible_work_locations, FlexibleWorkLocation::class)),
            'location_exemptions' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->location_exemptions),

            'woman' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->is_woman)),
            'indigenous' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray(
                Arr::where($group->nominee->indigenous_communities ?? [], fn ($c) => $c !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name),
                IndigenousCommunity::class
            )),
            'visible_minority' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->is_visible_minority)),
            'disability' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->has_disability)),

            'skills' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->userSkills->map(fn ($us) => $us->skill->name[$this->lang] ?? '')->join(', ')),

            'career_planning_lateral_move_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->employeeProfile?->career_planning_lateral_move_interest)),
            'career_planning_lateral_move_time_frame' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->career_planning_lateral_move_time_frame, TimeFrame::class)),
            'career_planning_lateral_move_organization_type' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_lateral_move_organization_type, OrganizationTypeInterest::class)),
            'career_planning_promotion_move_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->employeeProfile?->career_planning_promotion_move_interest)),
            'career_planning_promotion_move_time_frame' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->career_planning_promotion_move_time_frame, TimeFrame::class)),
            'career_planning_promotion_move_organization_type' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_promotion_move_organization_type, OrganizationTypeInterest::class)),
            'career_planning_learning_opportunities_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_learning_opportunities_interest, LearningOpportunitiesInterest::class)),
            'eligible_retirement_year' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->eligible_retirement_year?->format('Y') ?? ''),
            'career_planning_mentorship_status' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_mentorship_status, Mentorship::class)),
            'career_planning_mentorship_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_mentorship_interest, Mentorship::class)),
            'career_planning_exec_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->employeeProfile?->career_planning_exec_interest)),
            'career_planning_exec_coaching_status' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_exec_coaching_status, ExecCoaching::class)),
            'career_planning_exec_coaching_interest' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnumArray($group->nominee->employeeProfile?->career_planning_exec_coaching_interest, ExecCoaching::class)),

            'next_role_target_classification_group' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->nextRoleClassification->group ?? ''),
            'next_role_target_classification_level' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->nextRoleClassification->level ?? ''),
            'next_role_target_role' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->next_role_target_role, TargetRole::class)),
            'next_role_is_c_suite_role' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->employeeProfile?->next_role_is_c_suite_role)),
            'next_role_c_suite_role_title' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->next_role_c_suite_role_title, CSuiteRoleTitle::class)),
            'next_role_job_title' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->next_role_job_title ?? ''),
            'next_role_functional_community' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->nextRoleCommunity?->name[$this->lang] ?? ''),
            'next_role_work_streams' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->nextRoleWorkStreams->map(fn ($ws) => $ws->name[$this->lang] ?? '')->join(', ')),
            'next_role_departments' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->nextRoleDepartments->map(fn ($d) => $d->name[$this->lang] ?? '')->join(', ')),
            'next_role_additional_information' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->next_role_additional_information ?? ''),

            'career_objective_target_classification_group' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->careerObjectiveClassification->group ?? ''),
            'career_objective_target_classification_level' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->careerObjectiveClassification->level ?? ''),
            'career_objective_target_role' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->career_objective_target_role, TargetRole::class)),
            'career_objective_is_c_suite_role' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->yesOrNo($group->nominee->employeeProfile?->career_objective_is_c_suite_role)),
            'career_objective_c_suite_role_title' => fn ($group) => $this->canShare($group->consentToShareProfile, $this->localizeEnum($group->nominee->employeeProfile?->career_objective_c_suite_role_title, CSuiteRoleTitle::class)),
            'career_objective_job_title' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->career_objective_job_title ?? ''),
            'career_objective_functional_community' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->careerObjectiveCommunity?->name[$this->lang] ?? ''),
            'career_objective_work_streams' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->careerObjectiveWorkStreams->map(fn ($ws) => $ws->name[$this->lang] ?? '')->join(', ')),
            'career_objective_departments' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile?->careerObjectiveDepartments->map(fn ($d) => $d->name[$this->lang] ?? '')->join(', ')),
            'career_objective_additional_information' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->career_objective_additional_information ?? ''),

            'career_planning_about_you' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->career_planning_about_you ?? ''),
            'career_planning_learning_goals' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->career_planning_learning_goals ?? ''),
            'career_planning_work_style' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->employeeProfile->career_planning_work_style ?? ''),

            'digital_talent_processes' => fn ($group) => $this->canShare($group->consentToShareProfile, $group->nominee->poolCandidates->map(function ($candidate) {
                return sprintf(
                    '%s - %s - %s - %s',
                    $candidate->pool->classification->formattedGroupAndLevel,
                    $candidate->pool->name[$this->lang] ?? '',
                    $candidate->pool->process_number,
                    $candidate->suspended_at
                        ? Lang::get('common.not_interested', [], $this->lang)
                        : Lang::get('common.open_to_job_offers', [], $this->lang)
                );
            })->join(', ')),

            'off_platform_processes_not_verified' => fn ($group) => $this->canShare(
                $group->consentToShareProfile,
                $this->formatOffPlatformProcesses($group->nominee->offPlatformRecruitmentProcesses)
            ),
        ];
    }

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

    private function generateNominationDetailsTab(): void
    {
        $this->writer->addRow(Row::fromValues(
            array_map(fn ($key) => $this->localizeHeading($key), $this->nominationDetailsHeaderKeys)
        ));

        $this->buildQuery()->chunk(200, function ($groups) {
            foreach ($groups as $group) {
                $columns = $this->nominationDetailsColumns($group);

                foreach ($group->nominations as $nomination) {
                    $this->writer->addRow(Row::fromValues(
                        array_map(fn ($fn) => $fn($nomination), $columns)
                    ));
                }
            }
        });
    }

    /** @return array<string, callable> */
    private function nominationDetailsColumns(TalentNominationGroup $group): array
    {
        $consentToShare = $group->consentToShareProfile;
        $user = $group->nominee;

        return [
            'nominee_user_id' => fn ($nomination) => $user->id,
            'nominee_first_name' => fn ($nomination) => $this->canShare($consentToShare, $user->first_name),
            'nominee_last_name' => fn ($nomination) => $this->canShare($consentToShare, $user->last_name),

            'nomination_date' => fn ($nomination) => $nomination->submitted_at ? $nomination->submitted_at->format('Y-m-d') : '',
            'nomination_options' => fn ($nomination) => $this->getNominationOptionsForNomination($nomination),

            'nominator' => fn ($nomination) => $nomination->nominator?->getFullName() ?? $nomination->nominator_fallback_name,
            'relationship_to_nominee' => fn ($nomination) => $this->localizeEnum($nomination->nominee_relationship_to_nominator, TalentNominationNomineeRelationshipToNominator::class),
            'nominator_email' => fn ($nomination) => $nomination->nominator->work_email ?? $nomination->nominator_fallback_work_email,
            'nominator_classification' => fn ($nomination) => $nomination->nominator->currentClassification->formattedGroupAndLevel ?? '',
            'nominator_department' => fn ($nomination) => $nomination->nominator->department?->name[$this->lang] ?? '',

            'submitters_name' => fn ($nomination) => $nomination->submitter?->getFullName() ?? '',
            'submitters_email' => fn ($nomination) => $nomination->submitter->work_email ?? '',
            'submitters_relationship_to_nominator' => fn ($nomination) => $this->getSubmitterRelationship($nomination),

            'reference_name' => fn ($nomination) => $this->getReferenceDetails($nomination)['name'],
            'reference_email' => fn ($nomination) => $this->getReferenceDetails($nomination)['email'],
            'reference_classification' => fn ($nomination) => $this->getReferenceDetails($nomination)['classification'],
            'reference_department' => fn ($nomination) => $this->getReferenceDetails($nomination)['department'],

            'lateral_experience_recommendations' => fn ($nomination) => $this->canShare($consentToShare, $this->getLateralMovementOptions($nomination)),
            'other_lateral_experience' => fn ($nomination) => $this->canShare($consentToShare, $nomination->lateral_movement_options_other ?? ''),
            'development_program_recommendations' => fn ($nomination) => $this->canShare($consentToShare, $this->getDevelopmentPrograms($nomination)),
            'other_development_program_experience' => fn ($nomination) => $this->canShare($consentToShare, $nomination->development_program_options_other ?? ''),

            'rationale' => fn ($nomination) => $this->canShare($consentToShare, $nomination->nomination_rationale ?? ''),
            'leadership_competencies' => fn ($nomination) => $this->getLeadershipCompetencies($nomination),
            'additional_comments' => fn ($nomination) => $this->canShare($consentToShare, $nomination->additional_comments ?? ''),
        ];
    }

    private function getExcelSheetTitle(string $key): string
    {
        $title = Lang::get($key, [], $this->lang);

        return substr($title, 0, 31);
    }

    private function isNominatedForAdvancement(TalentNominationGroup $group): bool
    {
        return $group->advancement_nomination_count > 0;
    }

    private function isNominatedForLateralMovement(TalentNominationGroup $group): bool
    {
        return $group->lateral_movement_nomination_count > 0;
    }

    private function isNominatedForDevelopmentPrograms(TalentNominationGroup $group): bool
    {
        return $group->development_programs_nomination_count > 0;
    }

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

    private function getDetailsFromReferenceUser(TalentNomination $nomination): array
    {
        $details = ['name' => '', 'email' => '', 'classification' => '', 'department' => ''];

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

    private function getLateralMovementOptions(TalentNomination $nomination): string
    {
        if (! $nomination->lateral_movement_options) {
            return '';
        }

        $options = [];
        foreach ($nomination->lateral_movement_options as $option) {
            if ($option === 'OTHER') {
                continue;
            }
            $options[] = $this->localizeEnum($option, TalentNominationLateralMovementOption::class);
        }

        if ($nomination->lateral_movement_options_other) {
            $options[] = $this->localizeHeading('other').' '.$nomination->lateral_movement_options_other;
        }

        return implode(', ', $options);
    }

    private function getDevelopmentPrograms(TalentNomination $nomination): string
    {
        if ($nomination->developmentProgramsThroughPivot->isEmpty() && ! $nomination->development_program_options_other) {
            return '';
        }

        $programs = [];

        /** @var DevelopmentProgram $program */
        foreach ($nomination->developmentProgramsThroughPivot as $program) {
            $programs[] = $program->name[$this->lang];
        }

        if ($nomination->development_program_options_other) {
            $programs[] = $this->localizeHeading('other').' '.$nomination->development_program_options_other;
        }

        return implode(', ', $programs);
    }

    private function getNominationOptions(TalentNominationGroup $group): string
    {
        $options = [];

        if ($this->isNominatedForAdvancement($group)) {
            $options[] = $this->localizeHeading('advancement')." ({$group->advancement_nomination_count})";
        }
        if ($this->isNominatedForLateralMovement($group)) {
            $options[] = $this->localizeHeading('lateral_movement')." ({$group->lateral_movement_nomination_count})";
        }
        if ($this->isNominatedForDevelopmentPrograms($group)) {
            $options[] = $this->localizeHeading('development_programs')." ({$group->development_programs_nomination_count})";
        }

        return implode(', ', $options);
    }

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

    private function formatOffPlatformProcesses($processes): string
    {
        return collect($processes)
            ->map(fn ($process) => $this->formatOffPlatformProcess($process))
            ->join(', ');
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

    /** @return Builder<TalentNominationGroup> */
    private function buildQuery(): Builder
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
        $query->authorizedToView(['userId' => $this->authenticatedUserId])
            ->isVerifiedGovEmployee();

        return $query;
    }
}
