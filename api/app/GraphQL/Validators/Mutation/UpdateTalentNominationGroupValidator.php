<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNominationGroup;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentNominationGroupValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $talentNominationGroup = TalentNominationGroup::find($this->arg('id'));

        return [
            'talentNominationGroup.advancementDecision' => [
                'nullable',
                Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name')),
                Rule::when(fn () => $talentNominationGroup->advancement_nomination_count == 0, ['prohibited']),
            ],
            'talentNominationGroup.lateralMovementDecision' => [
                'nullable',
                Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name')),
                Rule::when(fn () => $talentNominationGroup->lateral_movement_nomination_count == 0, ['prohibited']),
            ],
            'talentNominationGroup.developmentProgramsDecision' => [
                'nullable',
                Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name')),
                Rule::when(fn () => $talentNominationGroup->development_programs_nomination_count == 0, ['prohibited']),
            ],

        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationGroup.advancementDecision.prohibited' => ApiErrorEnums::NO_NOMINATIONS_FOR_ADVANCEMENT_TO_DECIDE,
            'talentNominationGroup.lateralMovementDecision.prohibited' => ApiErrorEnums::NO_NOMINATIONS_FOR_LATERAL_MOVEMENT_TO_DECIDE,
            'talentNominationGroup.developmentProgramsDecision.prohibited' => ApiErrorEnums::NO_NOMINATIONS_FOR_DEVELOPMENT_PROGRAMS_TO_DECIDE,
        ];
    }
}
