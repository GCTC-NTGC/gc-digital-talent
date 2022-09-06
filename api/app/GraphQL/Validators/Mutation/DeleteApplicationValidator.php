<?php

namespace App\GraphQL\Validators\Mutation;
use Database\Helpers\ApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DeleteApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // application status check, must be one of these to be deleted
            'pool_candidate_status' => [ Rule::in([
                ApiEnums::CANDIDATE_STATUS_DRAFT,
                ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
                ]) ],
        ];
    }

    public function messages(): array
    {
        return  [
            'in' => ':attribute does not contain a valid value.',
        ];
    }
}
