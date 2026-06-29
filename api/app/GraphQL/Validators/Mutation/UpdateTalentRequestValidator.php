<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;

final class UpdateTalentRequestValidator extends Validator
{
    public function rules(): array
    {
        return [
            'talentRequest.adminNotes' => ['nullable', 'string'],
        ];
    }
}
