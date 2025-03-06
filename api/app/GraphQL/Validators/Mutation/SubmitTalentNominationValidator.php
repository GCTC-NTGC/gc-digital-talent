<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentNominationLateralMovementOption;
use App\Enums\TalentNominationSubmitterRelationshipToNominator;
use App\Enums\TalentNominationUserReview;
use App\Models\SkillFamily;
use App\Models\TalentNomination;
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
            'talent_nomination_event_id' => [
                'required',
                'exists:talent_nomination_events,id',
            ],
            'submitted_at' => ['prohibited'],
            'submitter_id' => [
                'required',
                'exists:users,id',
            ],
            'submitter_relationship_to_nominator' => [
                'required_unless:submitter.id,'.$this->nomination->nominator->id,
                'prohibited_if:submitter.id,'.$this->nomination->nominator->id,
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'submitter_relationship_to_nominator_other' => [
                'required_if:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'prohibited_unless:submitterRelationshipToNominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'string',
            ],
            'nominator_id' => [
                'required_without_all:nominator_fallback_work_email,nominator_fallback_name,nominator_fallback_classification_id,nominator_fallback_department_id',
                'exists:users,id',
            ],
            'nominator_fallback_work_email' => [
                'required_if:nominator_id,null',
                'prohibited_unless:nominator_id,null',
                // TODO: validate work email - in create and update, too
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
            'nominator_review' => [
                'required_unless:nominator_id,null',
                'prohibited_if:nominator_id,null',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],

            'nominee_id' => [
                'required',
                'exists:users,id',
            ],
            'nomineeReview' => [
                'required_unless:nominee_id,null',
                'prohibited_if:nominee_id,null',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'nominee_relationship_to_nominator' => [
                'required',
                Rule::in(array_column(TalentNominationSubmitterRelationshipToNominator::cases(), 'name')),
            ],
            'nominee_relationship_to_nominator_other' => [
                'required_if:nominee_relationship_to_nominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'prohibited_unless:nominee_relationship_to_nominator,'.TalentNominationSubmitterRelationshipToNominator::OTHER->name,
                'string',
            ],

            'nominate_for_advancement' => [
                'requited',
                'boolean',
            ],
            'nominate_for_lateral_movement' => [
                'requited',
                'boolean',
            ],
            'nominate_for_development_programs' => [
                'required',
                'boolean',
            ],

            'advancement_reference_id' => [
                'prohibited_unless:nominate_for_advancement,true',
                'uuid',
                'exists:users,id',
            ],
            'advancement_reference_review' => [
                'required_unless:advancement_reference_id,null',
                'prohibited_if:advancement_reference_id,null',
                'required_without_all:advancement_reference_fallback_work_email,advancement_reference_fallback_name,advancement_reference_fallback_classification_id,advancement_reference_fallback_department_id',
                Rule::in(array_column(TalentNominationUserReview::cases(), 'name')),
            ],
            'advancement_reference_fallback_work_email' => [
                'required_if:advancement_reference_id,null',
                'prohibited_unless:advancement_reference_id,null',
                // TODO: validate work email - in create and update, too
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
                'array',
                'min:1',
            ],
            'lateral_movement_options.*' => [
                'distinct',
                Rule::in(array_column(TalentNominationLateralMovementOption::cases(), 'name')),
            ],
            'lateral_movement_options_other' => [
                'string',
                Rule::requiredIf(in_array(TalentNominationLateralMovementOption::OTHER->name, $this->arg('lateralMovementOptions') ?? [])),
                Rule::prohibitedIf(! in_array(TalentNominationLateralMovementOption::OTHER->name, $this->arg('lateralMovementOptions') ?? [])),
            ],

            'developmentPrograms' => [
                'prohibited_unless:nominate_for_development_programs,true',
            ],
            'developmentProgramOptionsOther' => [
                'prohibited_unless:nominate_for_development_programs,true',
                'string',
                Rule::when($this->nomination->developmentPrograms->count() == 0, ['required']),
            ],
            'nominationRationale' => ['required', 'string'],
            'skills' => [
                'distinct',
                'length:3',
            ],
            'skills.*.id' => [Rule::in(SkillFamily::where('key', 'klc')->sole()->skills->pluck('id')->toArray())],
            'additionalComments' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            // 'talentNominationEvent.connect.exists' => ApiErrorEnums::TALENT_NOMINATION_EVENT_NOT_FOUND,
            // 'nominator.connect.exists' => ApiErrorEnums::NOMINATOR_NOT_FOUND,
            // 'nominatorFallbackClassification.connect.exists' => ApiErrorEnums::NOMINATOR_CLASSIFICATION_NOT_FOUND,
            // 'nominatorFallbackDepartment.connect.exists' => ApiErrorEnums::NOMINATOR_DEPARTMENT_NOT_FOUND,
            // 'nominee.connect.exists' => ApiErrorEnums::NOMINEE_NOT_FOUND,
            // 'advancementReference.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_NOT_FOUND,
            // 'advancementReferenceFallbackClassification.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_CLASSIFICATION_NOT_FOUND,
            // 'advancementReferenceFallbackDepartment.connect.exists' => ApiErrorEnums::ADVANCEMENT_REFERENCE_DEPARTMENT_NOT_FOUND,
            // 'developmentPrograms.sync.exists' => ApiErrorEnums::DEVELOPMENT_PROGRAM_NOT_FOUND,
            // 'skills.sync.exists' => ApiErrorEnums::SKILL_NOT_FOUND,
            // 'skills.sync.*.in' => ApiErrorEnums::SKILL_NOT_KLC,
        ];
    }
}
