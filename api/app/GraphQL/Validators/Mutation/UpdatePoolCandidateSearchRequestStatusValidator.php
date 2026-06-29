<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestCompletionDetail;
use App\Enums\TalentRequestInProgressDetail;
use App\Enums\TalentRequestStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateSearchRequestStatusValidator extends Validator
{
    public function rules(): array
    {
        return [
            'poolCandidateSearchRequest.status' => [
                Rule::in([
                    TalentRequestStatus::IN_PROGRESS->name,
                    TalentRequestStatus::COMPLETED->name,
                ]),
            ],
            'poolCandidateSearchRequest.inProgressDetails' => [
                'nullable',
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::IN_PROGRESS->name,
                Rule::in(array_column(TalentRequestInProgressDetail::cases(), 'name')),
            ],
            'poolCandidateSearchRequest.completionDetails' => [
                'nullable',
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::COMPLETED->name,
                Rule::in(array_column(TalentRequestCompletionDetail::cases(), 'name')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'poolCandidateSearchRequest.status.in' => 'The selected status is invalid.',
            'poolCandidateSearchRequest.inProgressDetails.required_if' => 'The inProgressDetails field is required when status is IN_PROGRESS.',
            'poolCandidateSearchRequest.completionDetails.required_if' => 'The completionDetails field is required when status is COMPLETE.',
        ];
    }
}
