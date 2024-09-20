<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Rules\SkillLevelRequiredIfEssential;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateJobPosterTemplateInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'referenceId' => [
                'sometimes',
                Rule::unique('job_poster_templates', 'reference_id')->ignore($this->arg('id'), 'id'),
            ],
            'skills.connect.*.requiredLevel' => [new SkillLevelRequiredIfEssential],
            'skills.sync.*.requiredLevel' => [new SkillLevelRequiredIfEssential],
        ];
    }
}
