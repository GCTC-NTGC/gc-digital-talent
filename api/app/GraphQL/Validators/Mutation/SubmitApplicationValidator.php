<?php

namespace App\GraphQL\Validators\Mutation;
use Nuwave\Lighthouse\Validation\Validator;
use App\Rules\PoolClosed;

final class SubmitApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            //
            'pool_id' => [new PoolClosed],
            'submitted_at' => ['prohibited', 'nullable'],
        ];
    }

    public function messages(): array
    {
        return  [
            'submitted_at.prohibited' => 'AlreadySubmitted',
        ];
    }
}
