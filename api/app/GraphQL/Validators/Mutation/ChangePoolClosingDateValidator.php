<?php

namespace App\GraphQL\Validators\Mutation;

use App\Rules\SkillNotDeleted;
use Database\Helpers\ApiErrorEnums;
use Nuwave\Lighthouse\Validation\Validator;

final class ChangePoolClosingDateValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'essential_skills.*.id' => [new SkillNotDeleted],
            'nonessential_skills.*.id' => [new SkillNotDeleted],
        ];
    }

    public function messages(): array
    {
        return [
            'essential_skills.*.id' => ApiErrorEnums::CANNOT_REOPEN_DELETED_SKILL,
            'nonessential_skills.*.id' => ApiErrorEnums::CANNOT_REOPEN_DELETED_SKILL,
        ];
    }
}
