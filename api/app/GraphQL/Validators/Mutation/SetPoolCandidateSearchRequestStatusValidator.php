<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class SetPoolCandidateSearchRequestStatusValidator extends Validator
{
    public function rules(): array
    {
        return [
            'status' => [
                Rule::in([
                    TalentRequestStatus::IN_PROGRESS->name,
                    TalentRequestStatus::CLOSED->name,
                ]),
            ],
            'inProgressDetails' => ['required_if:status,'.TalentRequestStatus::IN_PROGRESS->name],
            'closedDetails' => ['required_if:status,'.TalentRequestStatus::CLOSED->name],
        ];
    }
}
