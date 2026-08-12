<?php

namespace App\GraphQL\Validators;

use App\Rules\SkillExists;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUpdatePersonalExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'personalExperience.skills.connect.*.id' => [new SkillExists()],
            'personalExperience.skills.update.*.id' => [new SkillExists()],
            'personalExperience.skills.sync.*.id' => [new SkillExists()],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
