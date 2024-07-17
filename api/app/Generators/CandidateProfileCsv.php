<?php

namespace App\Generators;

use App\Enums\PositionDuration;
use App\Models\Pool;
use App\Models\PoolCandidate;

class CandidateProfileCsv extends CsvGenerator
{
    protected array $ids;

    protected string $lang = 'en';

    protected array $headers = [
        'Status',
        'Category',
        'Availability',
        'Notes',
        'Current province',
        'Date received',
        'Expiry date',
        'Archival date',
        'First name',
        'Last name',
        'Email',
        'Preferred communication language',
        'Preferred spoken interview language',
        'Preferred written exam language',
        'Current city',
        'Armed forces status',
        'Citizenship',
        'Bilingual evaluation',
        'Reading level',
        'Writing level',
        'Oral interaction level',
        'Estimated language ability',
        'Government employee',
        'Department',
        'Employee type',
        'Current classification',
        'Priority entitlement',
        'Priority number',
        'Location preferences',
        'Location exemptions',
        'Accept temporary',
        'Accepted operational requirements',
        'Woman',
        'Indigenous',
        'Visible minority',
        'Disability',
        'Education requirement',
        'Education requirement experiences',
    ];

    protected array $questionIds = [];

    protected array $skillIds = [];

    public function __construct(array $ids, ?string $lang = 'en')
    {
        $this->ids = $ids;
        $this->lang = $lang;

        parent::__construct();
    }

