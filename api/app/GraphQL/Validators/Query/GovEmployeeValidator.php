<?php

namespace App\GraphQL\Validators\Query;

use App\Rules\GovernmentEmail;
use Nuwave\Lighthouse\Validation\Validator;

final class GovEmployeeValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'workEmail' => [new GovernmentEmail],
        ];
    }
}
