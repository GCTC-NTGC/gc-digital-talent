<?php

namespace App\Traits\Generator;

use App\Enums\Language;
use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\Classification;
use App\Models\Department;
use App\Models\TalentNominationGroup;
use App\Models\User;
use Illuminate\Support\Facades\Lang;
use PhpOffice\PhpWord\Element\Section;

trait GeneratesNominationDoc
{
    protected bool $anonymous;

    use GeneratesDoc;

    /**
     * Generates general info section for a talent nomination group
     *
     * @param  Section  $section  The section to add general info to
     * @param  TalentNominationGroup  $talentNominationGroup  The talent nomination group
     */
    protected function generalInfo(Section $section, TalentNominationGroup $talentNominationGroup)
    {
        $this->addLabelText($section, $this->localizeHeading('talent_management_event'), $talentNominationGroup->talentNominationEvent->name[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('nominations_opening_date'), $talentNominationGroup->talentNominationEvent->open_date->format('F d, Y'));
        $this->addLabelText($section, $this->localizeHeading('nominations_closing_date'), $talentNominationGroup->talentNominationEvent->close_date->format('F d, Y'));
        $this->addLabelText($section, $this->localizeHeading('functional_community'), $talentNominationGroup->talentNominationEvent->community->name[$this->lang]);
    }

    /**
     * Generates general info section for a talent nomination group
     *
     * @param  Section  $section  The section to add nominee info to
     * @param  TalentNominationGroup  $talentNominationGroup  The talent nomination group
     */
    protected function nominee(Section $section, TalentNominationGroup $talentNominationGroup, $headingRank)
    {

        $nominatedFor = [];
        if ($talentNominationGroup->advancement_nomination_count > 0) {
            array_push($nominatedFor, "{$this->localizeHeading('advancement')} ({$talentNominationGroup->advancement_nomination_count})");
        }
        if ($talentNominationGroup->lateral_movement_nomination_count > 0) {
            array_push($nominatedFor, "{$this->localizeHeading('lateral_movement')} ({$talentNominationGroup->lateral_movement_nomination_count})");
        }
        if ($talentNominationGroup->development_programs_nomination_count > 0) {
            array_push($nominatedFor, "{$this->localizeHeading('development_programs')} ({$talentNominationGroup->development_programs_nomination_count})");
        }

        $section->addTitle($this->localizeHeading('nominee'), $headingRank);
        $this->addLabelText($section, $this->localizeHeading('functional_community'), "{$talentNominationGroup->nominee->first_name} {$talentNominationGroup->nominee->last_name}");
        $this->addLabelText($section, $this->localizeHeading('work_email'), $talentNominationGroup->nominee->work_email);
        $this->addLabelText($section, $this->localizeHeading('communication_language'), $this->localizeEnum($talentNominationGroup->nominee->preferred_lang, Language::class));
        $this->addLabelText($section, $this->localizeHeading('nominated_for'), implode(',', $nominatedFor));
    }

    /**
     * Generates nomination details section for a talent nomination group
     *
     * @param  Section  $section  The section to add nomination details to
     * @param  TalentNominationGroup  $talentNominationGroup  The talent nomination group
     */
    protected function details(Section $section, TalentNominationGroup $talentNominationGroup, $headingRank)
    {

        $section->addTitle($this->localizeHeading('nomination_details'), $headingRank);

        $nominations = $talentNominationGroup->nominations()->get();

        if ($talentNominationGroup->nominations()->count() > 0) {
            foreach ($nominations as $nomination) {

                $nomination->loadMissing('nominator', 'advancementReferenceFallbackClassification', 'advancementReferenceFallbackDepartment');

                if ($nomination->nominator) {
                    $section->addTitle("{$this->localizeHeading('nominated_by')} {$nomination->nominator->first_name} {$nomination->nominator->last_name}", $headingRank + 1);
                    $this->addLabelText($section, $this->localizeHeading('date_received'), $nomination->submitted_at->format('F d, Y'));
                    $this->addLabelText($section, $this->localizeHeading('nominators_work_email'), $nomination->nominator->work_email);
                    $this->addLabelText($section, $this->localizeHeading('nominators_classification'), $nomination->nominator->getClassification());
                    $this->addLabelText($section, $this->localizeHeading('nominators_department'), $nomination->nominator->department->name[$this->lang]);
                } else {
                    $section->addTitle("{$this->localizeHeading('nominated_by')} {$nomination->nominator_fallback_name}", $headingRank + 1);
                    $this->addLabelText($section, $this->localizeHeading('date_received'), $nomination->submitted_at->format('F d, Y'));
                    $this->addLabelText($section, $this->localizeHeading('nominators_work_email'), $nomination->nominator_fallback_work_email);

                    $fallBackClassification = Classification::findOrFail($nomination->nominator_fallback_classification_id);
                    $this->addLabelText($section, $this->localizeHeading('nominators_classification'), $fallBackClassification->displayName);

                    $fallbackDepartment = Department::findOrFail($nomination->nominator_fallback_department_id);
                    $this->addLabelText($section, $this->localizeHeading('nominators_department'), $fallbackDepartment->name[$this->lang]);

                }

                $nominatorRelationship = $nomination->submitter_relationship_to_nominator ? $this->localizeEnum($nomination->submitter_relationship_to_nominator->name, TalentNominationSubmitterRelationshipToNominator::class) : $nomination->submitter_relationship_to_nominator_other;
                $this->addLabelText($section, $this->localizeHeading('nominators_relationship'), $nominatorRelationship);

                $this->addLabelText($section, $this->localizeHeading('nominated_for'), '');
                if ($nomination->nominate_for_advancement) {
                    $section->addListItem($this->localizeHeading('advancement'));
                }
                if ($nomination->nominate_for_development_programs) {
                    $section->addListItem($this->localizeHeading('development_programs'));
                }
                if ($nomination->nominate_for_lateral_movement) {
                    $section->addListItem($this->localizeHeading('lateral_movement'));
                }

                if ($nomination->advancement_reference_id) {
                    $advancementReference = User::findOrFail($nomination->advancement_reference_id);
                    $this->addLabelText($section, $this->localizeHeading('advancement_secondary_reference'), $advancementReference->getFullName());
                    $this->addLabelText($section, $this->localizeHeading('advancement_reference_validity'), $this->localizeEnum($nomination->advancement_reference_review, TalentNominationUserReview::class));
                    $this->addLabelText($section, $this->localizeHeading('references_work_email'), $advancementReference->work_email);
                    $this->addLabelText($section, $this->localizeHeading('references_classification'), $advancementReference->currentClassification ? $advancementReference->currentClassification->displayName : Lang::get('common.not_available', [], $this->lang));
                    $this->addLabelText($section, $this->localizeHeading('references_department'), $advancementReference->department ? $advancementReference->department->name[$this->lang] : Lang::get('common.not_available', [], $this->lang));
                } else {
                    $this->addLabelText($section, $this->localizeHeading('advancement_secondary_reference'), $nomination->advancement_reference_fallback_name);
                    $this->addLabelText($section, $this->localizeHeading('references_work_email'), $nomination->advancement_reference_fallback_work_email);
                    $this->addLabelText($section, $this->localizeHeading('references_classification'), $nomination->advancementReferenceFallbackClassification ? $nomination->advancementReferenceFallbackClassification->displayName : Lang::get('common.not_available', [], $this->lang));
                    $this->addLabelText($section, $this->localizeHeading('references_department'), $nomination->advancementReferenceFallbackDepartment ? $nomination->advancementReferenceFallbackDepartment->name[$this->lang] : Lang::get('common.not_available', [], $this->lang));
                }

                if ($nomination->lateral_movement_options) {
                    $this->addLabelText($section, $this->localizeHeading('lateral_movement_options'), '');

                    $other = 'OTHER';
                    $lateralMovementOptions = $nomination->lateral_movement_options;
                    $key = array_search($other, $lateralMovementOptions);
                    if ($key !== false) {
                        unset($lateralMovementOptions[$key]);
                    }

                    foreach ($lateralMovementOptions as $option) {
                        $section->addListItem($this->localizeEnum($option, TalentNominationLateralMovementOption::class));
                    }
                }

                if ($nomination->lateral_movement_options_other) {
                    $section->addListItem("{$this->localizeHeading('other')} {$nomination->lateral_movement_options_other}");
                }

                if ($nomination->developmentPrograms()) {
                    $this->addLabelText($section, $this->localizeHeading('development_program_recommendations'), '');
                    $developmentPrograms = $nomination->developmentPrograms()->get();
                    foreach ($developmentPrograms as $developmentProgram) {
                        $section->addListItem($developmentProgram->name[$this->lang]);
                    }
                }

                if ($nomination->development_program_options_other) {
                    $section->addListItem("{$this->localizeHeading('other')} {$nomination->development_program_options_other}");
                }

                $this->addLabelText($section, $this->localizeHeading('rationale'), $nomination->nomination_rationale);

                $this->addLabelText($section, $this->localizeHeading('leadership_competencies'), '');
                $skills = $nomination->skills()->get();
                foreach ($skills as $skill) {
                    $section->addListItem($skill->name[$this->lang]);
                }

                $this->addLabelText($section, $this->localizeHeading('additional_comments'), $nomination->additional_comments);

            }
        } else {
            // TODO: Should I add null message if no nominations are found (edge case)?
            $section->addText('No nominations found.');
        }
    }

    /**
     * Generate all sections for a talent nomination group download
     */
    protected function generateTalentNominationGroup(Section $section, TalentNominationGroup $talentNominationGroup, ?int $headingRank)
    {
        $this->generalInfo($section, $talentNominationGroup);
        $this->nominee($section, $talentNominationGroup, $headingRank + 1);
        $this->details($section, $talentNominationGroup, $headingRank + 1);
    }
}