    public function generate()
    {

        $this->generatePoolHeaders();

        $sheet = $this->spreadsheet->getActiveSheet();

        $sheet->fromArray($this->headers, null, 'A1');
        $currentCandidate = 1;

        PoolCandidate::with([
            'generalQuestionResponses' => ['generalQuestion'],
            'educationRequirementExperiences',
            'user' => [
                'department',
                'currentClassification',
                'userSkills' => ['skill'],
                'awardExperiences' => ['userSkills' => ['skill']],
                'communityExperiences' => ['userSkills' => ['skill']],
                'educationExperiences' => ['userSkills' => ['skill']],
                'personalExperiences' => ['userSkills' => ['skill']],
                'workExperiences' => ['userSkills' => ['skill']],
            ],
        ])
            ->whereIn('id', $this->ids)->chunk(200, function ($candidates) use ($sheet, &$currentCandidate) {
                foreach ($candidates as $candidate) {

                    $department = $candidate->user->department()->first();
                    $preferences = $candidate->user->getOperationalRequirements();
                    $educationRequirementExperiences = $candidate->educationRequirementExperiences->map(function ($experience) {
                        return $experience->getTitle();
                    })->flatten()->unique()->toArray();
                    $locationPreferences = '';
                    if ($candidate->user->location_preferences) {
                        $locationPreferences = implode(', ', $candidate->user->location_preferences);
                    }

                    $values = [
                        $this->sanitizeEnum($candidate->pool_candidate_status), // Status
                        $candidate->user->getPriority(), // Category
                        '', // Availability
                        $this->sanitizeString($candidate->notes ?? ''), // Notes
                        $this->sanitizeEnum($candidate->user->current_province), // Current province
                        $candidate->submitted_at ? $candidate->submitted_at->format('Y-m-d') : '', // Date received
                        $candidate->expiry_date ? $candidate->expiry_date->format('Y-m-d') : '', // Expiry date
                        $candidate->archived_at ? $candidate->archival_at->format('Y-m-d') : '', // Archival date
                        $candidate->user->first_name, // First name
                        $candidate->user->last_name, // Last name
                        $candidate->user->email, // Email
                        $candidate->user->getLanguage('preferred_lang'), // Preferred communication language
                        $candidate->user->getLanguage('preferred_language_for_interview'), // Preferred spoken interview language
                        $candidate->user->getLanguage('preferred_language_for_exam'), // Preferred written exam language
                        $candidate->user->current_city, // Current city
                        $candidate->user->getArmedForcesStatus(), // Armed forces status
                        $candidate->user->getCitizenship(), // Citizenship
                        is_null($candidate->user->second_language_exam_completed) ? '' : $this->yesOrNo($candidate->user->second_language_exam_completed), // Bilingual evaluation
                        $candidate->user->comprehension_level, // Reading level
                        $candidate->user->written_level, // Writing level
                        $candidate->user->verbal_level, // Oral interaction level
                        $this->sanitizeEnum($candidate->user->estimated_language_ability ?? ''), // Estimated language ability
                        $this->yesOrNo($candidate->user->is_gov_employee), // Government employee
                        $department->name[$this->lang] ?? '', // Department
                        $candidate->user->getGovEmployeeType(), // Employee type
                        $candidate->user->getClassification(), // Current classification
                        $this->yesOrNo($candidate->user->has_priority_entitlement), // Priority entitlement
                        $candidate->user->priority_number ?? '', // Priority number
                        $locationPreferences ? $this->sanitizeEnum($locationPreferences) : '', // Location preferences
                        $candidate->user->location_exemptions, // Location exemptions
                        $candidate->user->position_duration ? $this->yesOrNo(in_array(PositionDuration::TEMPORARY->name, $candidate->user->position_duration)) : '', // Accept temporary
                        $this->sanitizeEnum(implode(', ', $preferences['accepted'] ?? []) ?? ''), // Accepted operational requirements
                        $this->yesOrNo($candidate->user->is_woman), // Woman
                        implode(', ', $candidate->user->getIndigenousCommunities() ?? []), // Indigenous
                        $this->yesOrNo($candidate->user->is_visible_minority), // Visible minority
                        $this->yesOrNo($candidate->user->has_disability), // Disability
                        $this->sanitizeEnum($candidate->education_requirement_option), // Education requirement
                        implode(', ', $educationRequirementExperiences ?? []), // Education requirement experiences
                    ];

                    $candidateQuestionIds = $candidate->generalQuestionResponses->pluck('general_question_id')->toArray();
                    foreach ($this->questionIds as $questionId) {
                        if (in_array($questionId, $candidateQuestionIds)) {
                            $response = $candidate->generalQuestionResponses->where('general_question_id', $questionId)->first();
                            $values[] = $this->sanitizeString($response->answer);
                        } else {
                            $values[] = '';
                        }
                    }

                    $candidateSkillIds = $candidate->user->userSkills->pluck('skill_id')->toArray();
                    foreach ($this->skillIds as $skillId) {
                        if (in_array($skillId, $candidateSkillIds)) {
                            $userSkill = $candidate->user->userSkills->where('skill_id', $skillId)->first();
                            $values[] = $userSkill->skill->details;
                        } else {
                            $values[] = '';
                        }
                    }

                    // 2 is added to the key to account for the header row and 0 index
                    $sheet->fromArray($values, null, 'A'.$currentCandidate + 2);
                    $currentCandidate++;
                }
            });

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
        $this->headers[] = 'Skills';

        Pool::with(['generalQuestions', 'poolSkills' => ['skill']])
            ->whereHas('poolCandidates', function ($query) {
                $query->whereIn('id', $this->ids);
            })->chunk(100, function ($pools) {
                foreach ($pools as $pool) {
                    if ($pool->generalQuestions->count() > 0) {
                        foreach ($pool->generalQuestions as $question) {
                            $this->questionIds[] = $question->id;
                            $this->headers[] = $question->question[$this->lang];
                        }
                    }

                    if ($pool->poolSkills->count() > 0) {
                        $skillsByGroup = $pool->poolSkills->groupBy('type');

                        foreach ($skillsByGroup as $group => $skills) {
                            foreach ($skills as $skill) {
                                $this->skillIds[] = $skill->skill_id;
                                $this->headers[] = sprintf('%s (%s)',
                                    $skill->skill->name[$this->lang],
                                    $this->sanitizeEnum($group)
                                );
                            }
                        }
                    }
                }
            });

    }
}
