<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationNomineeRelationshipToNominator;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\SkillFamily;
use App\Models\TalentNomination;
use App\Rules\GovernmentEmailRegex;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class SubmitTalentNominationValidator extends Validator
{
    private $nomination;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(TalentNomination $nomination)
    {
        $this->nomination = $nomination;
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'talent_nomination_event_id' => ['required'],
            'submitted_at' => ['prohibited'],
            'submitter_id' => ['required'],
            'submitter_relationship_to_nominator' => [
                'required_unless:submitter_id,'.$this->nomination->nominator?->id,
                'prohibited_if:submitter_id,'.$this->nomination->nominator?->id,
                'nullable',
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'submitter_relationship_to_nominator_other' => [
                'required_if:submitter_relationship_to_nominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'prohibited_unless:submitter_relationship_to_nominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
            ],
            'nominator_id' => [
                'required_without_all:nominator_fallback_work_email,nominator_fallback_name,nominator_fallback_classification_id,nominator_fallback_department_id',
            ],
            'nominator_review' => [
                'required_unless:nominator_id,null',
                'prohibited_if:nominator_id,null',
            ],
            'nominator_fallback_work_email' => [
                'required_if:nominator_id,null',
                'prohibited_unless:nominator_id,null',
                'nullable',
                new GovernmentEmailRegex,
            ],
            'nominator_fallback_name' => [
                'required_if:nominator_id,null',
                'prohibited_unless:nominator_id,null',
            ],
            'nominator_fallback_classification_id' => [
                'required_if:nominator_id,null',
                'prohibited_unless:nominator_id,null',
            ],
            'nominator_fallback_department_id' => [
                'required_if:nominator_id,null',
                'prohibited_unless:nominator_id,null',
            ],

            'nominee_id' => [
                'required',
                'different:nominator_id',
            ],
            'nominee_review' => [
                'required',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'nominee_relationship_to_nominator' => [
                'required',
                Rule::in(array_column(TalentNominationNomineeRelationshipToNominator::cases(), 'name')),
            ],
            'nominee_relationship_to_nominator_other' => [
                'required_if:nominee_relationship_to_nominator,'.TalentNominationNomineeRelationshipToNominator::OTHER->name,
                'prohibited_unless:nominee_relationship_to_nominator,'.TalentNominationNomineeRelationshipToNominator::OTHER->name,
            ],

            'nominate_for_advancement' => [
                'required',
                Rule::when(fn () => $this->nomination->advancement_reference_id || $this->nomination->advancement_reference_fallback_work_email,
                    ['accepted'],
                    ['declined']),
            ],
            'nominate_for_lateral_movement' => [
                'required',
                Rule::when(fn () => count($this->nomination->lateral_movement_options) > 0,
                    ['accepted'],
                    ['declined']),
            ],
            'nominate_for_development_programs' => [
                'required',
                Rule::when(fn () => $this->nomination->developmentPrograms->count() > 0 || ! empty($this->development_program_options_other),
                    ['accepted'],
                    ['declined']),
            ],

            'advancement_reference_id' => [
                'prohibited_unless:nominate_for_advancement,true',
                'prohibited_unless:advancement_reference_fallback_work_email,null',
            ],
            'advancement_reference_review' => [
                'required_unless:advancement_reference_id,null',
                'prohibited_if:advancement_reference_id,null',
                'nullable',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'advancement_reference_fallback_work_email' => [
                'prohibited_unless:advancement_reference_id,null',
                'required_with:advancement_reference_fallback_name,advancement_reference_fallback_classification_id,advancement_reference_fallback_department_id',
                'nullable',
                new GovernmentEmailRegex,
            ],
            'advancement_reference_fallback_name' => [
                'required_with:advancement_reference_fallback_work_email,advancement_reference_fallback_classification_id,advancement_reference_fallback_department_id',
                'prohibited_unless:advancement_reference_id,null',
            ],
            'advancement_reference_fallback_classification_id' => [
                'required_with:advancement_reference_fallback_work_email,advancement_reference_fallback_name,advancement_reference_fallback_department_id',
                'prohibited_unless:advancement_reference_id,null',
            ],
            'advancement_reference_fallback_department_id' => [
                'required_with:advancement_reference_fallback_work_email,advancement_reference_fallback_name,advancement_reference_fallback_classification_id',
                'prohibited_unless:advancement_reference_id,null',
            ],

            'lateral_movement_options' => ['array'],
            'lateral_movement_options.*' => [
                'distinct',
                Rule::in(array_column(TalentNominationLateralMovementOption::cases(), 'name')),
            ],
            'lateral_movement_options_other' => [
                Rule::requiredIf(in_array(TalentNominationLateralMovementOption::OTHER->name, $this->nomination->lateral_movement_options)),
                Rule::prohibitedIf(! in_array(TalentNominationLateralMovementOption::OTHER->name, $this->nomination->lateral_movement_options)),
            ],

            'development_programs' => ['array'],
            'development_program_options_other' => [
                'prohibited_unless:nominate_for_development_programs,true',
            ],
            'nomination_rationale' => ['required'],
            'skills' => [
                Rule::when(fn () => $this->nomination->talentNominationEvent->include_leadership_competencies,
                    ['size:3'],
                    ['prohibited']
                ),
            ],
            'skills.*.skill_id' => [
                Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray()),
            ],
            'additional_comments' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'submitted_at.prohibited' => 'AlreadySubmitted',
            'skills.*.in' => ApiErrorEnums::SKILL_NOT_KLC,
            'skills.*.prohibited' => ApiErrorEnums::SKILLS_NOT_ALLOWED_FOR_EVENT,
        ];
    }
}
