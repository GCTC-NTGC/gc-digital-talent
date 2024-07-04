<?php

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

final class RoleInputValidator extends Validator
{
    public function __construct() {}

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'attach.*.roleId' => [
                'distinct',
            ],
            'detach.*.roleId' => [
                'distinct',
            ],
        ];
    }
}
