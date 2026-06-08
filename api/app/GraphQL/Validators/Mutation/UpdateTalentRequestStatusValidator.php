<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentRequestStatusValidator extends Validator
{
    public function rules(): array
    {
        return [
            'talentRequest.status' => [
                Rule::in([
                    TalentRequestStatus::IN_PROGRESS->name,
                    TalentRequestStatus::COMPLETED->name,
                ]),
            ],
            'talentRequest.inProgressDetails' => [
                'nullable',
                'required_if:talentRequest.status,'.TalentRequestStatus::IN_PROGRESS->name,
                Rule::in(array_column(TalentRequestInProgressDetail::cases(), 'name')),
            ],
            'talentRequest.completionDetails' => [
                'nullable',
                'required_if:talentRequest.status,'.TalentRequestStatus::COMPLETED->name,
                Rule::in(array_column(TalentRequestCompletionDetail::cases(), 'name')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'talentRequest.status.in' => ErrorCode::TALENT_REQUEST_INVALID_STATUS->name,
            'talentRequest.inProgressDetails.required_if' => ErrorCode::TALENT_REQUEST_IN_PROGRESS_DETAILS_REQUIRED->name,
            'talentRequest.completionDetails.required_if' => ErrorCode::TALENT_REQUEST_COMPLETION_DETAILS_REQUIRED->name,
        ];
    }
}
