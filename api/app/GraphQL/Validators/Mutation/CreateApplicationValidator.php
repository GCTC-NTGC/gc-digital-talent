<?php

namespace App\GraphQL\Validators\Mutation;

use App\Rules\NotAlreadyApplied;
use App\Rules\PoolPublished;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateApplicationValidator extends Validator
{
    public function __construct(public string $poolId)
    {
        $this->poolId = $poolId;
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'poolId' => [new PoolPublished(), new NotAlreadyApplied()],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
