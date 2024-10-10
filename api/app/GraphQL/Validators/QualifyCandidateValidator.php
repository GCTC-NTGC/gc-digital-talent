<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Database\Helpers\ApiErrorEnums;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class QualifyCandidateValidator extends Validator
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
        $endOfDay = Carbon::now()->endOfDay();

        $statusesArray = [
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
        ];

        if (! (in_array($candidate->pool_candidate_status, $statusesArray))) {
            throw ValidationException::withMessages(['id' => ApiErrorEnums::INVALID_STATUS_QUALIFICATION]);
        }

        return [
            'expiryDate' => ['required', 'after:'.$endOfDay],
        ];
    }

    public function messages(): array
    {
        return [
            'expiryDate.required' => ApiErrorEnums::EXPIRY_DATE_REQUIRED,
            'expiryDate.after' => ApiErrorEnums::EXPIRY_DATE_AFTER_TODAY,
        ];
    }
}
