<?php

namespace App\GraphQL\Validators\Mutation;
use Nuwave\Lighthouse\Validation\Validator;
use Carbon\Carbon;

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
            'submitted_at' => ['required', 'before:' . Carbon::now()],
        ];
    }

    public function messages(): array
    {
        return  [
            'submitted_at' => 'Must be submitted',
        ];
    }
}
