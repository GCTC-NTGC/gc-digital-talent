<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateCommunityValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'community.key' => [
                'sometimes',
                Rule::unique('communities', 'key')->ignore($this->arg('id'), 'id'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'community.key.unique' => ErrorCode::KEY_IN_USE->name,
        ];
    }
}
