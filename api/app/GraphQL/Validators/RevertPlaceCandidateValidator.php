<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\PlacementType;
use App\Models\PoolCandidate;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class RevertPlaceCandidateValidator extends Validator
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

        if (! (in_array($candidate->pool_candidate_status, $placedStatuses))) {
            throw ValidationException::withMessages(['id' => ErrorCode::CANDIDATE_NOT_PLACED->name]);
        }

        return [];
    }

    public function messages(): array
    {
        return [];
    }
}
