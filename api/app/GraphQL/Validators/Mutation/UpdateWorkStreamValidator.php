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
            'workStream.name.en' => [
                Rule::unique('work_streams', 'name->en')->ignore($id),
            ],
            'workStream.name.fr' => [
                Rule::unique('work_streams', 'name->fr')->ignore($id),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'workStream.name.*.unique' => ErrorCode::WORK_STREAM_NAME_IN_USE->name,
        ];
    }
}
