<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

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
            'talentRequest.status.in' => 'The selected status is invalid.',
            'talentRequest.inProgressDetails.required_if' => 'The inProgressDetails field is required when status is IN_PROGRESS.',
            'talentRequest.completionDetails.required_if' => 'The completionDetails field is required when status is COMPLETED.',
        ];
    }
}
