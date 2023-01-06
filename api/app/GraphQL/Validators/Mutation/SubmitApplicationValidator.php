<?php

namespace App\GraphQL\Validators\Mutation;
use Nuwave\Lighthouse\Validation\Validator;
use App\Rules\PoolClosed;
use App\Rules\UserProfileComplete;

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
            'user_id' => [new UserProfileComplete],
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
