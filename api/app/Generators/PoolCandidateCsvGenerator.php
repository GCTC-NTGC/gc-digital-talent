<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentDecision;
use App\Enums\AssessmentDecisionLevel;
use App\Enums\AssessmentResultJustification;
use App\Enums\AssessmentResultType;
use App\Enums\AssessmentStepType;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\FinalDecision;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\OverallAssessmentStatus;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\ProvinceOrTerritory;
use App\Enums\WorkRegion;
use App\Models\GeneralQuestion;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\ScreeningQuestion;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PoolCandidateCsvGenerator extends CsvGenerator implements FileGeneratorInterface
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

                $department = $candidate->user->department()->first();
                $preferences = $candidate->user->getOperationalRequirements();
                $educationRequirementExperiences = $candidate->educationRequirementExperiences->map(function ($experience) {
                    return $experience->getTitle();
                })->flatten()->unique()->toArray();

                $values = [
                    $candidate->pool->process_number, // Process number
                    $candidate->pool->name[$this->lang] ?? '', // Process name
                    $candidate->user->first_name, // First name
                    $candidate->user->last_name, // Last name
                    $this->localizeEnum($candidate->pool_candidate_status, PoolCandidateStatus::class), // Status
                    $this->localizeEnum($candidate->user->priority, PriorityWeight::class),
                    $candidate->suspended_at ? Lang::get('common.not_interested', [], $this->lang) : Lang::get('common.open_to_job_offers', [], $this->lang),
                    $this->sanitizeString($candidate->notes ?? ''), // Notes
                    $candidate->submitted_at ? $candidate->submitted_at->format('Y-m-d') : '', // Date received
                    $candidate->expiry_date ? $candidate->expiry_date->format('Y-m-d') : '', // Expiry date
                    $candidate->archived_at ? $candidate->archived_at->format('Y-m-d') : '', // Archival date
                    $this->localizeEnum($candidate->user->current_province, ProvinceOrTerritory::class), // Current province
                    $candidate->user->current_city, // Current city
                    $candidate->user->email, // Email
                    $this->localizeEnum($candidate->user->preferred_lang, Language::class),
                    $this->localizeEnum($candidate->user->preferred_language_for_interview, Language::class),
                    $this->localizeEnum($candidate->user->preferred_language_for_exam, Language::class),
                    $this->localizeEnum($candidate->user->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($candidate->user->citizenship, CitizenshipStatus::class),
                    $this->localizeEnum($candidate->user->first_official_language, Language::class),
                    $this->localizeEnum($candidate->user->estimated_language_ability, EstimatedLanguageAbility::class), // Estimated language ability
                    $candidate->user->second_language_exam_completed ? Lang::get('common.yes', [], $this->lang) : '', // Bilingual evaluation
                    is_null($candidate->user->second_language_exam_validity) ? '' : $this->yesOrNo($candidate->user->second_language_exam_validity), // Bilingual exam validity
                    $this->localizeEnum($candidate->user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($candidate->user->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($candidate->user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->yesOrNo($candidate->user->computed_is_gov_employee), // Government employee
                    $department->name[$this->lang] ?? '', // Department
                    $this->localizeEnum($candidate->user->computed_gov_employee_type, GovEmployeeType::class),
                    $candidate->user->work_email, // Work email
                    $candidate->user->getClassification(), // Current classification
                    $this->yesOrNo($candidate->user->has_priority_entitlement), // Priority entitlement
                    $candidate->user->priority_number ?? '', // Priority number
                    $candidate->user->position_duration ? $this->yesOrNo($candidate->user->wouldAcceptTemporary()) : '', // Accept temporary
                    $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                    $this->localizeEnumArray($candidate->user->location_preferences, WorkRegion::class),
                    $candidate->user->location_exemptions, // Location exemptions
                    $candidate->user->is_woman ? Lang::get('common.yes', [], $this->lang) : '', // Woman
                    $this->localizeEnumArray($candidate->user->indigenous_communities, IndigenousCommunity::class),
                    $candidate->user->is_visible_minority ? Lang::get('common.yes', [], $this->lang) : '', // Visible minority
                    $candidate->user->has_disability ? Lang::get('common.yes', [], $this->lang) : '', // Disability
                    $this->sanitizeEnum($candidate->education_requirement_option), // Education requirement
                    implode(', ', $educationRequirementExperiences ?? []), // Education requirement experiences
                ];

                $userSkills = $candidate->user->userSkills->map(function ($userSkill) {
                    return $userSkill->skill->name[$this->lang] ?? '';
                });
                $values[] = implode(', ', $userSkills->toArray());

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

                $poolSkillIds = $candidate->pool->poolSkills->pluck('skill_id')->toArray();
                $candidateSkillIds = $candidate->user->userSkills->pluck('skill_id')->toArray();
                foreach ($poolSkillIds as $skillId) {
                    if (in_array($skillId, $candidateSkillIds)) {
                        $userSkill = $candidate->user->userSkills->where('skill_id', $skillId)->first();

                        $this->poolSkills[$skillId][] = [
                            'candidate' => $currentCandidate,
                            'value' => implode("\r\n", $userSkill->experiences
                                ->map(function ($experience) use ($userSkill) {
                                    $skill = $experience->skills->where('id', $userSkill->skill_id)->first();

                                    return $experience->getTitle().': '.$skill->experience_skill->details;
                                })->toArray()),
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
                    if (is_null($candidate->computed_final_decision) || $candidate->computed_final_decision === FinalDecision::TO_ASSESS->name) {
                        if (! isset($candidate->computed_assessment_status['overallAssessmentStatus'])) {
                            $decision = Lang::get('final_decision.to_assess', [], $this->lang);
                        } else {
                            if ($candidate->computed_assessment_status['overallAssessmentStatus'] === OverallAssessmentStatus::DISQUALIFIED->name) {
                                $decision = Lang::get('final_decision.disqualified_pending', [], $this->lang);
                            } elseif ($candidate->computed_assessment_status['currentStep'] === null) {
                                $decision = Lang::get('final_decision.qualified_pending', [], $this->lang);
                            } else {
                                $decision = Lang::get('final_decision.to_assess', [], $this->lang)
                                            .$this->colon()
                                            .Lang::get('common.step', [], $this->lang)
                                            .' '
                                            .$candidate->computed_assessment_status['currentStep'];
                            }
                        }
                    } else {
                        $decision = $this->localizeEnum($candidate->computed_final_decision, FinalDecision::class);
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
            'user' => [
                'department',
                'currentClassification',
                'userSkills',
                'userSkills.skill',
                'userSkills.awardExperiences',
                'userSkills.awardExperiences.skills',
                'userSkills.communityExperiences',
                'userSkills.communityExperiences.skills',
                'userSkills.educationExperiences',
                'userSkills.educationExperiences.skills',
                'userSkills.personalExperiences',
                'userSkills.personalExperiences.skills',
                'userSkills.workExperiences',
                'userSkills.workExperiences.skills',
                'awardExperiences.userSkills.skill',
                'communityExperiences.userSkills.skill',
                'educationExperiences.userSkills.skill',
                'personalExperiences.userSkills.skill',
                'workExperiences.userSkills.skill',
            ],
        ]);

        $this->applyFilters($query, [
            // Pool candidate search input renames
            'email' => 'whereEmail',
            'generalSearch' => 'whereGeneralSearch',
            'name' => 'whereName',
            'notes' => 'whereNotesLike',
            'isGovEmployee' => 'whereIsGovEmployee',
            'poolCandidateStatus' => 'whereStatusIn',
            'priorityWeight' => 'whereCandidateCategoryIn',
            'expiryStatus' => 'whereExpiryStatus',
            'suspendedStatus' => 'whereSuspendedStatus',
            'publishingGroups' => 'wherePublishingGroupsIn',
            'appliedClassifications' => 'whereAppliedClassificationsIn',
            'processNumber' => 'whereProcessNumber',

            // Applicant filter input renames
            'equity' => 'whereEquityIn',
            'hasDiploma' => 'whereHasDiploma',
            'languageAbility' => 'whereLanguageAbility',
            'locationPreferences' => 'whereLocationPreferencesIn',
            'operationalRequirements' => 'whereOperationalRequirementsIn',
            'positionDuration' => 'wherePositionDuration',
            'pools' => 'whereAvailableInPools',
            'skills' => 'whereSkillsAdditive',
            'skillsIntersectional' => 'whereSkillsIntersectional',
            'qualifiedClassifications' => 'whereQualifiedClassificationsIn',
            'community' => 'whereCandidatesInCommunity',
        ]);

        /** @var Builder<\App\Models\PoolCandidate> $query */
        $query->whereAuthorizedToView(['userId' => $this->userId])->whereNotDraft();

        return $query;
    }
}
