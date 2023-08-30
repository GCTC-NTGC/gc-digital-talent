<?php

namespace App\GraphQL\Validators\Mutation;

use Carbon\Carbon;
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
            'submitted_at' => ['required', 'before:'.Carbon::now()],
        ];
    }

    public function messages(): array
    {
        return [
            'submitted_at' => 'The application must be submitted.',
        ];
    }
}
