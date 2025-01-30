<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use Database\Helpers\ApiErrorEnums;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreatePoolSkillInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'skillId' => [Rule::unique('pool_skill', 'skill_id')->where(fn (Builder $query) => $query->where('pool_id', $this->arg('poolId')))],
        ];
    }

    public function messages(): array
    {
        return [
            'skillId.unique' => ApiErrorEnums::POOL_SKILL_NOT_ESSENTIAL_AND_ASSET_TYPES,
        ];
    }
}
