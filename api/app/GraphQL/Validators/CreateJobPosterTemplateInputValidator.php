<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

final class CreateJobPosterTemplateInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'referenceId' => ['required', 'string', 'unique:job_poster_templates,reference_id'],
        ];
    }
}
