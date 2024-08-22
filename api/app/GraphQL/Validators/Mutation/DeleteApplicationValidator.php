<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApiError;
use App\Enums\PoolCandidateStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DeleteApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // application status check, must be one of these to be deleted
            'pool_candidate_status' => [Rule::in([
                PoolCandidateStatus::DRAFT->name,
                PoolCandidateStatus::DRAFT_EXPIRED->name,
            ])],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => ApiError::APPLICATION_INVALID_STATUS_DELETE->localizedMessage(),
        ];
    }
}
