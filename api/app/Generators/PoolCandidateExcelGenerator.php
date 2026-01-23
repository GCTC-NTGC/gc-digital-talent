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
use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\ScreeningQuestion;
use App\Models\User;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PoolCandidateExcelGenerator extends ExcelGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generalQuestionIds = [];

    protected array $generalQuestionResponses = [];

    protected array $screeningQuestionIds = [];

    protected array $screeningQuestionResponses = [];

    protected array $skillIds = [];

    protected array $poolSkills = [];

    protected array $poolIds = [];

    protected array $RODStepsWithPoolSkills = [];

    protected array $RODData = [];

    protected array $finalDecisions = [];

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
        'education_requirement',
        'education_requirement_experiences',
    ];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en', protected bool $withROD = false)
    {
        parent::__construct($fileName, $dir);
    }

    public function array_find($xs, $f)
    {
        foreach ($xs as $x) {
            if (call_user_func($f, $x) === true) {
                return $x;
            }
        }

        return null;
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet;

        $sheet = $this->spreadsheet->getActiveSheet();

        $currentCandidate = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($candidates) use ($sheet, &$currentCandidate) {
            foreach ($candidates as $candidate) {

                // Push this candidates pool into the pool IDs to get the pool data
                // for skill and question headers
                if (! in_array($candidate->pool_id, $this->poolIds)) {
                    $this->poolIds[] = $candidate->pool_id;
                }

                // pull data from application snapshot
                // mirrors logic found in ApplicationDocGenerator
                $snapshot = $candidate->profile_snapshot;
                $userHydrated = User::hydrateSnapshot($snapshot);
                $snapshotExperiences = isset($snapshot['experiences']) ? $snapshot['experiences'] : [];
                // the snapshot stores the department and classification models connected by relation
                // to render with GeneratesUserDoc or use hydrateSnapshot, map the models to a string with the appropriate property name per $hydrationFields
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
                $educationRequirementExperiences = $candidate->educationRequirementExperiences->map(function ($experience) {
                    return $experience->getTitle();
                })->flatten()->unique()->toArray();

                $values = [
                    $candidate->pool->process_number, // Process number
                    $candidate->pool->name[$this->lang] ?? '', // Process name
                    $userHydrated->first_name, // First name
                    $userHydrated->last_name, // Last name
                    $this->localizeEnum($candidate->application_status, ApplicationStatus::class), // Status
                    $this->localizeEnum($userHydrated->priority, PriorityWeight::class),
                    $candidate->suspended_at ? Lang::get('common.not_interested', [], $this->lang) : Lang::get('common.open_to_job_offers', [], $this->lang),
                    $this->sanitizeString($candidate->notes ?? ''), // Notes
                    $candidate->submitted_at ? $candidate->submitted_at->format('Y-m-d') : '', // Date received
                    $candidate->expiry_date ? $candidate->expiry_date->format('Y-m-d') : '', // Expiry date
                    $candidate->archived_at ? $candidate->archived_at->format('Y-m-d') : '', // Archival date
                    $this->localizeEnum($userHydrated->current_province, ProvinceOrTerritory::class), // Current province
                    $userHydrated->current_city, // Current city
                    $userHydrated->email, // Email
                    $this->localizeEnum($userHydrated->preferred_lang, Language::class),
                    $this->localizeEnum($userHydrated->preferred_language_for_interview, Language::class),
                    $this->localizeEnum($userHydrated->preferred_language_for_exam, Language::class),
                    $this->localizeEnum($userHydrated->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($userHydrated->citizenship, CitizenshipStatus::class),
                    $this->localizeEnum($userHydrated->first_official_language, Language::class),
                    $this->localizeEnum($userHydrated->estimated_language_ability, EstimatedLanguageAbility::class), // Estimated language ability
                    $userHydrated->second_language_exam_completed ? Lang::get('common.yes', [], $this->lang) : '', // Bilingual evaluation
                    is_null($userHydrated->second_language_exam_validity) ? '' : $this->yesOrNo($userHydrated->second_language_exam_validity), // Bilingual exam validity
                    $this->localizeEnum($userHydrated->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($userHydrated->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($userHydrated->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->yesOrNo($userHydrated->computed_is_gov_employee), // Government employee
                    $department->name[$this->lang] ?? '', // Department
                    $this->localizeEnum($userHydrated->computed_gov_employee_type, GovEmployeeType::class),
                    $userHydrated->work_email, // Work email
                    $userHydrated->getClassification(), // Current classification
                    $this->yesOrNo($userHydrated->has_priority_entitlement), // Priority entitlement
                    $userHydrated->priority_number ?? '', // Priority number
                    $userHydrated->position_duration ? $this->yesOrNo($userHydrated->wouldAcceptTemporary()) : '', // Accept temporary
                    $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                    /* remove 'Telework' from location preferences */
                    $this->localizeEnumArray(
                        array_filter($userHydrated->location_preferences ?? [], function ($location) {
                            return $location !== WorkRegion::TELEWORK->name;
                        }),
                        WorkRegion::class
                    ), // Location preferences
                    $this->localizeEnumArray($userHydrated->flexible_work_locations ?? [], FlexibleWorkLocation::class), // Flexible work locations
                    $userHydrated->location_exemptions, // Location exemptions
                    $userHydrated->is_woman ? Lang::get('common.yes', [], $this->lang) : '', // Woman
                    $this->localizeEnumArray($userHydrated->indigenous_communities, IndigenousCommunity::class),
                    $userHydrated->is_visible_minority ? Lang::get('common.yes', [], $this->lang) : '', // Visible minority
                    $userHydrated->has_disability ? Lang::get('common.yes', [], $this->lang) : '', // Disability
                    $this->localizeEnum($candidate->education_requirement_option, EducationRequirementOption::class), // Education requirement
                    implode(', ', $educationRequirementExperiences ?? []), // Education requirement experiences
                ];

                // Skills claimed through UserSkills field, from snapshot
                $usersSkillsNames = [];
                $snapshotUserSkills = $snapshot['userSkills'] ?? [];
                foreach ($snapshotUserSkills as $snapshotUserSkill) {
                    array_push($usersSkillsNames, $snapshotUserSkill['skill']['name'][$this->lang]);
                }
                $values[] = implode(', ', $usersSkillsNames);

                $poolGeneralQuestionIds = $candidate->pool->generalQuestions->pluck('id')->toArray();
                $candidateGeneralQuestionIds = $candidate->generalQuestionResponses->pluck('general_question_id')->toArray();
                foreach ($poolGeneralQuestionIds as $questionId) {
                    if (in_array($questionId, $candidateGeneralQuestionIds)) {
                        $response = $candidate->generalQuestionResponses->where('general_question_id', $questionId)->first();
                        $this->generalQuestionResponses[$questionId][] = [
                            'candidate' => $currentCandidate,
                            'value' => $this->sanitizeString($response->answer),
                        ];
                    }
                }

                $poolScreeningQuestionIds = $candidate->pool->screeningQuestions->pluck('id')->toArray();
                $candidateScreeningQuestionIds = $candidate->screeningQuestionResponses->pluck('screening_question_id')->toArray();
                foreach ($poolScreeningQuestionIds as $questionId) {
                    if (in_array($questionId, $candidateScreeningQuestionIds)) {
                        $response = $candidate->screeningQuestionResponses->where('screening_question_id', $questionId)->first();
                        $this->screeningQuestionResponses[$questionId][] = [
                            'candidate' => $currentCandidate,
                            'value' => $this->sanitizeString($response->answer),
                        ];
                    }
                }

                // PoolSkill section
                // collect pool's skills and all skills claimed in snapshotted experiences
                $poolsSkillsIds = $candidate->pool->poolSkills->pluck('skill_id')->toArray();
                $usersSkillsIds = [];
                foreach ($snapshotExperiences as $snapshotExperience) {
                    $skills = $snapshotExperience['skills'] ?? [];
                    foreach ($skills as $skill) {
                        array_push($usersSkillsIds, $skill['id']);
                    }
                }
                $usersSkillsIds = array_unique($usersSkillsIds);

                foreach ($poolsSkillsIds as $poolsSkillId) {
                    // execute if the skill was claimed by the user
                    if (in_array($poolsSkillId, $usersSkillsIds)) {
                        $experienceSkillArray = [];
                        // iterate through each snapshotted experience
                        foreach ($snapshotExperiences as $snapshotExperience) {

                            // find the hydrated experience model for the snapshotted experience, then you can execute ->getTitle()
                            $experienceModelFound = Arr::first($experiencesHydrated, function ($hydratedExperience) use ($snapshotExperience) {
                                return $snapshotExperience['id'] == $hydratedExperience->id;
                            });

                            // search for the iterated skill, returns array of one or empty
                            // array_values reindexes the array
                            $skillFoundArray =
                                array_values(
                                    array_filter(
                                        $snapshotExperience['skills'],
                                        function ($skill) use ($poolsSkillId) {
                                            return $skill['id'] === $poolsSkillId;
                                        }
                                    )
                                );

                            // if not empty, append onto accumulator
                            if (! empty($skillFoundArray)) {
                                $skillFound = $skillFoundArray[0];
                                array_push(
                                    $experienceSkillArray,
                                    $experienceModelFound && $skillFound['experienceSkillRecord'] && $skillFound['experienceSkillRecord']['details'] ?
                                    $experienceModelFound->getTitle().': '.$skillFound['experienceSkillRecord']['details'] :
                                    $experienceModelFound->getTitle().': '.Lang::get('common.not_found', [], $this->lang),
                                );
                            }
                        }

                        // pass in accumulator
                        $this->poolSkills[$poolsSkillId][] = [
                            'candidate' => $currentCandidate,
                            'value' => implode("\r\n", $experienceSkillArray),
                        ];
                    }
                }

                if ($this->withROD) {
                    foreach ($candidate->pool->assessmentSteps as $step) {
                        if ($step->type === AssessmentStepType::APPLICATION_SCREENING->name) {
                            $result = $this->array_find($candidate->assessmentResults, function ($ar) use ($step) {
                                return $ar->assessmentStep->id === $step->id && $ar->assessment_result_type === AssessmentResultType::EDUCATION->name;
                            });
                            if (! is_null($result)) {
                                $this->RODData[$step->id]['education'][] = [
                                    'candidate' => $currentCandidate,
                                    'decision' => is_null($result->assessment_decision) ?
                                        Lang::get('common.pending_second_opinion', [], $this->lang) :
                                        $this->localizeEnum($result->assessment_decision, AssessmentDecision::class),
                                    'details' => $this->localizeEnumArray($result->justifications, AssessmentResultJustification::class),
                                    'notes' => is_null($result->skill_decision_notes) ? null : $this->sanitizeString($result->skill_decision_notes),
                                ];
                            }
                        }
                        foreach ($step->poolSkills as $poolSkill) {
                            $result = $this->array_find($candidate->assessmentResults, function ($ar) use ($poolSkill, $step) {
                                if (is_null($ar['poolSkill'])) {
                                    return false;
                                }

                                return $ar->assessmentStep->id === $step->id && $ar['poolSkill']->id === $poolSkill->id;
                            });
                            if (! is_null($result)) {
                                $this->RODData[$step->id][$poolSkill->id][] = [
                                    'candidate' => $currentCandidate,
                                    'decision' => is_null($result->assessment_decision) ?
                                        Lang::get('common.pending_second_opinion', [], $this->lang) :
                                        $this->localizeEnum($result->assessment_decision, AssessmentDecision::class),
                                    'details' => is_null($result->assessment_decision_level) ?
                                        $this->localizeEnumArray($result->justifications, AssessmentResultJustification::class) :
                                        $this->localizeEnum($result->assessment_decision_level, AssessmentDecisionLevel::class),
                                    'notes' => is_null($result->skill_decision_notes) ? null : $this->sanitizeString($result->skill_decision_notes),
                                ];
                            }
                        }
                    }

                    $decision = null;
                    if (is_null($candidate->application_status) || $candidate->application_status === ApplicationStatus::TO_ASSESS->name) {
                        if (! isset($candidate->computed_assessment_status['overallAssessmentStatus'])) {
                            $decision = Lang::get('final_decision.to_assess', [], $this->lang);
                        } else {
                            if ($candidate->computed_assessment_status['overallAssessmentStatus'] === OverallAssessmentStatus::DISQUALIFIED->name) {
                                $decision = Lang::get('final_decision.disqualified_pending', [], $this->lang);
                            } elseif ($candidate->assessment_step_id === null) {
                                $decision = Lang::get('final_decision.qualified_pending', [], $this->lang);
                            } else {
                                $decision = Lang::get('final_decision.to_assess', [], $this->lang)
                                            .$this->colon()
                                            .Lang::get('common.step', [], $this->lang)
                                            .' '
                                            .$candidate->assessmentStep->sort_order;
                            }
                        }
                    } else {
                        $decision = $this->localizeEnum($candidate->application_status, ApplicationStatus::class);
                    }

                    $this->finalDecisions[] = [
                        'candidate' => $currentCandidate,
                        'value' => $decision,
                    ];
                }

                // 1 is added to the key to account for the header row
                $sheet->fromArray($values, null, sprintf('A%d', $currentCandidate + 1));
                $currentCandidate++;
            }
        });

        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $this->generatePoolHeaders();
        $this->generatePoolCells($sheet, count($localizedHeaders) + 1);

        $sheet->fromArray([
            ...$localizedHeaders,
            $this->localizeHeading('skills'),
            ...$this->generatedHeaders['general_questions'] ?? [],
            ...$this->generatedHeaders['screening_questions'] ?? [],
            ...$this->generatedHeaders['skill_details'] ?? [],
            ...$this->generatedHeaders['ROD_details'] ?? [],
        ], null, 'A1');

        return $this;
    }

    /**
     * Generate pool headers
     *
     * This uses all pools that candidates appear in
     * to generate headers based on general questions
     * and skills.
     */
    private function generatePoolHeaders()
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
                /** @var Pool $pool */
                foreach ($pools as $pool) {
                    if ($pool->generalQuestions->count() > 0) {
                        /** @var GeneralQuestion $question */
                        foreach ($pool->generalQuestions as $question) {
                            $this->generalQuestionIds[] = $question->id;
                            $this->generatedHeaders['general_questions'][] =
                                Lang::get('headings.general_question', [], $this->lang).$this->colon().$question->question[$this->lang];
                        }
                    }

                    if ($pool->screeningQuestions->count() > 0) {
                        /** @var ScreeningQuestion $question */
                        foreach ($pool->screeningQuestions as $question) {
                            $this->screeningQuestionIds[] = $question->id;
                            $this->generatedHeaders['screening_questions'][] =
                                Lang::get('headings.screening_question', [], $this->lang).$this->colon().$question->question[$this->lang];
                        }
                    }

                    if ($pool->poolSkills->count() > 0) {
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
                    }

                    if ($this->withROD && $pool->assessmentSteps->count() > 0) {
                        foreach ($pool->assessmentSteps as $step) {
                            if ($step->type === AssessmentStepType::APPLICATION_SCREENING->name) {
                                $this->RODStepsWithPoolSkills[$step->id][] = 'education';
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    Lang::get('headings.education_requirement', [], $this->lang),
                                    Lang::get('headings.decision', [], $this->lang),
                                );
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    Lang::get('headings.education_requirement', [], $this->lang),
                                    Lang::get('headings.decision_details', [], $this->lang),
                                );
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    Lang::get('headings.education_requirement', [], $this->lang),
                                    Lang::get('headings.decision_notes', [], $this->lang),
                                );
                            }
                            foreach ($step->poolSkills as $poolSkill) {
                                $this->RODStepsWithPoolSkills[$step->id][] = $poolSkill->id;
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    $poolSkill->skill->name[$this->lang],
                                    Lang::get('headings.decision', [], $this->lang),
                                );
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    $poolSkill->skill->name[$this->lang],
                                    Lang::get('headings.decision_details', [], $this->lang),
                                );
                                $this->generatedHeaders['ROD_details'][] = sprintf(
                                    '%s - %s - %s',
                                    $this->localizeEnum($step->type, AssessmentStepType::class),
                                    $poolSkill->skill->name[$this->lang],
                                    Lang::get('headings.decision_notes', [], $this->lang),
                                );
                            }
                        }
                        $this->generatedHeaders['ROD_details'][] = $this->localizeHeading('final_decision');
                    }
                }
            });
    }

    private function generatePoolCells(Worksheet $sheet, int $columnCount)
    {

        $currentColumn = $columnCount;

        foreach ($this->generalQuestionIds as $generalQuestionId) {
            $currentColumn++;
            if (isset($this->generalQuestionResponses[$generalQuestionId])) {
                foreach ($this->generalQuestionResponses[$generalQuestionId] as $row) {
                    $sheet->setCellValue([$currentColumn, $row['candidate'] + 1], $row['value']);
                }
            }
        }

        foreach ($this->screeningQuestionIds as $screeningQuestionId) {
            $currentColumn++;
            if (isset($this->screeningQuestionResponses[$screeningQuestionId])) {
                foreach ($this->screeningQuestionResponses[$screeningQuestionId] as $row) {
                    $sheet->setCellValue([$currentColumn, $row['candidate'] + 1], $row['value']);
                }
            }
        }

        foreach ($this->skillIds as $skillId) {
            $currentColumn++;
            if (isset($this->poolSkills[$skillId])) {
                foreach ($this->poolSkills[$skillId] as $row) {
                    $sheet->setCellValue([$currentColumn, $row['candidate'] + 1], $row['value']);
                }
            }
        }

        if ($this->withROD) {
            foreach ($this->RODStepsWithPoolSkills as $step => $poolSkills) {
                foreach ($poolSkills as $poolSkill) {
                    $currentColumn += 3;
                    if (isset($this->RODData[$step][$poolSkill])) {
                        foreach ($this->RODData[$step][$poolSkill] as $row) {
                            $sheet->setCellValue([$currentColumn - 2, $row['candidate'] + 1], $row['decision']);
                            $sheet->setCellValue([$currentColumn - 1, $row['candidate'] + 1], $row['details']);
                            $sheet->setCellValue([$currentColumn, $row['candidate'] + 1], $row['notes']);
                        }
                    }
                }
            }
            $currentColumn++;
            if (isset($this->finalDecisions)) {
                foreach ($this->finalDecisions as $row) {
                    $sheet->setCellValue([$currentColumn, $row['candidate'] + 1], $row['value']);
                }
            }
        }

    }

    private function buildQuery()
    {
        /** @var Builder<\App\Models\PoolCandidate> $query */
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
            // Pool candidate search input renames
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

        /** @var Builder<\App\Models\PoolCandidate> $query */
        $query->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->whereNotDraft()
            ->wherePoolCandidateSearchInputToSpecialLocationMatching($this->filters);

        return $query;
    }
}
