<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use Carbon\Carbon;
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
        $startOfDay = Carbon::now()->startOfDay();

        $statusesArray = [
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
        ];

        if (! (in_array($candidate->pool_candidate_status, $statusesArray))) {
            throw ValidationException::withMessages(['id' => ErrorCode::INVALID_STATUS_QUALIFICATION->name]);
        }

        return [
            'poolCandidate.expiryDate' => ['required', 'after_or_equal:'.$startOfDay],
        ];
    }

    public function messages(): array
    {
        return [
            'poolCandidate.expiryDate.required' => ErrorCode::EXPIRY_DATE_REQUIRED->name,
            'poolCandidate.expiryDate.after' => ErrorCode::EXPIRY_DATE_AFTER_TODAY->name,
        ];
    }
}
