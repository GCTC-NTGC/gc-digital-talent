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

        if ($candidate->application_status !== ApplicationStatus::QUALIFIED->name) {
            throw ValidationException::withMessages(['id' => ErrorCode::INVALID_STATUS_PLACING->name]);
        }

        return [
            'poolCandidate.department.connect' => ['uuid', 'required', Rule::exists('departments', 'id')],
            // NOTE: Back compat for pool candidate status
            'poolCandidate.placementType' => [Rule::in(PoolCandidateStatus::placedGroup())],
        ];
    }

    public function messages(): array
    {
        return [
            'exists' => ':attribute does not exist.',
        ];
    }
}
