<?php

namespace App\GraphQL\Validators;

use App\Enums\PoolCandidateSearchStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolCandidateSearchRequestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        return [
            'adminNotes' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(array_column(PoolCandidateSearchStatus::cases(), 'name'))],
            'followUpDate' => ['nullable', 'date'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
