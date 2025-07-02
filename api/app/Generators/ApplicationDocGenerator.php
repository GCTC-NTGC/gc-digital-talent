<?php

namespace App\Generators;

use App\Enums\EducationRequirementOption;
use App\Enums\EducationType;
use App\Enums\PoolSkillType;
use App\Models\EducationExperience;
use App\Models\Experience;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Traits\Generator\GeneratesUserDoc;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

class ApplicationDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected PoolCandidate $candidate, public ?string $dir, protected ?string $lang)
    {
        $candidate->loadMissing(['user' => ['first_name', 'last_name'], 'pool' => ['classification']]);
        $fileName = sprintf(
            '%s %s - Application - Candidature',
            $this->sanitizeFileNameString($candidate->user?->first_name),
            $this->sanitizeFileNameString($candidate->user?->last_name),
        );

        parent::__construct($fileName, $dir);
        $this->anonymous = false;
    }

    public function generate(): self
    {

        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading('application_snapshot'), 1);
        $section->addText($this->localize('headings.application_snapshot_description'));
        $process = $this->candidate->pool->name[$this->lang] ?? '';
        $processNumber = $this->candidate->pool->process_number ?? '';
        $formattedDate = $this->candidate->submitted_at?->locale($this->lang)
            ->translatedFormat(__('headings.date_format')) ?? '';
        $receivedDate = $formattedDate;

        // Get classification details from pool
        $classification = $this->getClassificationDetails();
        $classificationString = '';

        if ($classification) {
            $group = $classification['group'] ?? '';
            $level = $classification['level'] ?? '';
            $name = $classification['name'][$this->lang] ?? '';

            $classificationString = sprintf('%s%s%s', $group, $level ? str_pad($level, 2, '0', STR_PAD_LEFT) : '', $name ? ' '.$name : '');
        }

        $this->addLabelText($section, $this->localize('headings.process'), sprintf('%s (%s)', $process, $classificationString));
        $this->addLabelText($section, $this->localize('headings.process_number'), $processNumber);
        $this->addLabelText($section, $this->localize('headings.date_received'), $receivedDate);

        $section->addTitle($this->localizeHeading('application_name'), 2);
        $candidate = $this->candidate;
        $candidate->load([
            'educationRequirementAwardExperiences',
            'educationRequirementCommunityExperiences',
            'educationRequirementEducationExperiences',
            'educationRequirementPersonalExperiences',
            'educationRequirementWorkExperiences',
            'pool' => ['poolSkills' => ['skill']],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ]);

        $snapshot = $candidate->profile_snapshot;
        $user = User::hydrateSnapshot($snapshot);
        $snapshotExperiences = $snapshot['experiences'] ?? [];
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

        $classToKeyMap = [
            \App\Models\AwardExperience::class => 'award_experience',
            \App\Models\CommunityExperience::class => 'community_experience',
            \App\Models\EducationExperience::class => 'education_experience',
            \App\Models\PersonalExperience::class => 'personal_experience',
            \App\Models\WorkExperience::class => 'work_experience',
        ];

        $sortByCurrentThenDate = function ($exp) {
            $isCurrent = is_null($exp->end_date) || $exp->end_date >= now();

            return [
                $isCurrent ? 1 : 0,
                $isCurrent ? $exp->start_date : ($exp->end_date ?? $exp->start_date),
            ];
        };

        $experiences = collect(Experience::hydrateSnapshot($snapshotExperiences))
            ->sortByDesc($sortByCurrentThenDate)
            ->groupBy(fn ($exp) => isset($classToKeyMap[$exp->getMorphClass()]) ? $classToKeyMap[$exp->getMorphClass()] : '')
            ->sortBy(fn ($_group, $typeKey) => $typeKey)
            ->flatMap(fn ($group) => $group->sortByDesc($sortByCurrentThenDate))
            ->values()
            ->all();

        $section->addTitle($user->getFullName(), 2);

        $section->addTitle($this->localizeHeading('education_requirement'), 3);
        $this->addLabelText($section, $this->localizeHeading('requirement_selection'), $this->localizeEnum($candidate->education_requirement_option, EducationRequirementOption::class));
        $candidate->educationRequirementExperiences->each(function ($educationExperience) use ($section) {
            /** @var \App\Models\EducationExperience $educationExperience */
            $section->addListItem($this->formatEducationTitle($educationExperience));

        });

        $skillDetails = $this->getSkillDetails($candidate->pool->poolSkills, $experiences, $snapshot['experiences']);
        $section->addTitle($this->localize('common.skill_requirements'), 2);
        $section->addTitle($this->localize('common.essential_skills'), 3);
        if (isset($skillDetails[PoolSkillType::ESSENTIAL->name])) {
            $this->generateSkillsDetails($section, $skillDetails[PoolSkillType::ESSENTIAL->name]);
        } else {
            $section->addText($this->localize('common.not_provided'));
        }

        $section->addTitle($this->localize('common.nonessential_skills'), 3);
        if (isset($skillDetails[PoolSkillType::NONESSENTIAL->name])) {
            $this->generateSkillsDetails($section, $skillDetails[PoolSkillType::NONESSENTIAL->name]);
        } else {
            $section->addText($this->localize('common.not_provided'));
        }

        if ($candidate->generalQuestionResponses->count() > 0) {
            $section->addTitle($this->localizeHeading('general_questions'), 2);
            $candidate->generalQuestionResponses->each(function ($response) use ($section) {
                $section->addTitle($response->generalQuestion->question[$this->lang], 3);
                $section->addText($response->answer);
            });
        }

        if ($candidate->screeningQuestionResponses->count() > 0) {
            $section->addTitle($this->localizeHeading('screening_questions'), 2);
            $candidate->screeningQuestionResponses->each(function ($response) use ($section) {
                $section->addTitle($response->screeningQuestion->question[$this->lang], 3);
                $section->addText($response->answer);
            });
        }

        if ($experiences && count($experiences) > 0) {
            $this->experiences($section, collect($experiences), false, 2);
        }

        $section->addTitle($this->localizeHeading('personal_info'), 2);
        $this->contactInfo($section, $user);
        $this->status($section, $user);
        $this->languageInfo($section, $user);
        $this->governmentInfo($section, $user);
        $this->workPreferences($section, $user);
        $this->dei($section, $user);

        $section->addTitle($this->localizeHeading('signature'), 2);
        $this->addLabelText($section, $this->localizeHeading('signed'), $candidate->signature);

        return $this;
    }

    /**
     * Get details from experiences for pool skills
     *
     * @param  Collection  $poolSkills  Skills for the pool the candidate applied to
     * @param  array  $experiences  The experiences in the users snapshot
     * @return Collection The pools skill collection with user experiences attached
     */
    private function getSkillDetails(Collection $poolSkills, array $experiences, array $snapshotExperiences)
    {
        $experiencesWithDetails = array_map(function ($experience) use ($snapshotExperiences) {
            $snapshotExperience = Arr::first($snapshotExperiences, function ($snapshot) use ($experience) {
                return $snapshot['id'] && $snapshot['id'] == $experience->id;
            }) ?? [];

            return [
                'experience' => $experience,
                'skillDetails' => $snapshotExperience ? array_map(function ($skill) {
                    return [
                        'id' => $skill['id'],
                        'details' => $skill['experienceSkillRecord']['details'],
                    ];
                }, $snapshotExperience['skills']) : [],
            ];
        }, $experiences);

        return $poolSkills->map(function ($poolSkill) use ($experiencesWithDetails) {
            $skillExperiences = array_map(function ($experience) use ($poolSkill) {
                if (empty($experience['skillDetails'])) {
                    return null;
                }
                $skill = Arr::first($experience['skillDetails'], function ($skill) use ($poolSkill) {
                    return isset($skill['id']) && $skill['id'] === $poolSkill->skill_id;
                });
                if (! $skill) {
                    return null;
                }

                return [
                    'title' => $experience['experience']->getTitle($this->lang),
                    'details' => $skill['details'] ?? '',
                    'experience_obj' => $experience['experience'],
                    'is_education' => $experience['experience'] instanceof EducationExperience,
                ];
            }, $experiencesWithDetails);

            return [
                'skill' => $poolSkill->skill->only(['id', 'name', 'category']),
                'type' => $poolSkill->type,
                'experiences' => Arr::where($skillExperiences, function ($experience) {
                    return $experience && ! empty($experience['details']);
                }),
            ];

        })
            ->filter(function ($poolSkill) {
                return ! empty($poolSkill['experiences']);
            })
            ->groupBy('type');
    }

    /**
     * Generates document text for pool skills with user experience details
     *
     * @param  Section  $section  The current document section
     * @param  Collection  $skills  The pool skills with user experience details attached
     */
    private function generateSkillsDetails(Section $section, Collection $skills)
    {
        $skills->each(function ($skillDetails) use ($section) {
            $section->addTitle($skillDetails['skill']['name'][$this->lang], 4);
            foreach ($skillDetails['experiences'] as $experience) {
                $title = $experience['is_education'] && $experience['experience_obj'] instanceof EducationExperience
                    ? $this->formatEducationTitle($experience['experience_obj'])
                    : $experience['title'];

                $section->addTitle($title, 5);
                $section->addText($experience['details']);
            }
        });
    }

    /**
     * Format education title
     *
     * @param  Experience  $educationExperience  The education experience to format
     * @return string The formatted title
     */
    private function formatEducationTitle(Experience $educationExperience): string
    {

        if (! $educationExperience instanceof EducationExperience) {
            return $educationExperience->getTitle();
        }
        $degreeType = $educationExperience->type
        ? $this->localizeEnum($educationExperience->type, EducationType::class)
        : null;
        $titleComponents = [];
        if ($degreeType) {
            $titleComponents[] = $degreeType;
        }
        if ($educationExperience->area_of_study) {
            $titleComponents[] = ($degreeType ? $this->localize('common.in').' ' : '')
            .$educationExperience->area_of_study;
        }
        if ($educationExperience->institution) {
            $titleComponents[] = $this->localize('common.from').' '.$educationExperience->institution;
        }

        return trim(implode(' ', $titleComponents)) ?: $educationExperience->getTitle($this->lang);

    }

    /**
     * Helper function to retrieve classification details from the candidate's pool
     *
     * @return array|null Classification details or null if not available
     */
    protected function getClassificationDetails(): ?array
    {
        if (! $this->candidate->relationLoaded('pool')) {
            return null;
        }

        return $this->candidate->pool->classification ?
        $this->candidate->pool->classification->only(['id', 'group', 'level', 'name'])
        : null;
    }
}
