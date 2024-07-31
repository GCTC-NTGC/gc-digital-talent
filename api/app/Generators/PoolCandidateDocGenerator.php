<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CitizenshipStatus;
use App\Enums\EducationStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillLevel;
use App\Enums\WorkRegion;
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
        $section->addTitle($this->localizeHeading('candidate_profiles'), 1);

        PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'experiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->chunk(200, function ($candidates) use ($section) {

                foreach ($candidates as $candidate) {
                    $user = $candidate->user;
                    $section->addTitle($user->getFullName($this->anonymous), 2);

                    $section->addTitle($this->localizeHeading('contact_info'), 3);
                    //
                    $this->addLabelText($section, $this->localizeHeading('email'), $user->email);
                    $this->addLabelText($section, $this->localizeHeading('phone'), $user->telephone);
                    $this->addLabelText($section, $this->localizeHeading('current_city'), $this->currentLocation($user));
                    $this->addLabelText($section, $this->localizeHeading('preferred_communication_language'), $this->localizeEnum($user->preferred_lang, Language::class));
                    $this->addLabelText($section, $this->localizeHeading('preferred_spoken_interview_language'), $this->localizeEnum($user->preferred_language_for_interview, Language::class));
                    $this->addLabelText($section, $this->localizeHeading('preferred_written_exam_language'), $this->localizeEnum($user->preferred_language_for_exam, Language::class));

                    $section->addTitle($this->localizeHeading('general_info'), 3);

                    $section->addTitle($this->localizeHeading('status'), 4);
                    $this->addLabelText($section, $this->localizeHeading('armed_forces_status'), $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class));
                    $this->addLabelText($section, $this->localizeHeading('citizenship'), $this->localizeEnum($user->citizenship, CitizenshipStatus::class));

                    $section->addTitle($this->localizeHeading('language_info'), 4);
                    $this->lookingForLanguages($section, $user);
                    $this->addLabelText($section, $this->localizeHeading('first_official_language'), $this->localizeEnum($user->first_official_language, Language::class));
                    $this->addLabelText($section, $this->localizeHeading('second_language_exam_completed'), $this->yesOrNo($user->second_language_exam_completed));
                    $this->addLabelText($section, $this->localizeHeading('second_language_exam_validity'), $this->yesOrNo($user->second_language_exam_validity));
                    $this->secondLanguageAbility($section, $user);

                    $section->addTitle($this->localizeHeading('government_info'), 4);
                    $this->addLabelText($section, $this->localizeHeading('government_employee'), $this->yesOrNo($user->is_gov_employee));
                    if ($user->is_gov_employee) {
                        $department = $user->department()->first();
                        $this->addLabelText($section, $this->localizeHeading('department'), $department->name[$this->lang] ?? '');
                        $this->addLabelText($section, $this->localizeHeading('employee_type'), $this->localizeEnum($user->gov_employee_type, GovEmployeeType::class));
                        $this->addLabelText($section, $this->localizeHeading('current_classification'), $user->getClassification());
                    }
                    $this->addLabelText($section, $this->localizeHeading('priority_entitlement'), $this->yesOrNo($user->has_priority_entitlement));
                    if ($user->has_priority_entitlement) {
                        $this->addLabelText($section, $this->localizeHeading('priority_number'), $user->priority_number);
                    }

                    $section->addTitle($this->localizeHeading('work_location'), 4);
                    $this->addLabelText($section, $this->localizeHeading('work_location'), $this->localizeEnumArray($user->location_preferences, WorkRegion::class));
                    $this->addLabelText($section, $this->localizeHeading('location_exemptions'), $user->location_exemptions ?? '');

                    $section->addTitle($this->localizeHeading('work_preferences'), 4);
                    $this->addLabelText($section, $this->localizeHeading('accept_temporary'), $this->yesOrNo($user->wouldAcceptTemporary()));

                    $preferences = $user->getOperationalRequirements();
                    if (count($preferences['accepted']) > 0) {
                        $section->addText($this->localizeHeading('accepted_operational_requirements'), $this->strong);

                        foreach ($preferences['accepted'] as $preference) {
                            $section->addListItem($this->localizeEnum($preference, OperationalRequirement::class));
                        }
                    }

                    if (count($preferences['not_accepted']) > 0) {
                        $section->addText($this->localizeHeading('rejected_operational_requirements'), $this->strong);

                        foreach ($preferences['not_accepted'] as $preference) {
                            $section->addListItem($this->localizeEnum($preference, OperationalRequirement::class));
                        }
                    }

                    $section->addTitle($this->localizeHeading('dei'), 4);

                    if ($user->indigenous_communities) {
                        foreach ($user->indigenous_communities as $community) {
                            $section->addListItem($this->localizeEnum($community, IndigenousCommunity::class));
                        }
                    }
                    if ($user->is_woman) {
                        $section->addListItem($this->localizeHeading('woman'));
                    }
                    if ($user->is_visible_minority) {
                        $section->addListItem($this->localizeHeading('visible_minority'));
                    }
                    if ($user->has_disability) {
                        $section->addListItem($this->localizeHeading('disability'));
                    }

                    if ($user->experiences->count() > 0) {
                        $section->addTitle($this->localizeHeading('career_timeline'), 2);
                        $experiences = [];

                        $user->experiences->each(function ($experience) use (&$experiences) {
                            $type = $experience::class;
                            if (! isset($experiences[$type])) {
                                $experiences[$type] = collect();
                            }
                            $experiences[$type]->push($experience);
                        });

                        foreach ($experiences as $type => $group) {

                            $typeKey = match ($type) {
                                AwardExperience::class => 'award',
                                CommunityExperience::class => 'community',
                                EducationExperience::class => 'education',
                                PersonalExperience::class => 'personal',
                                WorkExperience::class => 'work',
                                default => 'work'
                            };

                            $section->addTitle($this->localize('experiences.'.$typeKey), 3);

                            $group->each(function ($experience) use ($section, $type) {
                                if ($type === AwardExperience::class) {
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange($this->lang));
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, $this->localize('experiences.awarded_to'), $this->localizeEnum($experience->awarded_to, AwardedTo::class));
                                    $this->addLabelText($section, $this->localize('experiences.issuing_organization'), $experience->issued_by);
                                    $this->addLabelText($section, $this->localize('experiences.awarded_scope'), $this->localizeEnum($experience->awarded_scope, AwardedScope::class));
                                }

                                if ($type === CommunityExperience::class) {
                                    $section->addTitle($experience->getTitle($this->lang), 4);
                                    $section->addText($experience->getDateRange($this->lang));
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, $this->localize('experiences.project'), $experience->project);
                                }

                                if ($type === EducationExperience::class) {
                                    $section->addTitle($experience->getTitle($this->lang), 4);
                                    $section->addText($experience->getDateRange($this->lang));
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, $this->localize('experiences.area_of_study'), $experience->area_of_study);
                                    $this->addLabelText($section, $this->localize('common.status'), $this->localizeEnum($experience->status, EducationStatus::class));
                                    $this->addLabelText($section, $this->localize('experiences.thesis_title'), $experience->thesis_title);
                                }

                                if ($type === PersonalExperience::class) {
                                    $section->addTitle($experience->getTitle(), 4);
                                    $section->addText($experience->getDateRange($this->lang));
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, $this->localize('experiences.learning_description'), $experience->description);
                                }

                                if ($type === WorkExperience::class) {
                                    $section->addTitle($experience->getTitle($this->lang), 4);
                                    $section->addText($experience->getDateRange($this->lang));
                                    $section->addTextBreak(1);
                                    $this->addLabelText($section, $this->localize('experiences.team_group_division'), $experience->division);
                                }

                                $section->addTextBreak(1);
                                $this->addLabelText($section, $this->localize('experiences.additional_details'), $experience->details);

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

                    $section->addTitle($this->localizeHeading('skills_showcase'), 2);
                    if ($user->topBehaviouralSkillsRanking->count() > 0 || $user->topTechnicalSkillsRanking->count() > 0) {

                        $section->addTitle($this->localizeHeading('top_skills'), 3);

                        $this->skillRanks($section, $user->topBehaviouralSkillsRanking, $this->localize('skill_category.behavioural'));
                        $this->skillRanks($section, $user->topTechnicalSkillsRanking, $this->localize('skill_category.technical'));
                    }

                    if ($user->improveBehaviouralSkillsRanking->count() > 0 || $user->improveTechnicalSkillsRanking->count() > 0) {
                        $section->addTitle($this->localizeHeading('skills_to_improve'), 3);

                        $this->skillRanks($section, $user->improveBehaviouralSkillsRanking, $this->localize('skill_category.behavioural'));
                        $this->skillRanks($section, $user->improveTechnicalSkillsRanking, $this->localize('skill_category.technical'));
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
                    $listRun->addText($this->colon().$this->localizeEnum($userSkill->skill_level, SkillLevel::class));
                }
            });
        }
    }

    private function currentLocation($user)
    {

        $province = $this->localizeEnum($user->current_province, ProvinceOrTerritory::class);

        if ($user->current_city && $province) {
            return $user->current_city.', '.$province;
        } elseif ($user->current_city) {
            return $user->current_city;
        } elseif ($province) {
            return $province;
        }

        return '';

    }

    private function lookingForLanguages($section, $user)
    {
        if ($user->looking_for_english || $user->looking_for_french || $user->looking_for_bilingual) {
            $section->addText($this->localizeHeading('interested_in_languages'), $this->strong);

            if ($user->looking_for_english) {
                $section->addListItem($this->localize('language.en'));
            }

            if ($user->looking_for_french) {
                $section->addListItem($this->localize('language.fr'));
            }

            if ($user->looking_for_bilingual) {
                $section->addListItem($this->localize('common.billingual'));
            }
        }
    }

    private function secondLanguageAbility($section, $user)
    {
        $heading = $this->localizeHeading('estimated_language_ability', $this->strong);

        if ($user->second_language_exam_completed && ($user->comprehension_level || $user->written_level || $user->verbal_level)) {
            $section->addText($heading);

            $listRun = $section->addListItemRun();
            $listRun->addText($this->localizeHeading('comprehension_level'), $this->strong);
            if ($user->comprehension_level) {
                $listRun->addText($this->colon().$user->comprehension_level);
            }

            $listRun = $section->addListItemRun();
            $listRun->addText($this->localizeHeading('writing_level'), $this->strong);
            if ($user->comprehension_level) {
                $listRun->addText($this->colon().$user->written_level);
            }

            $listRun = $section->addListItemRun();
            $listRun->addText($this->localizeHeading('oral_interaction_level'), $this->strong);
            if ($user->comprehension_level) {
                $listRun->addText($this->colon().$user->written_level);
            }

        } elseif ($user->estimated_language_ability) {
            $section->addLabelText($section, $heading, $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class));
        }
    }
}
