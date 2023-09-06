<?php

namespace App\GraphQL\Validators;

use App\Rules\SkillNotUsedByActivePool;
use Nuwave\Lighthouse\Validation\Validator;

final class DeleteSkillValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        return [
            'id' => [new SkillNotUsedByActivePool],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return []; // leave empty to not override message bubbling up from the Rule
    }
}
