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

        // many fields are required to be present if a decision is provided
        $presentWithADecision = 'present_with:talentNominationGroup.advancementDecision,talentNominationGroup.lateralMovementDecision,talentNominationGroup.developmentProgramsDecision';

        return [
            'talentNominationGroup.advancementDecision' => [
                'nullable',
                Rule::when(fn () => $talentNominationGroup->advancement_nomination_count > 0,
                    [Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name'))],
                    ['prohibited']),
                $presentWithADecision,
            ],
            'talentNominationGroup.lateralMovementDecision' => [
                'nullable',
                Rule::when(fn () => $talentNominationGroup->lateral_movement_nomination_count > 0,
                    [Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name'))],
                    ['prohibited']),
                $presentWithADecision,
            ],
            'talentNominationGroup.developmentProgramsDecision' => [
                'nullable',
                Rule::when(fn () => $talentNominationGroup->development_programs_nomination_count > 0,
                    Rule::in(array_column(TalentNominationGroupDecision::cases(), 'name')),
                    ['prohibited']),
                $presentWithADecision,
            ],
            'talentNominationGroup.advancementClassifications' => [
                $presentWithADecision,
            ],
            'talentNominationGroup.advancementClassifications.sync' => [
                'list',
                'distinct',
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.advancementDecision') === 'APPROVED',
                    ['min:1'], ['prohibited']),
            ],
            'talentNominationGroup.advancementClassifications.sync.*' => [
                'exists:classifications,id',
            ],
            'talentNominationGroup.advancementReferralExpiryDate' => [
                $presentWithADecision,
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.advancementDecision') === 'APPROVED',
                    ['date'], ['prohibited']),
            ],
            'talentNominationGroup.lateralMovementClassifications' => [
                $presentWithADecision,
            ],
            'talentNominationGroup.lateralMovementClassifications.sync' => [
                'list',
                'distinct',
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.lateralMovementDecision') === 'APPROVED',
                    ['min:1'], ['prohibited']),
            ],
            'talentNominationGroup.lateralMovementClassifications.sync.*' => [
                'exists:classifications,id',
            ],
            'talentNominationGroup.lateralMovementReferralExpiryDate' => [
                $presentWithADecision,
                Rule::when(fn ($attributes) => $attributes->get('talentNominationGroup.lateralMovementDecision') === 'APPROVED',
                    ['date'], ['prohibited']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'talentNominationGroup.advancementDecision.required' => ErrorCode::ADVANCEMENT_DECISION_REQUIRED->name,
            'talentNominationGroup.advancementDecision.present_with' => ErrorCode::ADVANCEMENT_DECISION_REQUIRED->name,
            'talentNominationGroup.advancementDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_ADVANCEMENT_TO_DECIDE->name,
            'talentNominationGroup.advancementDecision.in' => ErrorCode::ENUM_NOT_FOUND->name,
            'talentNominationGroup.lateralMovementDecision.required' => ErrorCode::LATERAL_MOVEMENT_DECISION_REQUIRED->name,
            'talentNominationGroup.lateralMovementDecision.present_with' => ErrorCode::LATERAL_MOVEMENT_DECISION_REQUIRED->name,
            'talentNominationGroup.lateralMovementDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_LATERAL_MOVEMENT_TO_DECIDE->name,
            'talentNominationGroup.lateralMovementDecision.in' => ErrorCode::ENUM_NOT_FOUND->name,
            'talentNominationGroup.developmentProgramsDecision.required' => ErrorCode::DEVELOPMENT_PROGRAMS_DECISION_REQUIRED->name,
            'talentNominationGroup.developmentProgramsDecision.present_with' => ErrorCode::DEVELOPMENT_PROGRAMS_DECISION_REQUIRED->name,
            'talentNominationGroup.developmentProgramsDecision.prohibited' => ErrorCode::NO_NOMINATIONS_FOR_DEVELOPMENT_PROGRAMS_TO_DECIDE->name,
            'talentNominationGroup.developmentProgramsDecision.in' => ErrorCode::ENUM_NOT_FOUND->name,
            'talentNominationGroup.advancementClassifications.present_with' => ErrorCode::ADVANCEMENT_CLASSIFICATIONS_REQUIRED->name,
            'talentNominationGroup.advancementClassifications.sync.min' => ErrorCode::ADVANCEMENT_CLASSIFICATIONS_REQUIRED->name,
            'talentNominationGroup.advancementClassifications.sync.prohibited' => ErrorCode::ADVANCEMENT_CLASSIFICATIONS_PROHIBITED->name,
            'talentNominationGroup.advancementClassifications.sync.distinct' => ErrorCode::ARRAY_CONTAINS_DUPLICATES->name,
            'talentNominationGroup.advancementClassifications.sync.*.exists' => ErrorCode::CLASSIFICATION_NOT_FOUND->name,
            'talentNominationGroup.advancementReferralExpiryDate.present_with' => ErrorCode::ADVANCEMENT_REFERRAL_EXPIRY_DATE_REQUIRED->name,
            'talentNominationGroup.advancementReferralExpiryDate.prohibited' => ErrorCode::ADVANCEMENT_REFERRAL_EXPIRY_DATE_PROHIBITED->name,
            'talentNominationGroup.lateralMovementClassifications.present_with' => ErrorCode::LATERAL_MOVEMENT_CLASSIFICATIONS_REQUIRED->name,
            'talentNominationGroup.lateralMovementClassifications.sync.min' => ErrorCode::LATERAL_MOVEMENT_CLASSIFICATIONS_REQUIRED->name,
            'talentNominationGroup.lateralMovementClassifications.sync.prohibited' => ErrorCode::LATERAL_MOVEMENT_CLASSIFICATIONS_PROHIBITED->name,
            'talentNominationGroup.lateralMovementClassifications.sync.distinct' => ErrorCode::ARRAY_CONTAINS_DUPLICATES->name,
            'talentNominationGroup.lateralMovementClassifications.sync.*.exists' => ErrorCode::CLASSIFICATION_NOT_FOUND->name,
            'talentNominationGroup.lateralMovementReferralExpiryDate.present_with' => ErrorCode::LATERAL_MOVEMENT_REFERRAL_EXPIRY_DATE_REQUIRED->name,
            'talentNominationGroup.lateralMovementReferralExpiryDate.prohibited' => ErrorCode::LATERAL_MOVEMENT_REFERRAL_EXPIRY_DATE_PROHIBITED->name,
        ];
    }
}
