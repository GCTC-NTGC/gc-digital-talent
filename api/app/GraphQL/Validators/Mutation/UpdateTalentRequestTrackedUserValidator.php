<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentRequestTrackedUserValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'uuid', 'exists:talent_request_tracked_users,id'],
            'referralDecision' => [
                'required',
                Rule::in(array_column(TalentRequestTrackedUserReferralDecision::cases(), 'name')),
            ],
            'notReferredReason' => [
                'required_if:referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
            'selectionDecision' => [
                'sometimes',
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserSelectionDecision::cases(), 'name')),
            ],
            'notSelectedReason' => [
                'required_if:selectionDecision,'.TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotSelectedReason::cases(), 'name')),
            ],
        ];
    }
}
