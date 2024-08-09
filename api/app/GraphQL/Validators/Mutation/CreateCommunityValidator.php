<?php

namespace App\GraphQL\Validators\Mutation;

use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateCommunityValidator extends Validator
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
            'community.key.unique' => 'CommunityKeyInUse',
        ];
    }
}
