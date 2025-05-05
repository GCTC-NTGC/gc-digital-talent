<?php

namespace App\GraphQL\Validators\Query;

use App\Rules\GovernmentEmailRegex;
use App\Rules\IsVerifiedGovEmployee;
use Nuwave\Lighthouse\Validation\Validator;

final class GovEmployeeProfileValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'workEmail' => [new GovernmentEmailRegex, new IsVerifiedGovEmployee],
        ];
    }
}
