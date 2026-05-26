<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestCompleteDetail;
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
                    TalentRequestStatus::COMPLETE->name,
                ]),
            ],
            'poolCandidateSearchRequest.inProgressDetails' => [
                'nullable',
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::IN_PROGRESS->name,
                Rule::in(array_column(TalentRequestInProgressDetail::cases(), 'name')),
            ],
            'poolCandidateSearchRequest.completeDetails' => [
                'nullable',
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::COMPLETE->name,
                Rule::in(array_column(TalentRequestCompleteDetail::cases(), 'name')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'poolCandidateSearchRequest.status.in' => 'The selected status is invalid.',
            'poolCandidateSearchRequest.inProgressDetails.required_if' => 'The inProgressDetails field is required when status is IN_PROGRESS.',
            'poolCandidateSearchRequest.completeDetails.required_if' => 'The completeDetails field is required when status is COMPLETE.',
        ];
    }
}
