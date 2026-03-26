<?php

namespace App\GraphQL\Validators\Mutation;

use App\Rules\CanReinstateCandidate;
use Nuwave\Lighthouse\Validation\Validator;

class ReinstateCandidateValidator extends Validator
{
    public function rules(): array
    {
        return [
            'id' => [
                'required',
                'uuid',
                'exists:pool_candidates,id',
                new CanReinstateCandidate,
            ],
        ];
    }
}
