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
                'required_unless:submitter.id,'.$this->nomination->nominator?->id,
                'prohibited_if:submitter.id,'.$this->nomination->nominator?->id,
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

            'nominee_id' => ['required'],
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

            'nominate_for_advancement' => ['required'],
            'nominate_for_lateral_movement' => ['required'],
            'nominate_for_development_programs' => ['required'],

            'advancement_reference_id' => ['prohibited_unless:nominate_for_advancement,true'],
            'advancement_reference_review' => [
                'required_unless:advancement_reference_id,null',
                'prohibited_if:advancement_reference_id,null',
                'required_without_all:advancement_reference_fallback_work_email,advancement_reference_fallback_name,advancement_reference_fallback_classification_id,advancement_reference_fallback_department_id',
                'nullable',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'advancement_reference_fallback_work_email' => [
                'required_if:advancement_reference_id,null',
                'prohibited_unless:advancement_reference_id,null',
                'nullable',
                new GovernmentEmailRegex,
            ],
            'advancement_reference_fallback_name' => [
                'required_if:advancement_reference_id,null',
                'prohibited_unless:advancement_reference_id,null',
            ],
            'advancement_reference_fallback_classification_id' => [
                'required_if:advancement_reference_id,null',
                'prohibited_unless:advancement_reference_id,null',
            ],
            'advancement_reference_fallback_department_id' => [
                'required_if:advancement_reference_id,null',
                'prohibited_unless:advancement_reference_id,null',
            ],

            'lateral_movement_options' => [
                'prohibited_unless:nominate_for_lateral_movement,true',
                'required_if:nominate_for_lateral_movement,true',
                'nullable',
                'array',
                'min:1',
            ],
            'lateral_movement_options.*' => [
                'distinct',
                Rule::in(array_column(TalentNominationLateralMovementOption::cases(), 'name')),
            ],
            'lateral_movement_options_other' => [
                Rule::requiredIf(in_array(TalentNominationLateralMovementOption::OTHER->name, $this->nomination->lateral_movement_options)),
                Rule::prohibitedIf(! in_array(TalentNominationLateralMovementOption::OTHER->name, $this->nomination->lateral_movement_options)),
            ],

            'development_programs' => ['prohibited_unless:nominate_for_development_programs,true'],
            'development_program_options_other' => [
                'prohibited_unless:nominate_for_development_programs,true',
                Rule::when($this->nomination->developmentPrograms->count() == 0, ['required']),
            ],
            'nomination_rationale' => ['required'],
            'skills.*' => [
                'distinct',
                'length:3',
                Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray()),
            ],
            // 'skills.*.id' => [Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray())],
            'additional_comments' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'submitted_at.prohibited' => 'AlreadySubmitted',
            'skills.*.in' => ApiErrorEnums::SKILL_NOT_KLC,
        ];
    }
}
