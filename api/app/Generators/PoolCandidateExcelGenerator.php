<?php

namespace App\Generators;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CitizenshipStatus;
use App\Enums\EducationRequirementOption;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\FlexibleWorkLocation;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\ProvinceOrTerritory;
use App\Enums\WorkRegion;
use App\Models\Experience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

class PoolCandidateExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generalQuestionIds = [];

    protected array $screeningQuestionIds = [];

    protected array $skillIds = [];

    protected array $poolIds = [];

    protected array $RODStepsWithPoolSkills = [];

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
        'ROD_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'process_number',
        'process_name',
        'first_name',
        'last_name',
        'status',
        'category',
        'availability',
        'notes',
        'date_received',
        'expiry_date',
        'archival_date',
        'current_province',
        'current_city',
        'email',
        'preferred_communication_language',
        'preferred_spoken_interview_language',
        'preferred_written_exam_language',
        'armed_forces_status',
        'citizenship',
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
        'classification_current',
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
        'education_requirement',
        'education_requirement_experiences',
    ];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en', protected bool $withROD = false)
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->writer = new Writer();
        $this->writer->openToFile($this->getPath());

        // Pre-pass: collect all pool IDs so we can build headers before streaming rows
        $this->poolIds = $this->buildQuery()
            ->select('pool_id')
            ->distinct()
            ->pluck('pool_id')
            ->toArray();

        $this->generatePoolHeaders();

        $localizedHeaders = array_map(fn ($key) => $this->localizeHeading($key), $this->headerLocaleKeys);

        $this->writer->addRow(Row::fromValues([
            ...$localizedHeaders,
            $this->localizeHeading('skills'),
            ...$this->generatedHeaders['general_questions'],
            ...$this->generatedHeaders['screening_questions'],
            ...$this->generatedHeaders['skill_details'],
            ...$this->generatedHeaders['ROD_details'],
        ]));

        $this->buildQuery()->chunk(200, function ($candidates) {
            foreach ($candidates as $candidate) {
                $this->writer->addRow(Row::fromValues($this->buildCandidateRow($candidate)));
            }
        });

        $this->writer->close();

        return $this;
    }

    /** @return array<int, mixed> */
    private function buildCandidateRow(PoolCandidate $candidate): array
    {
        $snapshot = $candidate->profile_snapshot;
        $userHydrated = User::hydrateSnapshot($snapshot);
        $snapshotExperiences = $snapshot['experiences'] ?? [];

        foreach ($snapshotExperiences as &$experience) {
            if ($experience['__typename'] === 'WorkExperience') {
                if (isset($experience['department'])) {
                    $experience['departmentId'] = $experience['department']['id'];
                }
                if (isset($experience['classification'])) {
                    $experience['classificationId'] = $experience['classification']['id'];
                }
                if (isset($experience['workStreams'])) {
                    $experience['workStreamIds'] = Arr::map($experience['workStreams'], fn ($value) => $value['id']);
                }
            }
        }

        $experiencesHydrated = Experience::hydrateSnapshot($snapshotExperiences);
        $department = $userHydrated->department()->first();
        $preferences = $userHydrated->getOperationalRequirements();
        $educationRequirementExperiences = $candidate->educationRequirementExperiences
            ->map(fn ($exp) => $exp->getTitle())
            ->flatten()
            ->unique()
            ->toArray();

        $values = [
            $candidate->pool->process_number,
            $candidate->pool->name[$this->lang] ?? '',
            $userHydrated->first_name,
            $userHydrated->last_name,
            $this->localizeEnum($candidate->application_status, ApplicationStatus::class),
            $this->localizeEnum($userHydrated->priority, PriorityWeight::class),
            $candidate->suspended_at ? Lang::get('common.not_interested', [], $this->lang) : Lang::get('common.open_to_job_offers', [], $this->lang),
            $this->sanitizeString($candidate->notes ?? ''),
            $candidate->submitted_at ? $candidate->submitted_at->format('Y-m-d') : '',
            $candidate->expiry_date ? $candidate->expiry_date->format('Y-m-d') : '',
            $candidate->archived_at ? $candidate->archived_at->format('Y-m-d') : '',
            $this->localizeEnum($userHydrated->current_province, ProvinceOrTerritory::class),
            $userHydrated->current_city,
            $userHydrated->email,
            $this->localizeEnum($userHydrated->preferred_lang, Language::class),
            $this->localizeEnum($userHydrated->preferred_language_for_interview, Language::class),
            $this->localizeEnum($userHydrated->preferred_language_for_exam, Language::class),
            $this->localizeEnum($userHydrated->armed_forces_status, ArmedForcesStatus::class),
            $this->localizeEnum($userHydrated->citizenship, CitizenshipStatus::class),
            $this->localizeEnum($userHydrated->first_official_language, Language::class),
            $this->localizeEnum($userHydrated->estimated_language_ability, EstimatedLanguageAbility::class),
            $this->yesOrNo($userHydrated->second_language_exam_completed),
            $this->yesOrNo($userHydrated->second_language_exam_validity),
            $this->localizeEnum($userHydrated->comprehension_level, EvaluatedLanguageAbility::class),
            $this->localizeEnum($userHydrated->written_level, EvaluatedLanguageAbility::class),
            $this->localizeEnum($userHydrated->verbal_level, EvaluatedLanguageAbility::class),
            $this->yesOrNo($userHydrated->computed_is_gov_employee),
            $department->name[$this->lang] ?? '',
            $this->localizeEnum($userHydrated->computed_gov_employee_type, GovEmployeeType::class),
            $userHydrated->work_email,
            $userHydrated->getClassification(),
            $this->yesOrNo($userHydrated->has_priority_entitlement),
            $userHydrated->priority_number ?? '',
            $userHydrated->position_duration ? $this->yesOrNo($userHydrated->wouldAcceptTemporary()) : '',
            $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
            $this->localizeEnumArray(
                array_filter($userHydrated->location_preferences ?? [], fn ($l) => $l !== WorkRegion::TELEWORK->name),
                WorkRegion::class
            ),
            $this->localizeEnumArray($userHydrated->flexible_work_locations, FlexibleWorkLocation::class),
            $userHydrated->location_exemptions,
            $this->yesOrNo($userHydrated->is_woman),
            $this->localizeEnumArray($userHydrated->indigenous_communities, IndigenousCommunity::class),
            $this->yesOrNo($userHydrated->is_visible_minority),
            $this->yesOrNo($userHydrated->has_disability),
            $this->localizeEnum($candidate->education_requirement_option, EducationRequirementOption::class),
            implode(', ', $educationRequirementExperiences),
        ];

        // All claimed skills from snapshot
        $snapshotUserSkills = $snapshot['userSkills'] ?? [];
        $values[] = implode(', ', array_map(fn ($us) => $us['skill']['name'][$this->lang], $snapshotUserSkills));

        // General question responses — one column per question in header order
        foreach ($this->generalQuestionIds as $questionId) {
            $response = $candidate->generalQuestionResponses
                ->where('general_question_id', $questionId)
                ->first();
            $values[] = $response ? $this->sanitizeString($response->answer) : '';
        }

        // Screening question responses — one column per question in header order
        foreach ($this->screeningQuestionIds as $questionId) {
            $response = $candidate->screeningQuestionResponses
                ->where('screening_question_id', $questionId)
                ->first();
            $values[] = $response ? $this->sanitizeString($response->answer) : '';
        }

        // Pool skill experience details — one column per skill in header order
        foreach ($this->skillIds as $skillId) {
            $values[] = $this->buildSkillCell($skillId, $snapshotExperiences, $experiencesHydrated);
        }

        // ROD assessment columns
        if ($this->withROD) {
            foreach ($this->RODStepsWithPoolSkills as $stepId => $poolSkills) {
                foreach ($poolSkills as $poolSkill) {
                    $result = $this->findAssessmentResult($candidate, $stepId, $poolSkill);

                    if ($poolSkill === 'education') {
                        $values[] = $this->formatRODDecision($result, false);
                        $values[] = $result ? $this->localizeEnumArray($result->justifications, AssessmentResultJustification::class) : '';
                    } else {
                        $values[] = $this->formatRODDecision($result, false);
                        $values[] = $result ? $this->formatRODDetails($result) : '';
                    }

                    $values[] = $result?->skill_decision_notes ? $this->sanitizeString($result->skill_decision_notes) : '';
                }
            }

            $values[] = $this->buildFinalDecision($candidate);
        }

        return $values;
    }

    /**
     * @param  array<int, mixed>  $snapshotExperiences
     * @param  array<int, Experience>  $experiencesHydrated
     */
    private function buildSkillCell(string $skillId, array $snapshotExperiences, array $experiencesHydrated): string
    {
        $experienceSkillArray = [];

        foreach ($snapshotExperiences as $snapshotExperience) {
            $skills = $snapshotExperience['skills'] ?? [];
            $skillFound = Arr::first($skills, fn ($s) => $s['id'] === $skillId);

            if (! $skillFound) {
                continue;
            }

            /** @var Experience $experienceModel */
            $experienceModel = Arr::first($experiencesHydrated, fn ($e) => $snapshotExperience['id'] == $e->id);
            $details = $skillFound['experienceSkillRecord']['details'] ?? null;

            $experienceSkillArray[] = $experienceModel && $details
                ? $experienceModel->getTitle().': '.$details
                : $experienceModel->getTitle().': '.Lang::get('common.not_found', [], $this->lang);
        }

        return implode("\r\n", $experienceSkillArray);
    }

    /** @return mixed */
    private function findAssessmentResult(PoolCandidate $candidate, string $stepId, string $poolSkill)
    {
        return Arr::first($candidate->assessmentResults, function ($ar) use ($stepId, $poolSkill) {
            if ($ar->assessmentStep->id !== $stepId) {
                return false;
            }

            if ($poolSkill === 'education') {
                return $ar->assessment_result_type === AssessmentResultType::EDUCATION->name;
            }

            return $ar['poolSkill']?->id === $poolSkill;
        });
    }

    /** @param mixed $result */
    private function formatRODDecision($result, bool $isEducation): string
    {
        if (! $result) {
            return '';
        }

        if (is_null($result->assessment_decision)) {
            return Lang::get('common.pending_second_opinion', [], $this->lang);
        }

        return $this->localizeEnum($result->assessment_decision, AssessmentDecision::class);
    }

    /** @param mixed $result */
    private function formatRODDetails($result): string
    {
        if (! $result) {
            return '';
        }

        if (! is_null($result->assessment_decision_level)) {
            return $this->localizeEnum($result->assessment_decision_level, AssessmentDecisionLevel::class);
        }

        return $this->localizeEnumArray($result->justifications, AssessmentResultJustification::class);
    }

    private function buildFinalDecision(PoolCandidate $candidate): string
    {
        if (! is_null($candidate->application_status) && $candidate->application_status !== ApplicationStatus::TO_ASSESS->name) {
            return $this->localizeEnum($candidate->application_status, ApplicationStatus::class);
        }

        if (! isset($candidate->computed_assessment_status['overallAssessmentStatus'])) {
            return Lang::get('final_decision.to_assess', [], $this->lang);
        }

        if ($candidate->computed_assessment_status['overallAssessmentStatus'] === OverallAssessmentStatus::DISQUALIFIED->name) {
            return Lang::get('final_decision.disqualified_pending', [], $this->lang);
        }

        if ($candidate->assessment_step_id === null) {
            return Lang::get('final_decision.qualified_pending', [], $this->lang);
        }

        return Lang::get('final_decision.to_assess', [], $this->lang)
            .$this->colon()
            .Lang::get('common.step', [], $this->lang)
            .' '
            .$candidate->assessmentStep->sort_order;
    }

    private function generatePoolHeaders(): void
    {
        Pool::with([
            'generalQuestions',
            'screeningQuestions',
            'poolSkills',
            'poolSkills.skill',
            'assessmentSteps' => ['poolSkills.skill'],
        ])
            ->whereIn('id', $this->poolIds)
            ->chunk(100, function ($pools) {
                foreach ($pools as $pool) {
                    foreach ($pool->generalQuestions as $question) {
                        $this->generalQuestionIds[] = $question->id;
                        $this->generatedHeaders['general_questions'][] =
                            Lang::get('headings.general_question', [], $this->lang).$this->colon().$question->question[$this->lang];
                    }

                    foreach ($pool->screeningQuestions as $question) {
                        $this->screeningQuestionIds[] = $question->id;
                        $this->generatedHeaders['screening_questions'][] =
                            Lang::get('headings.screening_question', [], $this->lang).$this->colon().$question->question[$this->lang];
                    }

                    $skillsByGroup = $pool->poolSkills->groupBy('type');
                    foreach ($skillsByGroup as $group => $skills) {
                        foreach ($skills as $skill) {
                            $this->skillIds[] = $skill->skill_id;
                            $this->generatedHeaders['skill_details'][] = sprintf(
                                '%s (%s)',
                                $skill->skill->name[$this->lang],
                                $this->localizeEnum($group, PoolSkillType::class)
                            );
                        }
                    }

                    if ($this->withROD) {
                        foreach ($pool->assessmentSteps as $step) {
                            if ($step->type === AssessmentStepType::APPLICATION_SCREENING->name) {
                                $this->RODStepsWithPoolSkills[$step->id][] = 'education';
                                $stepLabel = $this->localizeEnum($step->type, AssessmentStepType::class);
                                $eduLabel = Lang::get('headings.education_requirement', [], $this->lang);
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $eduLabel, Lang::get('headings.decision', [], $this->lang));
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $eduLabel, Lang::get('headings.decision_details', [], $this->lang));
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $eduLabel, Lang::get('headings.decision_notes', [], $this->lang));
                            }

                            foreach ($step->poolSkills as $poolSkill) {
                                $this->RODStepsWithPoolSkills[$step->id][] = $poolSkill->id;
                                $stepLabel = $this->localizeEnum($step->type, AssessmentStepType::class);
                                $skillLabel = $poolSkill->skill->name[$this->lang];
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $skillLabel, Lang::get('headings.decision', [], $this->lang));
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $skillLabel, Lang::get('headings.decision_details', [], $this->lang));
                                $this->generatedHeaders['ROD_details'][] = sprintf('%s - %s - %s', $stepLabel, $skillLabel, Lang::get('headings.decision_notes', [], $this->lang));
                            }
                        }

                        $this->generatedHeaders['ROD_details'][] = $this->localizeHeading('final_decision');
                    }
                }
            });
    }

    /** @return Builder<PoolCandidate> */
    private function buildQuery(): Builder
    {
        $query = PoolCandidate::with([
            'generalQuestionResponses' => ['generalQuestion'],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'educationRequirementAwardExperiences',
            'educationRequirementCommunityExperiences',
            'educationRequirementEducationExperiences',
            'educationRequirementPersonalExperiences',
            'educationRequirementWorkExperiences',
            'assessmentResults' => ['poolSkill', 'assessmentStep'],
            'pool' => [
                'generalQuestions',
                'screeningQuestions',
                'poolSkills',
                'poolSkills.skill',
                'assessmentSteps',
                'assessmentSteps.poolSkills',
            ],
            'assessmentStep',
        ]);

        $this->applyFilters($query, [
            'email' => 'whereEmail',
            'generalSearch' => 'whereGeneralSearch',
            'name' => 'whereName',
            'notes' => 'whereNotesLike',
            'isGovEmployee' => 'whereIsGovEmployee',
            'departments' => 'whereDepartmentsIn',
            'statuses' => 'whereStatusIn',
            'priorityWeight' => 'whereCandidateCategoryIn',
            'expiryStatus' => 'whereExpiryStatus',
            'suspendedStatus' => 'whereSuspendedStatus',
            'publishingGroups' => 'wherePublishingGroupsIn',
            'appliedClassifications' => 'whereAppliedClassificationsIn',
            'workStreams' => 'whereWorkStreamsIn',
            'processNumber' => 'whereProcessNumber',
            'flexibleWorkLocations' => 'whereFlexibleWorkLocationsIn',
            'assessmentSteps' => 'whereAssessmentStepsIn',
            'placementTypes' => 'wherePlacementTypeIn',
            'removalReason' => 'whereRemovalReasonIn',
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

        /** @var Builder<PoolCandidate> $query */
        $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereNotDraft()
            ->wherePoolCandidateSearchInputToSpecialLocationMatching($this->filters);

        return $query;
    }
}
