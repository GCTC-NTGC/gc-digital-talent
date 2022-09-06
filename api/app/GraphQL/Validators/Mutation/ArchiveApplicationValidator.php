<?php

namespace App\GraphQL\Validators\Mutation;
use Database\Helpers\ApiEnums;
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
            'pool_candidate_status' => [ Rule::in([
                ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
                ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
                ApiEnums::CANDIDATE_STATUS_EXPIRED,
                ]) ],
            'archived_at' => ['prohibited', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return  [
            'in' => ':attribute does not contain a valid value.',
            'archived_at.prohibited' => 'already archived',
        ];
    }
}
