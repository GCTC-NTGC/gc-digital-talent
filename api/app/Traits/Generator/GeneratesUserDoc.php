<?php

namespace App\Traits\Generator;

use App\Enums\ArmedForcesStatus;
use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Enums\CafEmploymentType;
use App\Enums\CafForce;
use App\Enums\CafRank;
use App\Enums\CitizenshipStatus;
use App\Enums\CSuiteRoleTitle;
use App\Enums\EducationStatus;
use App\Enums\EmploymentCategory;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\ExecCoaching;
use App\Enums\ExternalRoleSeniority;
use App\Enums\ExternalSizeOfOrganization;
use App\Enums\GovContractorRoleSeniority;
use App\Enums\GovContractorType;
use App\Enums\GovEmployeeType;
use App\Enums\GovPositionType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\Mentorship;
use App\Enums\OperationalRequirement;
use App\Enums\OrganizationTypeInterest;
use App\Enums\PositionDuration;
use App\Enums\ProvinceOrTerritory;
use App\Enums\SkillLevel;
use App\Enums\TargetRole;
use App\Enums\TimeFrame;
use App\Enums\WorkExperienceGovEmployeeType;
use App\Enums\WorkRegion;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\EmployeeProfile;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Number;
use PhpOffice\PhpWord\Element\Section;

trait GeneratesUserDoc
{
    protected bool $anonymous;

    use GeneratesDoc;

    /**
     * Generate the users name
     */
    protected function name(Section $section, User $user, $headingRank = 2)
    {
        $section->addTitle($user->getFullName($this->anonymous), $headingRank);
    }

    /**
     * Generate Contact info section
     * for a user
     *
     * @param  Section  $section  The section to add contact info to
     * @param  User  $user  The user and their contact info
     */
    protected function contactInfo(Section $section, User $user, $headingRank = 3)
    {

        if ($this->anonymous) {
            return;
        }

        $section->addTitle($this->localizeHeading('contact_info'), $headingRank);
        $this->addLabelText($section, $this->localizeHeading('email'), $user->email);
        $this->addLabelText($section, $this->localizeHeading('phone'), $user->telephone);
        $this->addLabelText($section, $this->localizeHeading('preferred_communication_language'), $this->localizeEnum($user->preferred_lang, Language::class));
        $this->addLabelText($section, $this->localizeHeading('preferred_spoken_interview_language'), $this->localizeEnum($user->preferred_language_for_interview, Language::class));
        $this->addLabelText($section, $this->localizeHeading('preferred_written_exam_language'), $this->localizeEnum($user->preferred_language_for_exam, Language::class));
    }

