<?php

namespace App\GraphQL\Validators\Mutation;
use Nuwave\Lighthouse\Validation\Validator;

final class ChangeApplicationSuspendedAtValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'submitted_at' => ['required'],
        ];
    }

    public function messages(): array
    {
        return  [
            'required' => 'Must be submitted',
        ];
    }
}
