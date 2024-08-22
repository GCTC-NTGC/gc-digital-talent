<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApiError;
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
            'submitted_at' => ApiError::APPLICATION_NOT_SUBMITTED->localizedMessage(),
        ];
    }
}
