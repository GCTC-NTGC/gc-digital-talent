<?php

namespace App\Generators;

use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\PoolCandidate;
use App\Models\WorkExperience;

class PoolCandidateDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    public function __construct(protected array $ids, protected bool $anonymous, public string $fileName, public ?string $dir, protected ?string $lang)
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle('Candidate Profiles', 1);

        PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'experiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->chunk(200, function ($candidates) use ($section) {

                foreach ($candidates as $candidate) {
                    $section->addTitle($candidate->user->getFullName($this->anonymous), 2);

                    $section->addTitle('Contact Information', 3);

                    $this->addLabelText($section, 'Email', $candidate->user->email);
                    $this->addLabelText($section, 'Phone', $candidate->user->telephone);
                    $this->addLabelText($section, 'City', $candidate->user->getLocation());
                    $this->addLabelText($section, 'Communication language', $candidate->user->getLanguage('preferred_lang'));
                    $this->addLabelText($section, 'Spoken interview language', $candidate->user->getLanguage('preferred_language_for_interview'));
                    $this->addLabelText($section, 'Written exam language', $candidate->user->getLanguage('preferred_language_for_exam'));

                    $section->addTitle('General information', 3);

                    $section->addTitle('Status', 4);
                    $this->addLabelText($section, 'Member of CAF', $candidate->user->getArmedForcesStatus());
                    $this->addLabelText($section, 'Citizenship', $candidate->user->getCitizenship());

                    $section->addTitle('Language information', 4);
                    $this->addLabelText($section, 'Interested in', $candidate->user->getLookingForLanguage());
                    $this->addLabelText($section, 'Completed an official GoC evaluation', $candidate->user->getBilingualEvaluation());
                    $this->addLabelText($section, 'Second language level (Comprehension, Written, Verbal)', $candidate->user->getSecondLanguageEvaluation());

                    $section->addTitle('Government information', 4);
                    $this->addLabelText($section, 'Government of Canada employee', $candidate->user->is_gov_employee ? 'Yes' : 'No');
                    if ($candidate->user->is_gov_employee) {
                        $department = $candidate->user->department()->first();
                        $this->addLabelText($section, 'Department', $department->name[$this->lang] ?? '');
                        $this->addLabelText($section, 'Employee type', $candidate->user->getGovEmployeeType());
                        $this->addLabelText($section, 'Classification', $candidate->user->getClassification());
                    }
                    $this->addLabelText($section, 'Priority entitlement', $candidate->user->has_priority_entitlement ? 'Yes' : 'No');
                    if ($candidate->user->has_priority_entitlement) {
                        $this->addLabelText($section, 'Priority number', $candidate->user->priority_number);
                    }

                    $section->addTitle('Work location', 4);
                    $this->addLabelText(
                        $section,
                        'Work location',
                        $candidate->user->location_preferences ? $this->sanitizeEnum(implode(', ', $candidate->user->location_preferences)) : ''
                    );
                    $this->addLabelText($section, 'Location exemptions', $candidate->user->location_exemptions ?? '');

                    $section->addTitle('Work preferences', 4);

                    if ($duration = $candidate->user->getPositionDuration()) {
                        $section->addText('Would consider accepting a position that lasts for:');
                        $section->addListItem($duration);
                    }

                    $preferences = $candidate->user->getOperationalRequirements();
                    if (count($preferences['accepted']) > 0) {
                        $section->addText('Would consider accepting a job that requires:');

                        foreach ($preferences['accepted'] as $preference) {
                            $section->addListItem($this->sanitizeEnum($preference));
                        }
                    }

                    if (count($preferences['not_accepted']) > 0) {
                        $notConsiderRun = $section->addTextRun();
                        $notConsiderRun->addText('Would ');
                        $notConsiderRun->addText('not consider', $this->strong);
                        $notConsiderRun->addText(' a job that requires:');

                        foreach ($preferences['not_accepted'] as $preference) {
                            $section->addListItem($this->sanitizeEnum($preference));
                        }
                    }

                    $section->addTitle('Diversity, equity, inclusion', 4);

                    $indigenousCommunities = $candidate->user->getIndigenousCommunities();
                    if ($indigenousCommunities) {
                        foreach ($indigenousCommunities as $community) {
                            $section->addListItem($community);
                        }
                    }
                    if ($candidate->user->is_woman) {
                        $section->addListItem('Woman');
                    }
                    if ($candidate->user->is_visible_minority) {
                        $section->addListItem('Visible minority');
                    }
                    if ($candidate->user->has_disability) {
                        $section->addListItem('Person with a disability');
                    }

                    if ($candidate->user->experiences->count() > 0) {
                        $section->addTitle('Career timeline', 2);
                        $experiences = [];

                        $candidate->user->experiences->each(function ($experience) use (&$experiences) {
                            $type = $experience::class;
                            if (! isset($experiences[$type])) {
                                $experiences[$type] = collect();
                            }
                            $experiences[$type]->push($experience);
                        });

                        foreach ($experiences as $type => $group) {
                            $group->each(function ($experience) use ($section, $type) {
                                if ($type === AwardExperience::class) {
                                    $section->addTitle('Award experiences', 3);
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange());
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, 'Awarded to', $experience->awarded_to);
                                    $this->addLabelText($section, 'Issuing organization', $experience->issued_by);
                                    $this->addLabelText($section, 'Award scope', $experience->awarded_scope);
                                }

                                if ($type === CommunityExperience::class) {
                                    $section->addTitle('Community experiences', 3);
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange());
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, 'Project / Product', $experience->project);
                                }

                                if ($type === EducationExperience::class) {
                                    $section->addTitle('Education experiences', 3);
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange());
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, 'Area of study', $experience->area_of_study);
                                    $this->addLabelText($section, 'Status', $experience->status);
                                    $this->addLabelText($section, 'Thesis title', $experience->thesis_title);
                                }

                                if ($type === PersonalExperience::class) {
                                    $section->addTitle('Personal experiences', 3);
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange());
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, 'Learning description', $experience->description);
                                }

                                if ($type === WorkExperience::class) {
                                    $section->addTitle('Work experiences', 3);
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange());
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, 'Team, group or division', $experience->division);
                                }

                                $section->addTextBreak(1);
                                $this->addLabelText($section, 'Additional details', $experience->details);

                                if ($experience->userSkills->count() > 0) {
                                    $section->addTextBreak(1);
                                }

                                $experience->userSkills->each(function ($skill) use ($section) {
                                    $skillRun = $section->addListItemRun();
                                    $skillRun->addText($skill->skill->name[$this->lang], $this->strong);
                                    if (isset($skill->experience_skill->details)) {
                                        $skillRun->addText(': '.$skill->experience_skill->details);
                                    }
                                });
                            });
                        }
                    }

                    if ($candidate->screeningQuestionResponses->count() > 0) {
                        $section->addTitle('Screening questions', 2);
                        $candidate->screeningQuestionResponses->each(function ($response) use ($section) {
                            $section->addTitle($response->screeningQuestion->question[$this->lang], 3);
                            $section->addText($response->answer);
                        });
                    }

                    $section->addTitle('Skills showcase', 2);
                    $section->addText('The skill showcase allows a candidate to provide a curated series of lists that highlight their specific strengths, weaknesses, and skill growth opportunities. These lists can provide you with insight into a candidate’s broader skill set and where they might be interested in learning new skills.');

                    if ($candidate->user->topBehaviouralSkillsRanking->count() > 0 || $candidate->user->topTechnicalSkillsRanking->count() > 0) {

                        $section->addTitle('Top skills', 3);

                        $this->skillRanks($section, $candidate->user->topBehaviouralSkillsRanking, 'Behavioural skills');
                        $this->skillRanks($section, $candidate->user->topTechnicalSkillsRanking, 'Technical skills');
                    }

                    if ($candidate->user->improveBehaviouralSkillsRanking->count() > 0 || $candidate->user->improveTechnicalSkillsRanking->count() > 0) {
                        $section->addTitle('Skills to improve', 3);

                        $this->skillRanks($section, $candidate->user->improveBehaviouralSkillsRanking, 'Behavioural skills');
                        $this->skillRanks($section, $candidate->user->improveTechnicalSkillsRanking, 'Technical skills');
                    }

                    $section->addPageBreak();
                }
            });

        return $this;
    }

    private function skillRanks($section, $skills, $title)
    {
        if ($skills->count() > 0) {
            $section->addTitle($title, 4);
            $skills->each(function ($userSkill) use ($section) {
                $listRun = $section->addListItemRun();
                $listRun->addText($userSkill->skill->name[$this->lang], $this->strong);
                if ($userSkill->skill_level) {
                    $listRun->addText(': '.$this->sanitizeEnum($userSkill->skill_level));
                }
            });
        }
    }
}
