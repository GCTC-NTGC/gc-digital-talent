<?php

namespace App\GraphQL\Validators;

use App\Enums\ClaimVerificationResult;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateClaimVerificationInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $priorityAccepted = $this->arg('priorityVerification') === ClaimVerificationResult::ACCEPTED->name;
        $veteranAccepted = $this->arg('veteranVerification') === ClaimVerificationResult::ACCEPTED->name;

        return [
            'priorityVerificationExpiry' => [
                Rule::when($priorityAccepted, ['required', 'after:today']),
                Rule::when(! $priorityAccepted, ['nullable']),
            ],
            'veteranVerificationExpiry' => [
                'nullable',
                Rule::when($veteranAccepted, ['after:today']),
            ],
        ];
    }
}
