<?php

namespace App\GraphQL\Validators\Mutation;

use App\Providers\PoolCandidateStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class ArchiveApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // application status check, must be one of these to be archived see issue #3660
            'pool_candidate_status' => [Rule::in([
                PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
                PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
                PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
                PoolCandidateStatus::EXPIRED->name,
                PoolCandidateStatus::REMOVED->name,
            ])],
            'archived_at' => ['prohibited', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => ':attribute InvalidValueArchival',
            'archived_at.prohibited' => 'AlreadyArchived',
        ];
    }
}
