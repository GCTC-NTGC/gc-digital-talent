<?php

namespace App\GraphQL\Validators;

use App\Rules\IsStatusOrNonStatus;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateUserAsUserInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'indigenousCommunities' => [new IsStatusOrNonStatus],
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
