<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
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
            'input.referralDecision' => [
                'required',
                Rule::in(array_column(TalentRequestTrackedUserReferralDecision::cases(), 'name')),
            ],
            'input.notReferredReason' => [
                'required_if:input.referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'prohibited_unless:input.referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotReferredReason::cases(), 'name')),
            ],
            'input.selectionDecision' => [
                'sometimes',
                'prohibited_if:input.referralDecision,'.TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserSelectionDecision::cases(), 'name')),
            ],
            'input.notSelectedReason' => [
                'required_if:input.selectionDecision,'.TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
                'prohibited_unless:input.selectionDecision,'.TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
                'nullable',
                Rule::in(array_column(TalentRequestTrackedUserNotSelectedReason::cases(), 'name')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'input.notReferredReason.prohibited_unless' => ErrorCode::TRACKED_USER_NOT_REFERRED_REASON_PROHIBITED->name,
            'input.selectionDecision.prohibited_if' => ErrorCode::TRACKED_USER_SELECTION_DECISION_PROHIBITED->name,
            'input.notSelectedReason.prohibited_unless' => ErrorCode::TRACKED_USER_NOT_SELECTED_REASON_PROHIBITED->name,
        ];
    }
}
