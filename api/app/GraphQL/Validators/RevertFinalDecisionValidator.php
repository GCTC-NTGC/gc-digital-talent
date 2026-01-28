<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
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
            ApplicationStatus::DISQUALIFIED->name,
            ApplicationStatus::QUALIFIED->name,
        ];

        if (! (in_array($candidate->application_status, $statusesArray))) {
            throw ValidationException::withMessages(['id' => ErrorCode::INVALID_STATUS_REVERT_FINAL_DECISION->name]);
        }

        return [];
    }

    public function messages(): array
    {
        return [];
    }
}
