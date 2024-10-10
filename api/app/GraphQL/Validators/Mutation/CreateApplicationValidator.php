<?php

namespace App\GraphQL\Validators\Mutation;

use App\Rules\NotAlreadyApplied;
use App\Rules\PoolPublished;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateApplicationValidator extends Validator
{
    public function __construct(public string $poolId, public string $userId)
    {
        $this->poolId = $poolId;
        $this->userId = $userId;
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'userId' => [new NotAlreadyApplied($this->poolId)],
            'poolId' => [new PoolPublished],
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
