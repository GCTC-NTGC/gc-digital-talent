<?php

namespace App\GraphQL\Validators;

use App\Enums\ClaimVerificationResult;
use Database\Helpers\ApiErrorEnums;
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

    /**
     * Return the messages
     */
    public function messages(): array
    {
        return [
            'priorityVerificationExpiry.required' => ApiErrorEnums::EXPIRY_DATE_REQUIRED,
            'priorityVerificationExpiry.after' => ApiErrorEnums::EXPIRY_DATE_AFTER_TODAY,
            'veteranVerificationExpiry.after' => ApiErrorEnums::EXPIRY_DATE_AFTER_TODAY,
        ];
    }
}
