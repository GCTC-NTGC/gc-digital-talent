<?php

namespace App\GraphQL\Validators;

use App\Enums\CommunityReferralStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCommunityInterestReferralStatusInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        $isNotReferred = $this->arg('status') === CommunityReferralStatus::NOT_REFERRED->name;
        $isReferred = $this->arg('status') === CommunityReferralStatus::AVAILABLE_FOR_REFERRAL->name;

        return [
            'id' => ['required', 'uuid'],
            'status' => ['required', Rule::in(array_column(CommunityReferralStatus::cases(), 'name'))],
            'followUpDate' => [Rule::requiredUnless($isNotReferred), 'date'],
            'classification.connect' => [Rule::requiredIf($isReferred), 'uuid', 'exists:classifications,id'],
            'notes' => ['string', Rule::requiredIf($isNotReferred)],
        ];
    }

    /**
     * Return the messages
     */
    public function messages(): array
    {
        return [
        ];
    }
}
