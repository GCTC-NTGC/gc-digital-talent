<?php

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateWorkStreamInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'name.en' => [Rule::unique('work_streams', 'name->en')],
            'name.fr' => [Rule::unique('work_streams', 'name->fr')],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'name.en.unique' => ErrorCode::WORK_STREAM_NAME_IN_USE->name,
            'name.fr.unique' => ErrorCode::WORK_STREAM_NAME_IN_USE->name,
        ];
    }
}
