<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Enums\TalentNominationGroupDecision;
use App\Models\TalentNominationGroup;
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
            'talentNominationGroup.advancementClassifications' => [
                // when updating a decision, updating the classifications is also required
                'required_with:talentNominationGroup.advancementDecision,talentNominationGroup.lateralMovementDecision,talentNominationGroup.developmentProgramsDecision',
            ],
            'talentNominationGroup.advancementClassifications.sync' => [
                'list',
                'distinct',
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.advancementDecision') === 'APPROVED',
                    ['min:0'],  // we will eventually require classifications when approving
                    ['max:0']), // unless approved, can't sync any classifications
            ],
            'talentNominationGroup.referralExpiryDate' => [
                // when updating a decision, updating the referral expiry date is also required
                'present_with:talentNominationGroup.advancementDecision,talentNominationGroup.lateralMovementDecision,talentNominationGroup.developmentProgramsDecision',
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.advancementDecision') === 'APPROVED',
                    ['present'], // ['todayOrAfter'],  // we will eventually require expiry date when approving
                    ['prohibited']), // must be null if not approved
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationGroup.advancementDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_ADVANCEMENT_TO_DECIDE->name,
            'talentNominationGroup.lateralMovementDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_LATERAL_MOVEMENT_TO_DECIDE->name,
            'talentNominationGroup.developmentProgramsDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_DEVELOPMENT_PROGRAMS_TO_DECIDE->name,
        ];
    }
}
