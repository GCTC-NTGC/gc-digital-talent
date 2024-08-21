<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApiError;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class RevertFinalDecisionValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->arg('id');
        $candidate = PoolCandidate::findOrFail($id);

        $statusesArray = [
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::EXPIRED->name,
        ];

        if (! (in_array($candidate->pool_candidate_status, $statusesArray))) {
            throw ValidationException::withMessages([
                'status' => [ApiError::POOL_CANDIDATE_INVALID_STATUS_REVERT_FINAL_DECISION->localizedErrorMessage()],
            ]);
        }

        return [];
    }

    public function messages(): array
    {
        return [];
    }
}