    /**
     * Generate users current armed forces and
     * citizenship status
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function status(Section $section, User $user, $headingRank = 4)
    {
        $section->addTitle($this->localizeHeading('status'), $headingRank);
        $this->addLabelText($section, $this->localizeHeading('armed_forces_status'), $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class));
        $this->addLabelText($section, $this->localizeHeading('citizenship'), $this->localizeEnum($user->citizenship, CitizenshipStatus::class));
    }

    /**
     * Generate information about a users languages
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function languageInfo(Section $section, User $user, $headingRank = 4)
    {
        $section->addTitle($this->localizeHeading('language_info'), $headingRank);

        if ($user->looking_for_english || $user->looking_for_french || $user->looking_for_bilingual) {
            $section->addText($this->localizeHeading('interested_in_languages'), $this->strong);

            if ($user->looking_for_english) {
                $section->addListItem($this->localize('language.en').'-'.$this->localize('only positions'));

            }

            if ($user->looking_for_french) {
                $section->addListItem($this->localize('language.fr').'-'.$this->localize('only positions'));
            }

            if ($user->looking_for_bilingual) {
                $section->addListItem($this->localize('common.bilingual').' '.$this->localize('positions'));
            }
        }

        $this->addLabelText($section, $this->localizeHeading('first_official_language'), $this->localizeEnum($user->first_official_language, Language::class));
        $this->addLabelText($section, $this->localizeHeading('second_language_exam_completed'), $this->yesOrNo($user->second_language_exam_completed));
        $this->addLabelText($section, $this->localizeHeading('second_language_exam_validity'), $this->yesOrNo($user->second_language_exam_validity));

        $heading = $this->localizeHeading('estimated_language_ability');

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
            $this->addLabelText($section, $heading, $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class));
        }
    }

    /**
     * Generate information about a users government employee information
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function governmentInfo(Section $section, User $user, $headingRank = 4)
    {
        $section->addTitle($this->localizeHeading('government_info'), $headingRank);

        $this->addLabelText($section, $this->localizeHeading('government_employee'), $this->yesOrNo($user->computed_is_gov_employee));

        if ($user->computed_is_gov_employee) {
            $department = $user->department()->first();
            $this->addLabelText($section, $this->localizeHeading('department'), $department->name[$this->lang] ?? '');
            $this->addLabelText($section, $this->localizeHeading('employee_type'), $this->localizeEnum($user->computed_gov_employee_type, GovEmployeeType::class));
            $this->addLabelText($section, $this->localizeHeading('work_email'), $user->work_email);
            $this->addLabelText($section, $this->localizeHeading('classification'), $user->getClassification());
        }

        $this->addLabelText($section, $this->localizeHeading('priority_entitlement'), $this->yesOrNo($user->has_priority_entitlement));

        if ($user->has_priority_entitlement) {
            $this->addLabelText($section, $this->localizeHeading('priority_number'), $user->priority_number);
        }
    }

    /**
     * Generate information about a users work preferences
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function workPreferences(Section $section, User $user, $headingRank = 4)
    {
        $section->addTitle($this->localizeHeading('work_preferences'), $headingRank);

        $section->addText($this->localizeHeading('contract_duration'), $this->strong);
        foreach ($user->position_duration ?? [] as $duration) {
            $section->addListItem($this->localizeEnum($duration, PositionDuration::class));
        }

        $preferences = $user->getOperationalRequirements();
        if (count($preferences['accepted']) > 0) {
            $section->addText($this->localizeHeading('accepted_operational_requirements'), $this->strong);

            foreach ($preferences['accepted'] as $preference) {
                $section->addListItem($this->localizeEnum($preference, OperationalRequirement::class, 'long'));
            }
        }

        $section->addText($this->localizeHeading('current_location'), $this->strong);
        $this->addLabelText($section, $this->localizeHeading('current_city'), $this->currentLocation($user));

        $section->addText($this->localizeHeading('location_preferences'), $this->strong);
        $this->addLabelText($section, $this->localizeHeading('work_location'), $this->localizeEnumArray($user->location_preferences, WorkRegion::class));
        $this->addLabelText($section, $this->localizeHeading('location_exemptions'), $user->location_exemptions ?? '');
    }

    /**
     * Generate Diversity, equity and inclusion info for a user
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function dei(Section $section, User $user, $headingRank = 4)
    {
        $section->addTitle($this->localizeHeading('dei'), $headingRank);

        if ($user->indigenous_communities) {
            foreach ($user->indigenous_communities as $community) {
                if ($community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name) {
                    $section->addListItem($this->localizeEnum($community, IndigenousCommunity::class));
                }
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
    }

    /**
     * Generate a users experiences
     *
     * @param  Section  $section  The section to add info to
     * @param  Collection  $experienceCollection  The experiences to be rendered
     * @param  bool  $withSkills  If it should include the skills associated with experiences
     * @param  int  $headingRank  The rank of headings
     */
    protected function experiences(Section $section, Collection $experienceCollection, bool $withSkills = true, int $headingRank = 3)
    {

        if ($experienceCollection->count() > 0) {
            $section->addTitle($this->localizeHeading('career_timeline'), $headingRank);
            $experiences = [];

            $experienceCollection->each(function ($experience) use (&$experiences) {
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

                $section->addTitle($this->localize('experiences.'.$typeKey), $headingRank + 1);

                $subHeadingRank = $headingRank + 2;

                $group->each(function ($experience) use ($section, $type, $withSkills, $subHeadingRank) {
                    $this->experience($section, $experience, $type, $withSkills, $subHeadingRank);
                });
            }
        }
    }

    /**
     * Generate a single experience
     *
     * @param  Section  $section  The section to add info to
     * @param  AwardExperience|CommunityExperience|EducationExperience|PersonalExperience|WorkExperience  $experience  The experience being generated
     * @param  string  $type  The type of experience being generated
     */
    public function experience(Section $section, AwardExperience|CommunityExperience|EducationExperience|PersonalExperience|WorkExperience $experience, string $type, bool $withSkills = true, $headingRank = 4)
    {

        if ($type === AwardExperience::class) {
            /** @var AwardExperience $experience */
            $section->addTitle($experience->getTitle(), $headingRank);
            $section->addText($experience->getDateRange($this->lang));
            $this->addLabelText($section, $this->localize('experiences.awarded_to'), $this->localizeEnum($experience->awarded_to, AwardedTo::class));
            $this->addLabelText($section, $this->localize('experiences.issuing_organization'), $experience->issued_by);
            $this->addLabelText($section, $this->localize('experiences.awarded_scope'), $this->localizeEnum($experience->awarded_scope, AwardedScope::class));
        }

        if ($type === CommunityExperience::class) {
            /** @var CommunityExperience $experience */
            $section->addTitle($experience->getTitle($this->lang), $headingRank);
            $section->addText($experience->getDateRange($this->lang));
            $this->addLabelText($section, 'Project or /product', $experience->project);
        }

        if ($type === EducationExperience::class) {
            /** @var EducationExperience $experience */
            $degreeType = match ($experience->type) {
                'MASTERS_DEGREE' => "Master's degree",
                'BACHELORS_DEGREE' => "Bachelor's degree",
                'PHD' => 'PhD',
                'DOCTORATE' => 'Doctorate',
                'ASSOCIATES_DEGREE' => "Associate's degree",
                default => ucwords(strtolower(str_replace('_', ' ', $experience->type))),
            };

            $title = $degreeType
                ? $degreeType.' in '.$experience->area_of_study.' '.Lang::get('common.at', [], $this->lang).' '.$experience->institution
                : $experience->area_of_study.' '.Lang::get('common.at', [], $this->lang).' '.$experience->institution;
            $section->addTitle($title, $headingRank);
            $section->addText($experience->getDateRange($this->lang));
            $this->addLabelText($section, $this->localize('experiences.area_of_study'), $experience->area_of_study);
            $this->addLabelText($section, $this->localize('common.status'), $this->localizeEnum($experience->status, EducationStatus::class));
            $this->addLabelText($section, $this->localize('experiences.thesis_title'), $experience->thesis_title);
            $this->addLabelText($section, $this->localize('experiences.additional_details'), $experience->details);
        }

        if ($type === PersonalExperience::class) {
            /** @var PersonalExperience $experience */
            $section->addTitle($experience->getTitle(), $headingRank);
            $section->addText($experience->getDateRange($this->lang));
            $this->addLabelText($section, $this->localize('experiences.learning_description'), $experience->description);
        }

        if ($type === WorkExperience::class) {
            /** @var WorkExperience $experience */
            if ($experience->employment_category === EmploymentCategory::EXTERNAL_ORGANIZATION->name) {
                $section->addTitle($experience->getTitle($this->lang), $headingRank);
                $section->addText($experience->getDateRangeWithFutureEndDateCheck($this->lang));
                $this->addLabelText($section, $this->localize('experiences.team_group_division'), $experience->division);
                $this->addLabelText(
                    $section, $this->localize('experiences.size_organization'),
                    $this->localizeEnum($experience->ext_size_of_organization,
                        ExternalSizeOfOrganization::class)
                );
                $this->addLabelText(
                    $section,
                    $this->localize('experiences.seniority_role'),
                    $this->localizeEnum($experience->ext_role_seniority, ExternalRoleSeniority::class)
                );
            } elseif ($experience->employment_category === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
                $section->addTitle(
                    sprintf(
                        '%s %s %s',
                        $experience->role,
                        Lang::get('common.with', [], $this->lang),
                        $this->localizeEnum($experience->caf_force,
                            CafForce::class),
                    ),
                    $headingRank
                );
                $section->addText($this->localize('experiences.canadian_armed_forces'));
                $section->addText($experience->getDateRangeWithFutureEndDateCheck($this->lang));
                $this->addLabelText(
                    $section, $this->localize('experiences.employment_type'),
                    $this->localizeEnum($experience->caf_employment_type,
                        CafEmploymentType::class)
                );
                $this->addLabelText(
                    $section,
                    $this->localize('experiences.rank_category'),
                    $this->localizeEnum($experience->caf_rank, CafRank::class)
                );
            } elseif ($experience->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name) {
                /** @var Department | null $department */
                $department = $experience->department_id ? Department::find($experience->department_id) : null;
                $section->addTitle(
                    sprintf(
                        '%s %s %s',
                        $experience->role,
                        Lang::get('common.with', [], $this->lang),
                        $department ? $department->name[$this->lang] : Lang::get('common.not_found', [], $this->lang),
                    ),
                    $headingRank
                );
                $section->addText(
                    $experience->gov_employment_type === WorkExperienceGovEmployeeType::CONTRACTOR->name ?
                    $this->localize('experiences.contractor')
                    : $this->localize('experiences.government_of_canada')
                );
                $section->addText($experience->getDateRangeWithFutureEndDateCheck($this->lang));
                $this->addLabelText($section, $this->localize('experiences.team_group_division'), $experience->division);
                $this->addLabelText(
                    $section,
                    $this->localize('experiences.employment_type'),
                    $this->localizeEnum($experience->gov_employment_type, WorkExperienceGovEmployeeType::class)
                );
                if ($experience->gov_employment_type === WorkExperienceGovEmployeeType::INDETERMINATE->name) {
                    $this->addLabelText(
                        $section,
                        $this->localize('experiences.position_type'),
                        $this->localizeEnum($experience->gov_position_type, GovPositionType::class)
                    );
                }
                if ($experience->gov_employment_type === WorkExperienceGovEmployeeType::CONTRACTOR->name) {
                    $this->addLabelText(
                        $section,
                        $this->localize('experiences.seniority_role'),
                        $this->localizeEnum($experience->gov_contractor_role_seniority, GovContractorRoleSeniority::class)
                    );
                    $this->addLabelText(
                        $section,
                        $this->localize('experiences.contractor_type'),
                        $this->localizeEnum($experience->gov_contractor_type, GovContractorType::class)
                    );
                    if ($experience->gov_contractor_type === GovContractorType::FIRM_OR_AGENCY->name) {
                        $this->addLabelText(
                            $section,
                            $this->localize('experiences.contract_firm_agency'),
                            $experience->contractor_firm_agency_name
                        );
                    }
                }
                if (
                    $experience->gov_employment_type !== WorkExperienceGovEmployeeType::CONTRACTOR->name &&
                    $experience->gov_employment_type !== WorkExperienceGovEmployeeType::STUDENT->name
                ) {
                    /** @var Classification | null $classification */
                    $classification = Classification::find($experience->classification_id);
                    $this->addLabelText(
                        $section,
                        $this->localize('experiences.classification'),
                        $classification ? $classification->group.'-'.$classification->level : Lang::get('common.not_found', [], $this->lang),
                    );
                }
                $this->addLabelText($section, $this->localize('experiences.additional_details'), $experience->details);
                $this->addLabelText($section, $this->localize('experiences.supervisory_position'), $this->yesOrNo($experience->supervisory_position));
                if ($experience->supervisory_position === true) {
                    $this->addLabelText($section, $this->localize('experiences.supervised_employees'), $this->yesOrNo($experience->supervised_employees));
                    if ($experience->supervised_employees === true) {
                        $this->addLabelText(
                            $section,
                            $this->localize('experiences.supervised_employees_number'),
                            Number::format($experience->supervised_employees_number, precision: 0, locale: App::getLocale()),
                        );
                    }
                    $this->addLabelText($section, $this->localize('experiences.budget_management'), $this->yesOrNo($experience->budget_management));

                    if ($experience->budget_management === true) {
                        $this->addLabelText(
                            $section,
                            $this->localize('experiences.annual_budget_allocation'),
                            Number::format($experience->annual_budget_allocation, precision: 0, locale: App::getLocale()),
                        );
                    }
                    $this->addLabelText($section, $this->localize('experiences.senior_management_status'), $experience->senior_management_status ? Lang::get('experiences.senior_management_true') : Lang::get('experiences.senior_management_false'));
                    if ($experience->senior_management_status === true) {
                        $this->addLabelText($section, $this->localize('experiences.c_suite_role_title'), $this->localizeEnum($experience->c_suite_role_title, CSuiteRoleTitle::class));
                    }
                    if ($experience->c_suite_role_title === CSuiteRoleTitle::OTHER->name) {
                        $this->addLabelText($section, $this->localize('experiences.other_c_suite_role_title'), $experience->other_c_suite_role_title);
                    }
                }
            } else {
                // null case, so experiences prior to adding employment_category
                $section->addTitle($experience->getTitle($this->lang), $headingRank);
                $section->addText($experience->getDateRange($this->lang));
                $this->addLabelText($section, $this->localize('experiences.team_group_division'), $experience->division);
            }
        }

        if ($type === WorkExperience::class) {
            /** @var WorkExperience $experience */
            if ($experience->employment_category === EmploymentCategory::GOVERNMENT_OF_CANADA->name || $experience->employment_category === EmploymentCategory::CANADIAN_ARMED_FORCES->name) {
                $experience->loadMissing(['workStreams']);
                if ($experience->workStreams && count($experience->workStreams) > 0) {
                    $workStreamsByCommunity = [];
                    foreach ($experience->workStreams as $workStream) {
                        if (isset($workStreamsByCommunity[$workStream->community_id])) {
                            $workStreamsByCommunity[$workStream->community_id]['workStreams'][] = $workStream->name[$this->lang];
                        } else {
                            $community = Community::find($workStream->community_id);
                            $workStreamsByCommunity[$workStream->community_id] = [
                                'community' => $community->name[$this->lang],
                                'workStreams' => [$workStream->name[$this->lang]],
                            ];
                        }
                    }
                    $section->addText($this->localize('common.work_streams'));
                    collect(Arr::sortRecursive($workStreamsByCommunity))->each(function ($community) use ($section) {
                        $section->addListItem($community['community'], 0);
                        foreach ($community['workStreams'] as $workStream) {
                            $section->addListItem($workStream, 1);
                        }
                    });
                }
            }
        }

        if ($type === WorkExperience::class && $withSkills) {
            $experience->load(['userSkills' => ['skill']]);

            if ($experience->userSkills->count() > 0) {
                $section->addText('Featured skills:');
            }

            $experience->userSkills->each(function ($userSkill) use ($section) {
                $skillRun = $section->addListItemRun();
                /** @var UserSkill $userSkill */
                $skillRun->addText($userSkill->skill->name[$this->lang], $this->strong);
                if (isset($userSkill->experience_skill->details)) {
                    $skillRun->addText($this->colon().$userSkill->experience_skill->details);
                }
            });
        }
    }

    /**
     * Generate a user's skill showcase
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function skillShowcase(Section $section, User $user, $headingRank = 3)
    {
        $section->addTitle($this->localizeHeading('skill_showcase'), $headingRank);
        $subHeadingRank = $headingRank + 2;
        $section->addText('The skill showcase allows a candidate to provide a curated series of lists that highlight their specific strengths, weaknesses, and skill growth opportunities. These lists can provide you with insight into a candidate\'s broader skillset and where they might be interested in learning new skills.');

        if ($user->topBehaviouralSkillsRanking->count() > 0 || $user->topTechnicalSkillsRanking->count() > 0) {
            $section->addTitle($this->localizeHeading('top_skills'), $headingRank + 1);
            $this->skillRanks($section, $user->topBehaviouralSkillsRanking, $this->localize('skill_category.behavioural'), $subHeadingRank);
            $this->skillRanks($section, $user->topTechnicalSkillsRanking, $this->localize('skill_category.technical'), $subHeadingRank);
        }

        if ($user->improveBehaviouralSkillsRanking->count() > 0 || $user->improveTechnicalSkillsRanking->count() > 0) {
            $section->addTitle($this->localizeHeading('skills_to_improve'), $headingRank + 1);
            $this->skillRanks($section, $user->improveBehaviouralSkillsRanking, $this->localize('skill_category.behavioural'), $subHeadingRank);
            $this->skillRanks($section, $user->improveTechnicalSkillsRanking, $this->localize('skill_category.technical'), $subHeadingRank);
        }
    }

    /**
     * Generate all sections for a user
     */
    protected function generateUser(Section $section, User $user, $headingRank = 2)
    {
        $user->loadMissing([
            'department',
            'currentClassification',
            'awardExperiences',
            'communityExperiences',
            'educationExperiences',
            'personalExperiences',
            'workExperiences',
            'userSkills',
            'employeeProfile',
        ]);

        $this->name($section, $user, $headingRank);
        $this->contactInfo($section, $user, $headingRank + 1);

        $section->addTitle($this->localizeHeading('general_info'), $headingRank + 1);

        $this->status($section, $user, $headingRank + 2);
        $this->languageInfo($section, $user, $headingRank + 2);
        $this->governmentInfo($section, $user, $headingRank + 2);
        $this->workPreferences($section, $user, $headingRank + 2);
        $this->dei($section, $user, $headingRank + 2);

        $this->experiences($section, $user->experiences, true, $headingRank + 1);
        $this->skillShowcase($section, $user, $headingRank + 1);
        $this->gcEmployeeProfile($section, $user, $headingRank + 1);
        $section->addPageBreak();
    }

    /**
     * Get the users full current location
     *
     * @return string
     */
    private function currentLocation(User $user)
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

    /**
     * Add skill rank list
     *
     * @param  Section  $section  Document section to add skill ranks to
     * @param  Collection  $skills  Skills to list out with ranks
     * @param  string  $title  The title for the list
     */
    private function skillRanks(Section $section, Collection $skills, string $title, $headingRank = 4)
    {
        if ($skills->count() > 0) {
            $section->addTitle($title, $headingRank);
            $skills->each(function ($userSkill) use ($section) {
                $listRun = $section->addListItemRun();
                $listRun->addText($userSkill->skill->name[$this->lang], $this->strong);
                if ($userSkill->skill_level) {
                    $listRun->addText($this->colon().$this->localizeEnum($userSkill->skill_level, SkillLevel::class));
                }
            });
        }
    }

    /**
     * Generate a users gc employee
     *
     * @param  Section  $section  The section to add info to
     * @param  User  $user  The user being generated
     */
    protected function gcEmployeeProfile(Section $section, User $user, $headingRank = 3)
    {
        // Only show if user has a verified work email
        if (! $user->work_email) {
            return;
        }

        $user->load([
            'employeeProfile',
            'employeeProfile.nextRoleCommunity',
            'employeeProfile.careerObjectiveCommunity',
            'employeeProfile.nextRoleClassification',
            'employeeProfile.careerObjectiveClassification',
            'employeeProfile.nextRoleWorkStreams',
            'employeeProfile.careerObjectiveWorkStreams',
            'employeeProfile.nextRoleDepartments',
            'employeeProfile.careerObjectiveDepartments',
        ]);

        $profile = $user->employeeProfile;

        if (! $profile) {
            return;
        }

        $section->addTitle('GC employee profile', $headingRank);

        // Career Development Preferences
        $section->addTitle('Career development preferences', $headingRank + 1);

        // Lateral Movement
        $this->addLabelText($section, 'Interest in lateral movement',
            $this->yesOrNo($profile->career_planning_lateral_move_interest));

        if ($profile->career_planning_lateral_move_interest) {
            $this->addLabelText($section, 'Target time frame',
                $this->localizeEnum($profile->career_planning_lateral_move_time_frame, TimeFrame::class)
            );

            if (! empty($profile->career_planning_promotion_move_organization_type)) {
                $section->addText('Types of organizations for lateral movement:');

                foreach ($profile->career_planning_promotion_move_organization_type as $type) {
                    $section->addListItem(
                        $this->localizeEnum($type, OrganizationTypeInterest::class)
                    );
                }
            }
        }

        // Promotion/Advancement
        $this->addLabelText($section, 'Interest in promotion and advancement',
            $this->yesOrNo($profile->career_planning_promotion_move_interest));

        if ($profile->career_planning_promotion_move_interest) {
            $this->addLabelText($section, 'Target time frame for promotion or advancement',
                $this->localizeEnum($profile->career_planning_promotion_move_time_frame, TimeFrame::class));

            if (! empty($profile->career_planning_promotion_move_organization_type)) {
                $section->addLabelText('Types of organizations promotion or advancement');
                foreach ($profile->career_planning_promotion_move_organization_type as $type) {
                    $section->addListItem($this->localizeEnum($type, OrganizationTypeInterest::class));
                }
            }
        }

        // Learning Opportunities
        $this->addLabelText($section, 'Interest in learning opportunities',
            ! empty($profile->career_planning_learning_opportunities_interest) ?? '');

        // Retirement Eligibility
        if ($profile->eligible_retirement_year_known && $profile->eligible_retirement_year) {
            $this->addLabelText($section, 'Year of retirement eligibility',
                $profile->eligible_retirement_year->format('Y'));
        }

        // Mentorship
        $this->addLabelText($section, 'Mentorship status',
            implode(', ', $profile->career_planning_mentorship_status ?? []));

        if (! empty($profile->career_planning_mentorship_interest)) {
            $section->addLabelText('Interest in mentorship opportunities');
            foreach ($profile->career_planning_mentorship_interest as $interest) {
                $section->addListItem($this->localizeEnum($interest, Mentorship::class));
            }
        }

        // Executive Opportunities
        $this->addLabelText($section, 'Interest in executive-level opportunities',
            $this->yesOrNo($profile->career_planning_exec_interest));

        $this->addLabelText($section, 'Executive coaching status',
            implode(', ', array_map(
                fn ($status) => $this->localizeEnum($status, ExecCoaching::class),
                $profile->career_planning_exec_coaching_status ?? []
            ))
        );

        if (! empty($profile->career_planning_exec_coaching_interest)) {
            $section->addLabelText('Interest in executive coaching opportunities');
            foreach ($profile->career_planning_exec_coaching_interest as $interest) {
                $section->addListItem($this->localizeEnum($interest, ExecCoaching::class));
            }
        }

        // Next Role
        $this->nextRoleSection($section, $profile, $headingRank + 1);

        // Career Objective
        $this->careerObjectiveSection($section, $profile, $headingRank + 1);

        // Goals and Work Style
        $this->goalsAndWorkStyle($section, $profile, $headingRank + 1);
    }

    protected function nextRoleSection(Section $section, EmployeeProfile $profile, $headingRank = 4)
    {
        $section->addTitle('Next role', $headingRank);

        // Target Classification
        $this->addLabelText($section, 'Target classification group', $profile->nextRoleClassification?->group ?? '');
        $this->addLabelText($section, 'Target classification level', $profile->nextRoleClassification?->level ?? '');

        // Target Role Type
        $this->addLabelText($section, 'Target role',
            $this->localizeEnum($profile->next_role_target_role, TargetRole::class) ?:
        $profile->next_role_target_role_other);

        // Senior Management Status
        $this->addLabelText($section, 'Senior management status',
            $profile->next_role_is_c_suite_role ?? '');

        if ($profile->next_role_is_c_suite_role === true) {
            $this->addLabelText($section, 'C-suite role title', $profile->next_role_c_suite_role_title ?? '');
        }

        // Job Title
        $this->addLabelText($section, 'Job title', $profile->next_role_job_title ?? '');

        // Functional Community
        $communityName = $profile->nextRoleCommunity?->name[$this->lang] ??
            ($profile->next_role_community_other ?? '');
        $this->addLabelText($section, 'Desired functional community', $communityName);

        // Work Streams
        $this->addLabelText($section, 'Desired work streams', '');
        if ($profile->nextRoleWorkStreams->isNotEmpty()) {
            foreach ($profile->nextRoleWorkStreams as $stream) {
                $section->addListItem($stream->name[$this->lang] ?? '');
            }
        }

        // Preferred Departments
        $this->addLabelText($section, 'Preferred departments or agencies', '');
        if ($profile->nextRoleDepartments->isNotEmpty()) {
            foreach ($profile->nextRoleDepartments as $dept) {
                $section->addListItem($dept->name[$this->lang] ?? '');
            }
        }

        // Additional Info
        $this->addLabelText(
            $section,
            'Additional information',
            $profile->next_role_additional_information ?? ''
        );
    }

    protected function careerObjectiveSection(Section $section, EmployeeProfile $profile, $headingRank = 4)
    {
        $section->addTitle('Career objective', $headingRank);

        // Target Classification
        $this->addLabelText($section, 'Target classification group', $profile->careerObjectiveClassification?->group ?? '');
        $this->addLabelText($section, 'Target classification level', $profile->careerObjectiveClassification?->level ?? '');

        // Target Role Type
        $this->addLabelText($section, 'Target role',
            $this->localizeEnum($profile->career_objective_target_role, TargetRole::class) ?:
        $profile->career_objective_target_role_other);

        // Senior Management Status
        $this->addLabelText($section, 'Senior management status',
            $profile->career_objective_is_c_suite_role ?? '');

        if ($profile->career_objective_is_c_suite_role === true) {
            $this->addLabelText($section, 'C-suite role title', $this->localizeEnum($profile->career_objective_c_suite_role_title, CSuiteRoleTitle::class) ?? '');
        }

        // Job Title
        $this->addLabelText($section, 'Job title', $profile->career_objective_job_title ?? '');

        // Functional Community
        $communityName = $profile->careerObjectiveCommunity?->name[$this->lang] ?? $profile->career_objective_community_other ?? '';
        $this->addLabelText($section, 'Desired functional community', $communityName);

        // Work Streams
        $this->addLabelText($section, 'Desired work streams', '');
        if ($profile->careerObjectiveWorkStreams->isNotEmpty()) {
            foreach ($profile->careerObjectiveWorkStreams as $stream) {
                $section->addListItem($stream->name[$this->lang] ?? '');
            }
        }

        // Preferred Departments or agencies
        $this->addLabelText($section, 'Preferred departments or agencies', '');
        if ($profile->careerObjectiveDepartments->isNotEmpty()) {
            foreach ($profile->careerObjectiveDepartments as $dept) {
                $section->addListItem($dept->name[$this->lang] ?? '');
            }
        }

        // Additional Info
        $this->addLabelText($section, 'Additional information',
            $profile->career_objective_additional_information ?? ''
        );
    }

    protected function goalsAndWorkStyle(Section $section, EmployeeProfile $profile, $headingRank = 4)
    {
        $section->addTitle('Goals and work style', $headingRank);

        $this->addLabelText($section, 'About', $profile->career_planning_about_you ?? '');
        $this->addLabelText($section, 'Learning goals', $profile->career_planning_learning_goals ?? '');
        $this->addLabelText($section, 'How I work best', $profile->career_planning_work_style ?? '');
    }
}
