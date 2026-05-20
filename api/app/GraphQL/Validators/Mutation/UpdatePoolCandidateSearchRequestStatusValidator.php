<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

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
                    TalentRequestStatus::CLOSED->name,
                ]),
            ],
            'poolCandidateSearchRequest.inProgressDetails' => [
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::IN_PROGRESS->name,
            ],
            'poolCandidateSearchRequest.closedDetails' => [
                'required_if:poolCandidateSearchRequest.status,'.TalentRequestStatus::CLOSED->name,
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'poolCandidateSearchRequest.status.in' => 'The selected status is invalid.',
            'poolCandidateSearchRequest.inProgressDetails.required_if' => 'The inProgressDetails field is required when status is IN_PROGRESS.',
            'poolCandidateSearchRequest.closedDetails.required_if' => 'The closedDetails field is required when status is CLOSED.',
        ];
    }
}
