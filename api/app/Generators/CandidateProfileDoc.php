<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use Exception;

class CandidateProfileDoc extends DocGenerator
{
    protected array $ids;

    protected string $lang = 'en';

    protected bool $anonymous;

    public function __construct(array $ids, ?string $lang = 'en', ?bool $anonymous = false)
    {
        $this->ids = $ids;
        $this->lang = $lang;
        $this->anonymous = $anonymous;

        parent::__construct();
    }

    public function generate()
    {
        $candidates = PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'awardExperiences' => ['userSkills' => ['skill']],
                'communityExperiences' => ['userSkills' => ['skill']],
                'educationExperiences' => ['userSkills' => ['skill']],
                'personalExperiences' => ['userSkills' => ['skill']],
                'workExperiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->get();

        if (empty($candidates)) {
            throw new Exception('No candidates found.');
        }

        $this->doc->addTitle('Applicant snapshot');

        $candidates->each(function ($candidate) {
            $section = $this->doc->addSection();

            $section->addTitle($candidate->user->getFullName($this->anonymous), 1);

            $section->addTitle('General information', 2);

            $this->addSubTitle($section, 'Contact Information');
            $this->addLabelText($section, 'Email', $candidate->user->email);
            $this->addLabelText($section, 'Phone', $candidate->user->telephone);
            $this->addLabelText($section, 'City', $candidate->user->getLocation());
            $this->addLabelText($section, 'Communication language', $candidate->user->getLanguage('preferred_lang'));
            $this->addLabelText($section, 'Spoken interview language', $candidate->user->getLanguage('preferred_language_for_interview'));
            $this->addLabelText($section, 'Written exam language', $candidate->user->getLanguage('preferred_language_for_exam'));
            $this->addLabelText($section, 'Member of CAF', $candidate->user->getArmedForcesStatus());
            $this->addLabelText($section, 'Citizenship', $candidate->user->getCitizenship());

            $this->addSubTitle($section, 'Language information');
            $this->addLabelText($section, 'Interested in', $candidate->user->getLookingForLanguage());
            $this->addLabelText($section, 'Completed an official GoC evaluation', $candidate->user->getBilingualEvaluation());
            $this->addLabelText($section, 'Second language level (Comprehension, Written, Verbal)', $candidate->user->getSecondLanguageEvaluation());

            $this->addSubTitle($section, 'Government information');
            $this->addLabelText($section, 'Government of Canada employee', $candidate->user->is_gov_employee ? 'Yes' : 'No');
            if ($candidate->user->is_gov_employee) {
                $department = $candidate->user->department()->first();
                $this->addLabelText($section, 'Department', $department->name[$this->lang] ?? '');
                $this->addLabelText($section, 'Employee type', $candidate->user->getGovEmployeeType());
                $this->addLabelText($section, 'Classification', $candidate->user->getClassification());
            }
            $this->addLabelText($section, 'Priority entitlement', $candidate->user->has_priority_entitlement ? 'Yes' : 'No');

            $this->addSubTitle($section, 'Work location');
            $this->addLabelText(
                $section,
                'Work location',
                $candidate->user->location_preferences ? implode(', ', $candidate->user->location_preferences) : ''
            );
            $this->addLabelText($section, 'Location exemptions', $candidate->user->location_exemptions);

            $this->addSubTitle($section, 'Diversity, equity, inclusion');

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
                $section->addTitle('My skills and experience', 2);
                $experiences = [];

                $candidate->user->experiences->each(function ($experience) use (&$experiences) {
                    $type = $experience->getExperienceType();
                    if (! isset($experiences[$type])) {
                        $experiences[$type] = collect();
                    }
                    $experiences[$type]->push($experience);
                });

                foreach ($experiences as $type => $group) {
                    $this->addSubTitle($section, ucwords($type).' experiences', 3);
                    $group->each(function ($experience) use ($section) {
                        $this->addSubTitle($section, $experience->getTitle(), 4);
                        $section->addText($experience->getDateRange());
                        $section->addTextBreak(1);
                        $section->addText($experience->details);

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
                    $this->addSubTitle($section, $response->screeningQuestion->question[$this->lang], 3);
                    $section->addText($response->answer);
                });
            }

            $section->addTitle('Skills showcase', 2);
            $section->addText('The skill showcase allows a candidate to provide a curated series of lists that highlight their specific strengths, weaknesses, and skill growth opportunities. These lists can provide you with insight into a candidate’s broader skillset and where they might be interested in learning new skills.');

            if ($candidate->user->topBehaviouralSkillsRanking->count() > 0 || $candidate->user->topTechnicalSkillsRanking->count() > 0) {

                $this->addSubTitle($section, 'Top skills', 3);

                $this->skillRanks($section, $candidate->user->topBehaviouralSkillsRanking, 'Behaioural skills');
                $this->skillRanks($section, $candidate->user->topTechnicalSkillsRanking, 'Technical skills');

            }

            if ($candidate->user->improveBehaviouralSkillsRanking->count() > 0 || $candidate->user->improveTechnicalSkillsRanking->count() > 0) {
                $this->addSubTitle($section, 'Skills to improve', 3);

                $this->skillRanks($section, $candidate->user->improveBehaviouralSkillsRanking, 'Behaioural skills');
                $this->skillRanks($section, $candidate->user->improveTechnicalSkillsRanking, 'Technical skills');
            }

            $section->addPageBreak();
        });
    }

    private function skillRanks($section, $skills, $title)
    {
        if ($skills->count() > 0) {
            $this->addSubTitle($section, $title, 3);
            $skills->each(function ($userSkill) use ($section) {
                $listRun = $section->addListItemRun();
                $listRun->addText($userSkill->skill->name[$this->lang], $this->strong);
                if ($userSkill->skill_level) {
                    $listRun->addText(': '.ucwords(strtolower($userSkill->skill_level)));
                }
            });
        }
    }
}
