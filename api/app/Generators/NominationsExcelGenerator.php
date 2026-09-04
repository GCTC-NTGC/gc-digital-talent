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
use App\Enums\NineBoxRating;
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
use App\Generators\Field\Field;
use App\Generators\Field\RendersFields;
use App\Models\DevelopmentProgram;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesCareerExperienceSheet;
use App\Traits\Generator\GeneratesCommunityInterestSheet;
use App\Traits\Generator\GeneratesFile;
use App\Traits\Generator\GeneratesSharedExcelData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Lang;
use OpenSpout\Writer\XLSX\Writer;

class NominationsExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesCareerExperienceSheet;
    use GeneratesCommunityInterestSheet;
    use GeneratesFile;
    use GeneratesSharedExcelData;
    use RendersFields;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    public function __construct(public string $fileName, protected string $talentNominationEventId, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);

        // apply consent to share profile check
        $this->enforceConsentToShare = true;
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
     * Write the localized heading of every field as one row
     *
     * @param  list<Field>  $fields
     */
    private function writeHeadingRow(array $fields): void
    {
        $this->writer->addRow($this->row(
            array_map(fn (Field $field) => $this->localizeHeading($field->heading), $fields)
        ));
    }

    /**
     * Write the rendered value of every field as one row
     *
     * @param  list<Field>  $fields
     */
    private function writeDataRow(array $fields, mixed $context): void
    {
        $this->writer->addRow($this->row(
            array_map(fn (Field $field) => $this->render($field, $context), $fields)
        ));
    }

    /**
     * Generate the overview tab
     */
    private function generateOverviewTab(): void
    {
        $fields = $this->overviewFields();

        $this->writeHeadingRow($fields);

        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($fields) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $this->writeDataRow($fields, $talentNominationGroup);
            }
        });
    }

    /**
     * Fields of the overview tab, in column order
     *
     * @return list<Field>
     */
    private function overviewFields(): array
    {
        $consented = fn ($g) => (bool) $g->consentToShareProfile;

        return [
            Field::text('nominee_user_id', fn ($g) => $g->nominee->id),
            Field::text('nominee_first_name', fn ($g) => $g->nominee->first_name),
            Field::text('nominee_last_name', fn ($g) => $g->nominee->last_name),
            Field::enum('nomination_status', TalentNominationGroupStatus::class, fn ($g) => $g->status),
            Field::text('nominators', fn ($g) => $this->getNominators($g)),
            Field::text('nomination_options', fn ($g) => $this->getNominationOptions($g)),
            Field::enum('advancement_approval', TalentNominationGroupDecision::class, fn ($g) => $g->advancement_decision)
                ->visible(fn ($g) => $this->isNominatedForAdvancement($g), ''),
            Field::text('advancement_classifications', fn ($g) => $this->getAdvancementClassifications($g))
                ->visible($consented),
            Field::html('advancement_approval_notes', fn ($g) => $this->isNominatedForAdvancement($g) ? $g->advancement_notes : null)
                ->visible($consented),
            Field::enum('lateral_movement_approval', TalentNominationGroupDecision::class, fn ($g) => $g->lateral_movement_decision)
                ->visible(fn ($g) => $this->isNominatedForLateralMovement($g), ''),
            Field::html('lateral_movement_approval_notes', fn ($g) => $this->isNominatedForLateralMovement($g) ? $g->lateral_movement_notes : null)
                ->visible($consented),
            Field::enum('development_program_approval', TalentNominationGroupDecision::class, fn ($g) => $g->development_programs_decision)
                ->visible(fn ($g) => $this->isNominatedForDevelopmentPrograms($g), ''),
            Field::html('development_program_approval_notes', fn ($g) => $this->isNominatedForDevelopmentPrograms($g) ? $g->development_programs_notes : null)
                ->visible($consented),
        ];
    }

    /**
     * Names of every nominator in a group, separated by commas
     */
    private function getNominators(TalentNominationGroup $group): string
    {
        return $group->nominations->map(function ($nomination) {
            $name = $nomination->nominator_fallback_name;
            if ($nomination->nominator) {
                $name = "{$nomination->nominator->first_name} {$nomination->nominator->last_name}";
            }

            return $name;
        })->join(', ');
    }

    /**
     * Advancement classifications of a group, separated by commas
     */
    private function getAdvancementClassifications(TalentNominationGroup $group): string
    {
        return $group->advancementClassifications->map(function ($classification) {
            return $classification->formattedGroupAndLevel ?? ($classification->name[$this->lang] ?? $this->localize('common.not_found'));
        })->join(', ');
    }

    /**
     * Generate the nominee profiles tab
     */
    private function generateNomineeProfilesTab(): void
    {
        $fields = $this->nomineeProfileFields();

        $this->writeHeadingRow($fields);

        $query = $this->buildQuery();

        $query->chunk(200, function ($talentNominationGroups) use ($fields) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                $user = $talentNominationGroup->nominee;

                // Skip if already processed
                if (in_array($user->id, $this->userIds)) {
                    continue;
                }

                $this->userIds[] = $user->id;
                $this->consentToShareByUserId[$user->id] = $talentNominationGroup->consentToShareProfile;

                $this->writeDataRow($fields, $talentNominationGroup);
            }
        });
    }

    /**
     * Fields of the nominee profiles tab, in column order
     *
     * @return list<Field>
     */
    private function nomineeProfileFields(): array
    {
        $consented = fn ($g) => (bool) $g->consentToShareProfile;

        return [
            Field::text('id', fn ($g) => $g->nominee->id),
            Field::text('first_name', fn ($g) => $g->nominee->first_name),
            Field::text('last_name', fn ($g) => $g->nominee->last_name),
            Field::text('email', fn ($g) => $g->nominee->email)
                ->visible($consented),
            Field::text('phone', fn ($g) => $g->nominee->telephone)
                ->visible($consented),
            Field::enum('armed_forces_status', ArmedForcesStatus::class, fn ($g) => $g->nominee->armed_forces_status)
                ->visible($consented),
            Field::enum('citizenship', CitizenshipStatus::class, fn ($g) => $g->nominee->citizenship)
                ->visible($consented),
            Field::text('current_city', fn ($g) => $g->nominee->current_city)
                ->visible($consented),
            Field::enum('current_province', ProvinceOrTerritory::class, fn ($g) => $g->nominee->current_province)
                ->visible($consented),
            Field::enum('preferred_communication_language', Language::class, fn ($g) => $g->nominee->preferred_lang)
                ->visible($consented),
            Field::text('interested_in_languages', fn ($g) => $this->lookingForLanguages($g->nominee))
                ->visible($consented),
            Field::enum('first_official_language', Language::class, fn ($g) => $g->nominee->first_official_language)
                ->visible($consented),
            Field::enum('estimated_language_ability', EstimatedLanguageAbility::class, fn ($g) => $g->nominee->estimated_language_ability)
                ->visible($consented),
            Field::bool('second_language_exam_completed', fn ($g) => $g->nominee->second_language_exam_completed)
                ->visible($consented),
            Field::bool('second_language_exam_validity', fn ($g) => $g->nominee->second_language_exam_validity)
                ->visible($consented),
            Field::enum('comprehension_level', EvaluatedLanguageAbility::class, fn ($g) => $g->nominee->comprehension_level)
                ->visible($consented),
            Field::enum('writing_level', EvaluatedLanguageAbility::class, fn ($g) => $g->nominee->written_level)
                ->visible($consented),
            Field::enum('oral_interaction_level', EvaluatedLanguageAbility::class, fn ($g) => $g->nominee->verbal_level)
                ->visible($consented),
            Field::bool('government_employee', fn ($g) => $g->nominee->computed_is_gov_employee)
                ->visible($consented),
            Field::text('department', fn ($g) => $g->nominee->department()->first()?->name[$this->lang])
                ->visible($consented),
            Field::enum('employee_type', GovEmployeeType::class, fn ($g) => $g->nominee->computed_gov_employee_type)
                ->visible($consented),
            Field::text('work_email', fn ($g) => $g->nominee->work_email)
                ->visible($consented),
            Field::text('classification', fn ($g) => $g->nominee->getClassification())
                ->visible($consented),
            Field::bool('priority_entitlement', fn ($g) => $g->nominee->has_priority_entitlement)
                ->visible($consented),
            Field::text('priority_number', fn ($g) => $g->nominee->priority_number)
                ->visible($consented),
            Field::bool('accept_temporary', fn ($g) => $g->nominee->position_duration ? $g->nominee->wouldAcceptTemporary() : null)
                ->visible($consented),
            Field::enum('accepted_operational_requirements', OperationalRequirement::class, fn ($g) => $g->nominee->getOperationalRequirements()['accepted'])
                ->visible($consented),
            Field::enum('location_preferences', WorkRegion::class, fn ($g) => $this->getLocationPreferences($g->nominee))
                ->visible($consented),
            Field::enum('flexible_work_locations', FlexibleWorkLocation::class, fn ($g) => $g->nominee->flexible_work_locations)
                ->visible($consented),
            Field::text('location_exemptions', fn ($g) => $g->nominee->location_exemptions)
                ->visible($consented),
            Field::bool('woman', fn ($g) => $g->nominee->is_woman)
                ->visible($consented),
            Field::enum('indigenous', IndigenousCommunity::class, fn ($g) => $this->getIndigenousCommunities($g->nominee))
                ->visible($consented),
            Field::bool('visible_minority', fn ($g) => $g->nominee->is_visible_minority)
                ->visible($consented),
            Field::bool('disability', fn ($g) => $g->nominee->has_disability)
                ->visible($consented),
            Field::text('skills', fn ($g) => $this->getUserSkills($g->nominee))
                ->visible($consented),
            Field::bool('career_planning_lateral_move_interest', fn ($g) => $g->nominee->employeeProfile?->career_planning_lateral_move_interest)
                ->visible($consented),
            Field::enum('career_planning_lateral_move_time_frame', TimeFrame::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_lateral_move_time_frame)
                ->visible($consented),
            Field::enum('career_planning_lateral_move_organization_type', OrganizationTypeInterest::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_lateral_move_organization_type)
                ->visible($consented),
            Field::bool('career_planning_promotion_move_interest', fn ($g) => $g->nominee->employeeProfile?->career_planning_promotion_move_interest)
                ->visible($consented),
            Field::enum('career_planning_promotion_move_time_frame', TimeFrame::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_promotion_move_time_frame)
                ->visible($consented),
            Field::enum('career_planning_promotion_move_organization_type', OrganizationTypeInterest::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_promotion_move_organization_type)
                ->visible($consented),
            Field::enum('career_planning_learning_opportunities_interest', LearningOpportunitiesInterest::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_learning_opportunities_interest)
                ->visible($consented),
            Field::date('eligible_retirement_year', 'Y', fn ($g) => $g->nominee->employeeProfile?->eligible_retirement_year)
                ->visible($consented),
            Field::enum('career_planning_mentorship_status', Mentorship::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_mentorship_status)
                ->visible($consented),
            Field::enum('career_planning_mentorship_interest', Mentorship::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_mentorship_interest)
                ->visible($consented),
            Field::bool('career_planning_exec_interest', fn ($g) => $g->nominee->employeeProfile?->career_planning_exec_interest)
                ->visible($consented),
            Field::enum('career_planning_exec_coaching_status', ExecCoaching::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_exec_coaching_status)
                ->visible($consented),
            Field::enum('career_planning_exec_coaching_interest', ExecCoaching::class, fn ($g) => $g->nominee->employeeProfile?->career_planning_exec_coaching_interest)
                ->visible($consented),
            Field::text('next_role_target_classification_group', fn ($g) => $g->nominee->employeeProfile?->nextRoleClassification?->group)
                ->visible($consented),
            Field::number('next_role_target_classification_level', fn ($g) => $g->nominee->employeeProfile?->nextRoleClassification?->level)
                ->visible($consented),
            Field::enum('next_role_target_role', TargetRole::class, fn ($g) => $g->nominee->employeeProfile?->next_role_target_role)
                ->visible($consented),
            Field::bool('next_role_is_c_suite_role', fn ($g) => $g->nominee->employeeProfile?->next_role_is_c_suite_role)
                ->visible($consented),
            Field::enum('next_role_c_suite_role_title', CSuiteRoleTitle::class, fn ($g) => $g->nominee->employeeProfile?->next_role_c_suite_role_title)
                ->visible($consented),
            Field::text('next_role_job_title', fn ($g) => $g->nominee->employeeProfile?->next_role_job_title)
                ->visible($consented),
            Field::text('next_role_functional_community', fn ($g) => $g->nominee->employeeProfile?->nextRoleCommunity?->name[$this->lang])
                ->visible($consented),
            Field::text('next_role_work_streams', fn ($g) => $this->getLocalizedNames($g->nominee->employeeProfile?->nextRoleWorkStreams, ','))
                ->visible($consented),
            Field::text('next_role_departments', fn ($g) => $this->getLocalizedNames($g->nominee->employeeProfile?->nextRoleDepartments))
                ->visible($consented),
            Field::text('next_role_additional_information', fn ($g) => $g->nominee->employeeProfile?->next_role_additional_information)
                ->visible($consented),
            Field::text('career_objective_target_classification_group', fn ($g) => $g->nominee->employeeProfile?->careerObjectiveClassification?->group)
                ->visible($consented),
            Field::number('career_objective_target_classification_level', fn ($g) => $g->nominee->employeeProfile?->careerObjectiveClassification?->level)
                ->visible($consented),
            Field::enum('career_objective_target_role', TargetRole::class, fn ($g) => $g->nominee->employeeProfile?->career_objective_target_role)
                ->visible($consented),
            Field::bool('career_objective_is_c_suite_role', fn ($g) => $g->nominee->employeeProfile?->career_objective_is_c_suite_role)
                ->visible($consented),
            Field::enum('career_objective_c_suite_role_title', CSuiteRoleTitle::class, fn ($g) => $g->nominee->employeeProfile?->career_objective_c_suite_role_title)
                ->visible($consented),
            Field::text('career_objective_job_title', fn ($g) => $g->nominee->employeeProfile?->career_objective_job_title)
                ->visible($consented),
            Field::text('career_objective_functional_community', fn ($g) => $g->nominee->employeeProfile?->careerObjectiveCommunity?->name[$this->lang])
                ->visible($consented),
            Field::text('career_objective_work_streams', fn ($g) => $this->getLocalizedNames($g->nominee->employeeProfile?->careerObjectiveWorkStreams))
                ->visible($consented),
            Field::text('career_objective_departments', fn ($g) => $this->getLocalizedNames($g->nominee->employeeProfile?->careerObjectiveDepartments))
                ->visible($consented),
            Field::text('career_objective_additional_information', fn ($g) => $g->nominee->employeeProfile?->career_objective_additional_information)
                ->visible($consented),
            Field::text('career_planning_about_you', fn ($g) => $g->nominee->employeeProfile?->career_planning_about_you)
                ->visible($consented),
            Field::text('career_planning_learning_goals', fn ($g) => $g->nominee->employeeProfile?->career_planning_learning_goals)
                ->visible($consented),
            Field::text('career_planning_work_style', fn ($g) => $g->nominee->employeeProfile?->career_planning_work_style)
                ->visible($consented),
            Field::text('digital_talent_processes', fn ($g) => $this->getAppliedPools($g->nominee))
                ->visible($consented),
            Field::text('off_platform_processes_not_verified', fn ($g) => $this->getOffPlatformProcesses($g->nominee))
                ->visible($consented),
        ];
    }

    /**
     * Location preferences of a user, without telework
     *
     * @return array<string>
     */
    private function getLocationPreferences(User $user): array
    {
        return array_filter($user->location_preferences ?? [], function ($location) {
            return $location !== WorkRegion::TELEWORK->name;
        });
    }

    /**
     * Indigenous communities of a user, without the legacy case
     *
     * @return array<string>
     */
    private function getIndigenousCommunities(User $user): array
    {
        return Arr::where($user->indigenous_communities ?? [], function ($community) {
            return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
        });
    }

    /**
     * Skill names of a user, separated by commas
     */
    private function getUserSkills(User $user): string
    {
        return $user->userSkills->map(function ($userSkill) {
            return $userSkill->skill->name[$this->lang] ?? '';
        })->join(', ');
    }

    /**
     * Localized names of a collection of models, joined by $separator
     *
     * @param  ?Collection<int, mixed>  $models
     */
    private function getLocalizedNames(?Collection $models, string $separator = ', '): string
    {
        return $models
            ? $models->map(fn ($model) => $model->name[$this->lang] ?? '')->join($separator)
            : '';
    }

    /**
     * Digital talent processes a user applied to, separated by commas
     */
    private function getAppliedPools(User $user): string
    {
        return $user->poolCandidates->map(function ($candidate) {
            return sprintf(
                '%s - %s - %s - %s',
                $candidate->pool->classification->formattedGroupAndLevel,
                $candidate->pool->name[$this->lang] ?? '',
                $candidate->pool->process_number,
                $candidate->suspended_at
                    ? Lang::get('common.not_interested', [], $this->lang)
                    : Lang::get('common.open_to_job_offers', [], $this->lang)
            );
        })->join(', ');
    }

    /**
     * Off platform recruitment processes of a user, separated by commas
     */
    private function getOffPlatformProcesses(User $user): string
    {
        return collect($user->offPlatformRecruitmentProcesses)->map(function ($process) {
            return $process->classification->formattedGroupAndLevel
                .(is_null($process->department) ? '' : ' '.$this->localize('common.with').' '.($process->department->name[$this->lang] ?? ''))
                .' ('
                .($process->platform === HiringPlatform::OTHER->name ? $process->platform_other : $this->localizeEnum($process->platform, HiringPlatform::class))
                .' - '
                .$process->process_number
                .')';
        })->join(', ');
    }

    /**
     * Generate the nomination details tab
     */
    private function generateNominationDetailsTab(): void
    {
        $fields = $this->nominationDetailFields();

        $this->writeHeadingRow($fields);

        $query = $this->buildQuery();
        $query->chunk(200, function ($talentNominationGroups) use ($fields) {
            foreach ($talentNominationGroups as $talentNominationGroup) {
                foreach ($talentNominationGroup->nominations as $nomination) {
                    $nomination->setRelation('talentNominationGroup', $talentNominationGroup);

                    $this->writeDataRow($fields, $nomination);
                }
            }
        });
    }

    /**
     * Fields of the nomination details tab, in column order
     *
     * @return list<Field>
     */
    private function nominationDetailFields(): array
    {
        return [
            Field::text('nominee_user_id', fn ($n) => $n->talentNominationGroup->nominee->id),
            Field::text('nominee_first_name', fn ($n) => $n->talentNominationGroup->nominee->first_name),
            Field::text('nominee_last_name', fn ($n) => $n->talentNominationGroup->nominee->last_name),
            Field::date('nomination_date', 'Y-m-d', fn ($n) => $n->submitted_at),
            Field::text('nomination_options', fn ($n) => $this->getNominationOptionsForNomination($n)),
            Field::text('nominator', fn ($n) => $n->nominator?->getFullName() ?? $n->nominator_fallback_name),
            Field::enum('relationship_to_nominee', TalentNominationNomineeRelationshipToNominator::class, fn ($n) => $n->nominee_relationship_to_nominator),
            Field::text('nominator_email', fn ($n) => $n->nominator->work_email ?? $n->nominator_fallback_work_email),
            Field::text('nominator_classification', fn ($n) => $n->nominator->currentClassification->formattedGroupAndLevel ?? null),
            Field::text('nominator_department', fn ($n) => $n->nominator->department?->name[$this->lang]),
            Field::text('submitters_name', fn ($n) => $n->submitter?->getFullName()),
            Field::text('submitters_email', fn ($n) => $n->submitter->work_email ?? null),
            Field::text('submitters_relationship_to_nominator', fn ($n) => $this->getSubmitterRelationship($n)),
            Field::text('reference_name', fn ($n) => $this->getReferenceDetails($n)['name']),
            Field::text('reference_email', fn ($n) => $this->getReferenceDetails($n)['email']),
            Field::text('reference_classification', fn ($n) => $this->getReferenceDetails($n)['classification']),
            Field::text('reference_department', fn ($n) => $this->getReferenceDetails($n)['department']),
            Field::enum('nine_box_performance', NineBoxRating::class, fn ($n) => $n->nine_box_performance?->name),
            Field::enum('nine_box_leadership_potential', NineBoxRating::class, fn ($n) => $n->nine_box_leadership_potential?->name),
            Field::text('lateral_experience_recommendations', fn ($n) => $this->getLateralMovementOptions($n)),
            Field::text('other_lateral_experience', fn ($n) => $n->lateral_movement_options_other),
            Field::text('development_program_recommendations', fn ($n) => $this->getDevelopmentPrograms($n)),
            Field::text('other_development_program_experience', fn ($n) => $n->development_program_options_other),
            Field::text('rationale', fn ($n) => $n->nomination_rationale),
            Field::text('leadership_competencies', fn ($n) => $this->getLeadershipCompetencies($n)),
            Field::text('additional_comments', fn ($n) => $n->additional_comments),
        ];
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

    private function buildQuery()
    {
        $query = TalentNominationGroup::with([
            'talentNominationEvent',
            'advancementClassifications',
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
            ->authorizedToView(['userId' => $this->authenticatedUserId]);

        return $query;

    }
}
