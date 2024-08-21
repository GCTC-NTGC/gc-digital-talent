<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\PoolCandidateStatus;
use App\Enums\PoolSkillType;
use App\Enums\PriorityWeight;
use App\Enums\ProvinceOrTerritory;
use App\Enums\WorkRegion;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Traits\Generator\Filterable;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class PoolCandidateCsvGenerator extends CsvGenerator implements FileGeneratorInterface
{
    use Filterable;
    use GeneratesFile;

    protected array $generalQuestionIds = [];

    protected array $screeningQuestionIds = [];

    protected array $skillIds = [];

    protected array $poolIds = [];

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'status',
        'category',
        'availability',
        'notes',
        'current_province',
        'date_received',
        'expiry_date',
        'archival_date',
        'first_name',
        'last_name',
        'email',
        'preferred_communication_language',
        'preferred_spoken_interview_language',
        'preferred_written_exam_language',
        'current_city',
        'armed_forces_status',
        'citizenship',
        'first_official_language',
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
        'estimated_language_ability',
        'government_employee',
        'department',
        'employee_type',
        'current_classification',
        'priority_entitlement',
        'priority_number',
        'location_preferences',
        'location_exemptions',
        'accept_temporary',
        'accepted_operational_requirements',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'education_requirement',
        'education_requirement_experiences',
    ];

    public function __construct(public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet();

        $sheet = $this->spreadsheet->getActiveSheet();

        $currentCandidate = 1;
        $query = $this->buildQuery();
        $query->chunk(200, function ($candidates) use ($sheet, &$currentCandidate) {
            foreach ($candidates as $candidate) {

                if (! in_array($candidate->pool_id, $this->poolIds)) {
                    $this->poolIds[] = $candidate->pool_id;
                }

                $department = $candidate->user->department()->first();
                $preferences = $candidate->user->getOperationalRequirements();
                $educationRequirementExperiences = $candidate->educationRequirementExperiences->map(function ($experience) {
                    return $experience->getTitle();
                })->flatten()->unique()->toArray();

                $values = [
                    $this->localizeEnum($candidate->pool_candidate_status, PoolCandidateStatus::class), // Status
                    $this->localizeEnum($candidate->user->priority, PriorityWeight::class),
                    '', // Availability
                    $this->sanitizeString($candidate->notes ?? ''), // Notes
                    $this->localizeEnum($candidate->user->current_province, ProvinceOrTerritory::class), // Current province
                    $candidate->submitted_at ? $candidate->submitted_at->format('Y-m-d') : '', // Date received
                    $candidate->expiry_date ? $candidate->expiry_date->format('Y-m-d') : '', // Expiry date
                    $candidate->archived_at ? $candidate->archival_at->format('Y-m-d') : '', // Archival date
                    $candidate->user->first_name, // First name
                    $candidate->user->last_name, // Last name
                    $candidate->user->email, // Email
                    $this->localizeEnum($candidate->user->preferred_lang, Language::class),
                    $this->localizeEnum($candidate->user->preferred_language_for_interview, Language::class),
                    $this->localizeEnum($candidate->user->preferred_language_for_exam, Language::class),
                    $candidate->user->current_city, // Current city
                    $this->localizeEnum($candidate->user->armed_forces_status, ArmedForcesStatus::class),
                    $this->localizeEnum($candidate->user->citizenship, CitizenshipStatus::class),
                    $this->localizeEnum($candidate->user->first_official_language, Language::class),
                    is_null($candidate->user->second_language_exam_completed) ? '' : $this->yesOrNo($candidate->user->second_language_exam_completed), // Bilingual evaluation
                    $this->yesOrNo($candidate->user->second_language_exam_validity),
                    $this->localizeEnum($candidate->user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                    $this->localizeEnum($candidate->user->written_level, EvaluatedLanguageAbility::class), // Writing level
                    $this->localizeEnum($candidate->user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                    $this->localizeEnum($candidate->user->estimated_language_ability, EstimatedLanguageAbility::class),
                    $this->yesOrNo($candidate->user->is_gov_employee), // Government employee
                    $department->name[$this->lang] ?? '', // Department
                    $this->localizeEnum($candidate->user->gov_employee_type, GovEmployeeType::class),
                    $candidate->user->getClassification(), // Current classification
                    $this->yesOrNo($candidate->user->has_priority_entitlement), // Priority entitlement
                    $candidate->user->priority_number ?? '', // Priority number
                    $this->localizeEnumArray($candidate->user->location_preferences, WorkRegion::class),
                    $candidate->user->location_exemptions, // Location exemptions
                    $candidate->user->position_duration ? $this->yesOrNo($candidate->user->wouldAcceptTemporary()) : '', // Accept temporary
                    $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                    $this->yesOrNo($candidate->user->is_woman), // Woman
                    $this->localizeEnumArray($candidate->user->indigenous_communities, IndigenousCommunity::class),
                    $this->yesOrNo($candidate->user->is_visible_minority), // Visible minority
                    $this->yesOrNo($candidate->user->has_disability), // Disability
                    $this->sanitizeEnum($candidate->education_requirement_option), // Education requirement
                    implode(', ', $educationRequirementExperiences ?? []), // Education requirement experiences
                ];

                $userSkills = $candidate->user->userSkills->map(function ($userSkill) {
                    return $userSkill->skill->name[$this->lang] ?? '';
                });
                $values[] = implode(', ', $userSkills->toArray());

                $candidateQuestionIds = $candidate->generalQuestionResponses->pluck('general_question_id')->toArray();
                foreach ($this->generalQuestionIds as $questionId) {
                    if (in_array($questionId, $candidateQuestionIds)) {
                        $response = $candidate->generalQuestionResponses->where('general_question_id', $questionId)->first();
                        $values[] = $this->sanitizeString($response->answer);
                    } else {
                        $values[] = '';
                    }
                }

                $candidateScreeningQuestionIds = $candidate->screeningQuestionResponses->pluck('screening_question_id')->toArray();
                foreach ($this->screeningQuestionIds as $questionId) {
                    if (in_array($questionId, $candidateScreeningQuestionIds)) {
                        $response = $candidate->screeningQuestionResponses->where('screening_question_id', $questionId)->first();
                        $values[] = $this->sanitizeString($response->answer);
                    } else {
                        $values[] = '';
                    }
                }

                $candidateSkillIds = $candidate->user->userSkills->pluck('skill_id')->toArray();
                foreach ($this->skillIds as $skillId) {
                    if (in_array($skillId, $candidateSkillIds)) {
                        $userSkill = $candidate->user->userSkills->where('skill_id', $skillId)->first();
                        $values[] = implode("\r\n", $userSkill->experiences
                            ->map(function ($experience) use ($userSkill) {
                                $skill = $experience->skills->where('id', $userSkill->skill_id)->first();

                                return $experience->getTitle().': '.$skill->experience_skill->details;
                            })->toArray());
                    } else {
                        $values[] = '';
                    }
                }

                // 1 is added to the key to account for the header row
                $sheet->fromArray($values, null, 'A'.$currentCandidate + 1);
                $currentCandidate++;
            }
        });

        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $this->generatePoolHeaders();
        $sheet->fromArray([
            ...$localizedHeaders,
            $this->localizeHeading('skills'),
            ...$this->generatedHeaders['general_questions'] ?? [],
            ...$this->generatedHeaders['screening_questions'] ?? [],
            ...$this->generatedHeaders['skill_details'] ?? [],
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
        Pool::with(['generalQuestions', 'screeningQuestions', 'poolSkills' => ['skill']])
            ->whereIn('id', $this->poolIds)
            ->chunk(100, function ($pools) {
                foreach ($pools as $pool) {
                    if ($pool->generalQuestions->count() > 0) {
                        foreach ($pool->generalQuestions as $question) {
                            $this->generalQuestionIds[] = $question->id;
                            $this->generatedHeaders['general_questions'][] =
                                Lang::get('headings.general_question', [], $this->lang).$this->colon().$question->question[$this->lang];
                        }
                    }

                    if ($pool->screeningQuestions->count() > 0) {
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
                }
            });
    }

    private function buildQuery()
    {
        $query = PoolCandidate::with([
            'generalQuestionResponses' => ['generalQuestion'],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'educationRequirementExperiences',
            'user' => [
                'department',
                'currentClassification',
                'userSkills' => ['skill', 'experiences' => ['skills']],
                'awardExperiences' => ['userSkills' => ['skill']],
                'communityExperiences' => ['userSkills' => ['skill']],
                'educationExperiences' => ['userSkills' => ['skill']],
                'personalExperiences' => ['userSkills' => ['skill']],
                'workExperiences' => ['userSkills' => ['skill']],
            ],
        ]);

        $query = $this->applyFilters($query, PoolCandidate::class, [
            'priorityWeight' => 'candidateCategory',
            'poolcandidateStatus' => 'poolcandidateStatuses',
            'pools' => 'availableInPools',
            'skills' => 'skillsAdditive',
            'community' => 'candidatesInCommunity',
        ]);

        $query->authorizedToView(['userId' => $this->userId]);

        return $query;
    }
}
