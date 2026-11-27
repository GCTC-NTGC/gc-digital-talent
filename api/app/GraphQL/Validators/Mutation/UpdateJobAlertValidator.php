<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;

final class UpdateJobAlertValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // both fields are optional, but a field that is sent can't be null or blank
        return [
            'jobAlert.name' => ['filled'],
            'jobAlert.isPaused' => ['filled'],
        ];
    }
}
