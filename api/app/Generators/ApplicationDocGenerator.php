<?php

namespace App\Generators;

use App\Enums\EducationRequirementOption;
use App\Enums\PoolSkillType;
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

    public function __construct(protected array $ids, public string $fileName, public ?string $dir, protected ?string $lang)
    {
        parent::__construct($fileName, $dir);
        $this->anonymous = false;
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading(count($this->ids) > 1 ? 'candidate_profiles' : 'candidate_profile'), 1);

        PoolCandidate::with([
            'educationRequirementExperiences',
            'pool' => ['poolSkills' => ['skill']],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->authorizedToView(['userId' => $this->userId])
            ->chunk(200, function ($candidates) use ($section) {

                foreach ($candidates as $candidate) {
                    $snapshot = $candidate->profile_snapshot;
                    $user = User::hydrateSnapshot($snapshot);
                    $experiences = isset($snapshot['experiences']) ? Experience::hydrateSnapshot($snapshot['experiences']) : [];
                    $section->addTitle($user->getFullName(), 2);

                    $section->addTitle($this->localizeHeading('education_requirement'), 3);
                    $this->addLabelText($section, $this->localizeHeading('requirement_selection'), $this->localizeEnum($candidate->education_requirement_option, EducationRequirementOption::class));
                    $candidate->educationRequirementExperiences->each(function ($educationExperience) use ($section) {
                        $section->addListItem($educationExperience->getTitle($this->lang));
                    });

                    $skillDetails = $this->getSkillDetails($candidate->pool->poolSkills, $experiences, $snapshot['experiences']);

                    $section->addTitle($this->localize('pool_skill_type.essential', 3));
                    if (isset($skillDetails[PoolSkillType::ESSENTIAL->name])) {
                        $this->generateSkillsDetails($section, $skillDetails[PoolSkillType::ESSENTIAL->name]);
                    } else {
                        $section->addText($this->localize('common.not_provided'));
                    }

                    $section->addTitle($this->localize('pool_skill_type.nonessential', 3));
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

                    if (isset($snapshot['experiences'])) {
                        $experiences = Experience::hydrateSnapshot($snapshot['experiences']);
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

                    $section->addPageBreak();
                }
            });

        return $this;
    }

    /**
     * Get details from experiences for pool skills
     *
     * @param  Collection  $poolSkils  Skills for the pool the candidate applied to
     * @param  array  $experiences  The experiences in the users snapshot
     * @return Collection The pools skill collection with user experiences attached
     */
    private function getSkillDetails(Collection $poolSkills, array $experiences, array $snapshotExperiences)
    {
        $experiencesWithDetails = array_map(function ($experience) use ($snapshotExperiences) {
            $snapshotExperience = Arr::first($snapshotExperiences, function ($snapshot) use ($experience) {
                return $snapshot['id'] == $experience->id;
            });

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
                $skill = Arr::first($experience['skillDetails'], function ($skill) use ($poolSkill) {
                    return $skill['id'] === $poolSkill->skill_id;
                });

                return [
                    'title' => $experience['experience']->getTitle(),
                    'details' => $skill['details'] ?? '',
                ];
            }, $experiencesWithDetails);

            return [
                'skill' => $poolSkill->skill->only(['id', 'name', 'category']),
                'type' => $poolSkill->type,
                'experiences' => Arr::where($skillExperiences, function ($experience) {
                    return ! empty($experience['details']);
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
                $section->addTitle($experience['title'], 5);
                $section->addText($experience['details']);
            }
        });
    }
}
