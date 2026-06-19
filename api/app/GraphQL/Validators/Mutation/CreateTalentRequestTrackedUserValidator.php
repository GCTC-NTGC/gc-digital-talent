<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateTalentRequestTrackedUserValidator extends Validator
{
    public function rules(): array
    {
        return [
            'input.userId' => ['required', 'uuid', 'exists:users,id'],
            'input.talentRequestId' => ['required', 'uuid', 'exists:talent_requests,id'],
            'input.referralDecision' => [
                'sometimes',
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserReferralDecision::cases(), 'name')),
            ],
            'input.notReferredReason' => [
                'required_if:input.referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
        ];
    }
}
