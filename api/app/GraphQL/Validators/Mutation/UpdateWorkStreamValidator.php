<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateWorkStreamValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $id = $this->arg('id');

        return [
            'name.*' => [Rule::unique('work_streams', 'name->*')->ignore($id)],
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
