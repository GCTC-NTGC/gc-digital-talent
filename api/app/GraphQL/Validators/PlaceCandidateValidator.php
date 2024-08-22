<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApiError;
use App\Enums\PlacementType;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class PlaceCandidateValidator extends Validator
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
        $placedStatuses = array_column(PlacementType::cases(), 'name');
        $statusesArray = [...$placedStatuses, PoolCandidateStatus::QUALIFIED_AVAILABLE->name];

        if (! (in_array($candidate->pool_candidate_status, $statusesArray))) {
            throw ValidationException::withMessages([
                'status' => [ApiError::POOL_CANDIDATE_INVALID_STATUS_PLACING->localizedMessage()],
            ]);
        }

        return [
            'placeCandidate.departmentId' => ['uuid', 'required', Rule::exists('departments', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'exists' => ':attribute does not exist.',
        ];
    }
}
