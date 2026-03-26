<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\CandidateRemovalReason;
use App\Rules\CanRemoveCandidate;
use Nuwave\Lighthouse\Validation\Validator;

class RemoveCandidateValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [
                'required',
                'uuid',
                'exists:pool_candidates,id',
                new CanRemoveCandidate,
            ],
            'removalReason' => ['required'],
            'removalReasonOther' => ['required_if:removalReason,'.CandidateRemovalReason::OTHER->name],
        ];
    }
}
