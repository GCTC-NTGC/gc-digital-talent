<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ApiError;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePublishedPoolInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        return [
            'changeJustification' => ['required', 'string'],
            'specialNote.en' => ['required_with:specialNote.fr', 'string'],
            'specialNote.fr' => ['required_with:specialNote.en', 'string'],
            'aboutUs.en' => ['required_with:aboutUs.fr', 'string', 'nullable'],
            'aboutUs.fr' => ['required_with:aboutUs.en', 'string', 'nullable'],
            'whatToExpectAdmission.en' => ['required_with:whatToExpectAdmission.fr', 'string', 'nullable'],
            'whatToExpectAdmission.fr' => ['required_with:whatToExpectAdmission.en', 'string', 'nullable'],
            'whatToExpect.en' => ['required_with:whatToExpect.fr', 'string', 'nullable'],
            'whatToExpect.fr' => ['required_with:whatToExpect.en', 'string', 'nullable'],
            'yourImpact.en' => ['required_with:yourImpact.fr', 'string'],
            'yourImpact.fr' => ['required_with:yourImpact.en', 'string'],
            'keyTasks.en' => ['required_with:keyTasks.fr', 'string'],
            'keyTasks.fr' => ['required_with:keyTasks.en', 'string'],
        ];
    }

    /**
     * Return the messages
     */
    public function messages(): array
    {
        return [
            'changeJustification.required' => ApiError::PROCESS_CHANGE_JUSTIFICATION_REQUIRED->localizedMessage(),
        ];
    }
}
