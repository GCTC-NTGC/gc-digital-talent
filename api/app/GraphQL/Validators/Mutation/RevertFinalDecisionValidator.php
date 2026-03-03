<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Rules\CanRevertFinalDecision;
use Nuwave\Lighthouse\Validation\Validator;

final class RevertFinalDecisionValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'id' => [
                'required',
                'uuid',
                'exists:pool_candidates,id',
                new CanRevertFinalDecision,
            ],
        ];
    }
}
