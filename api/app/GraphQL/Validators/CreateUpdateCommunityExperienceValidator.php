<?php

namespace App\GraphQL\Validators;

use App\Rules\SkillExists;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateUpdateCommunityExperienceValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'communityExperience.skills.connect.*.id' => [new SkillExists()],
            'communityExperience.skills.update.*.id' => [new SkillExists()],
            'communityExperience.skills.sync.*.id' => [new SkillExists()],
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
