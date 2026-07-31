<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Rules\ArrayIsUnique;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateUserSkillRankingsInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $rules = ['nullable', 'array', 'exists:skills,id', new ArrayIsUnique()];

        return [
            'topTechnicalSkillsRanked' => $rules,
            'topBehaviouralSkillsRanked' => $rules,
            'improveTechnicalSkillsRanked' => $rules,
            'improveBehaviouralSkillsRanked' => $rules,
        ];
    }

    public function messages(): array
    {
        return [
            'topTechnicalSkillsRanked.exists' => ErrorCode::SKILL_NOT_FOUND->name,
            'topBehaviouralSkillsRanked.exists' => ErrorCode::SKILL_NOT_FOUND->name,
            'improveTechnicalSkillsRanked.exists' => ErrorCode::SKILL_NOT_FOUND->name,
            'improveBehaviouralSkillsRanked.exists' => ErrorCode::SKILL_NOT_FOUND->name,
        ];
    }
}
