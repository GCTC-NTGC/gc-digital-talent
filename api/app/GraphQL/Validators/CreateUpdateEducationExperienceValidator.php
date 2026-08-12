<?php

namespace App\GraphQL\Validators;

use App\Rules\SkillExists;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUpdateEducationExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'educationExperience.skills.connect.*.id' => [new SkillExists()],
            'educationExperience.skills.update.*.id' => [new SkillExists()],
            'educationExperience.skills.sync.*.id' => [new SkillExists()],
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
