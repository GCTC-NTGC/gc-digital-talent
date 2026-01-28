<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Illuminate\Validation\Rule;
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

        return [
            // NOTE: Back compat for pool candidate status
            'reason' => [Rule::in(PoolCandidateStatus::unsuccessfulGroup())],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
