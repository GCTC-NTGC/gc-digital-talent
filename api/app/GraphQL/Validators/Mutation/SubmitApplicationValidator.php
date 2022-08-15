<?php

namespace App\GraphQL\Validators\Mutation;
use Database\Helpers\ApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class SubmitApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            //
            'submitted_at' => ['prohibited', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return  [
            'submitted_at.prohibited' => 'already submitted',
        ];
    }
}
