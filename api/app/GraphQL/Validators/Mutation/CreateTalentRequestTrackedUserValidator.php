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
            'userId' => ['required', 'uuid', 'exists:users,id'],
            'talentRequestId' => ['required', 'uuid', 'exists:talent_requests,id'],
            'referralDecision' => [
                'sometimes',
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserReferralDecision::cases(), 'name')),
            ],
            'notReferredReason' => [
                'required_if:referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
        ];
    }
}
