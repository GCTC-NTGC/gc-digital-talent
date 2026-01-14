<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class DisqualifyCandidateValidator extends Validator
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

        if ($candidate->application_status !== ApplicationStatus::TO_ASSESS->name) {
            throw ValidationException::withMessages(['status' => ErrorCode::INVALID_STATUS_DISQUALIFICATION->name]);
        }

        return [];
    }

    public function messages(): array
    {
        return [];
    }
}
