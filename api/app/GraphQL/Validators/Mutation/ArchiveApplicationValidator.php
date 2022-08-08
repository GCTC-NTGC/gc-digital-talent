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
            // application status check
            // TODO, UPDATE WITH "REJECTED" STATUS ONCE IT IS ADDED IN
            'pool_candidate_status' => [ Rule::in([ApiEnums::CANDIDATE_STATUS_EXPIRED]) ],
            'archived_date' => ['prohibited', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return  [
            'in' => ':attribute does not contain a valid value.',
            'archived_date.prohibited' => 'already archived',
        ];
    }
}
