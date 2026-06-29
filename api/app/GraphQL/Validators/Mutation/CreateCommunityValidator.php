<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
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
            'community.name.en' => ['required_with:community.name.fr', 'string'],
            'community.name.fr' => ['required_with:community.name.en', 'string'],
            'community.description.en' => ['required_with:community.description.fr', 'string'],
            'community.description.fr' => ['required_with:community.description.en', 'string'],
            'community.mandateAuthority.en' => ['required_with:community.mandateAuthority.fr', 'string'],
            'community.mandateAuthority.fr' => ['required_with:community.mandateAuthority.en', 'string'],
            'community.informationUrl.en' => ['required_with:community.informationUrl.fr', 'string', 'nullable', 'url:http,https'],
            'community.informationUrl.fr' => ['required_with:community.informationUrl.en', 'string', 'nullable', 'url:http,https'],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'community.key.unique' => ErrorCode::KEY_IN_USE->name,
            'community.informationUrl.*.url' => ErrorCode::INVALID_URL->name,
        ];
    }
}
