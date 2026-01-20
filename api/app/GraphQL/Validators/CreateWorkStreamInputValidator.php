<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateWorkStreamInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'name.*' => ['required', Rule::unique('work_streams', 'name->*')],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'name.*.unique' => ErrorCode::WORK_STREAM_NAME_IN_USE->name,
        ];
    }
}
