<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use App\Models\User;
use Exception;

class CandidateProfileDoc extends DocGenerator
{

    protected array $ids;
    protected string $lang = "en";
    protected bool $anonymous;

    public function __construct(array $ids, ?string $lang = "en", ?bool $anonymous = false)
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
                'currentClassification'
            ]
        ])
            ->whereIn('id', $this->ids)
            ->get();

        if(empty($candidates)){
            throw new Exception("No candidates found.");
        }

        $this->doc->addTitle("Applicant snapshot");

        $candidates->each(function ($candidate) {
            $section = $this->doc->addSection();

            $section->addTitle($candidate->user->getFullName($this->anonymous), 1);

            $section->addTitle('General information', 2);

            $this->addSubTitle($section, 'Contact Information');
            $this->addLabelText($section, 'Email', $candidate->user->email);
            $this->addLabelText($section, 'Phone', $candidate->user->telephone);
            $this->addLabelText($section, 'City', $candidate->user->getLocation());
            $this->addLabelText($section, 'Communication language', $candidate->user->getLanguage("preferred_lang"));
            $this->addLabelText($section, 'Spoken interview language', $candidate->user->getLanguage("preferred_language_for_interview"));
            $this->addLabelText($section, 'Written exam language', $candidate->user->getLanguage("preferred_language_for_exam"));
            $this->addLabelText($section, 'Member of CAF', $candidate->user->getArmedForcesStatus());
            $this->addLabelText($section, 'Citizenship', $candidate->user->getCitizenship());

            $this->addSubTitle($section, 'Language information');
            $this->addLabelText($section, 'Interested in', $candidate->user->getLookingForLanguage());
            $this->addLabelText($section, 'Completed an official GoC evaluation', $candidate->user->getBilingualEvaluation());
            $this->addLabelText($section, 'Second language level (Comprehension, Written, Verbal)', $candidate->user->getSecondLanguageEvaluation());

            $this->addSubTitle($section, 'Government information');
            $this->addLabelText($section, 'Government of Canada employee', $candidate->user->is_gov_employee ? "Yes" : "No");
            if($candidate->user->is_gov_employee) {
                $department = $candidate->user->department()->first();
                $this->addLabelText($section, 'Department', $department->name[$this->lang] ?? "");
                $this->addLabelText($section, 'Employee type', $candidate->user->getGovEmployeeType());
                $this->addLabelText($section, 'Classification', $candidate->user->getClassification());
            }
            $this->addLabelText($section, 'Priority entitlement', $candidate->user->has_priority_entitlement ? "Yes" : "No");

            $this->addSubTitle($section, 'Work location');
            $this->addLabelText($section, 'Work location',
                $candidate->user->location_preferences ? implode(', ', $candidate->user->location_preferences) : "");
            $this->addLabelText($section, 'Location exemptions', $candidate->user->location_exemptions);

            $this->addSubTitle($section, 'Diversity, equity, inclusion');

            $indigenousCommunities = $candidate->user->getIndigenousCommunities();
            if($indigenousCommunities) {
                foreach($indigenousCommunities as $community) {
                    $section->addListItem($community);
                }
            }
            if($candidate->user->is_woman) {
                $section->addListItem("Woman");
            }
            if($candidate->user->is_visible_minority) {
                $section->addListItem("Visible minority");
            }
            if($candidate->user->has_disability) {
                $section->addListItem("Person with a disability");
            }

            $section->addPageBreak();
        });
    }
}
