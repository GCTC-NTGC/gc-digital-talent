<?php

namespace App\GraphQL\Validators;

use App\Rules\SkillExists;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUpdateAwardExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'awardExperience.skills.connect.*.id' => [new SkillExists()],
            'awardExperience.skills.update.*.id' => [new SkillExists()],
            'awardExperience.skills.sync.*.id' => [new SkillExists()],
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
