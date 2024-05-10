<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\PoolStatus;
use App\Models\Pool;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
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

        $pool = Pool::find($this->arg('id'));

        return [
            'changeJustification' => [
                Rule::when($pool->status === PoolStatus::PUBLISHED->name, [
                    'required',
                ]),
            ],
            // Optional Fields
            'specialNote.en' => ['required_with:specialNote.fr', 'string'],
            'specialNote.fr' => ['required_with:specialNote.en', 'string'],
            'aboutUs.en' => ['required_with:aboutUs.fr', 'string', 'nullable'],
            'aboutUs.fr' => ['required_with:aboutUs.en', 'string', 'nullable'],
            'whatToExpectAdmission.en' => ['required_with:whatToExpectAdmission.fr', 'string', 'nullable'],
            'whatToExpectAdmission.fr' => ['required_with:whatToExpectAdmission.en', 'string', 'nullable'],
            'whatToExpect.en' => ['required_with:whatToExpect.fr', 'string', 'nullable'],
            'whatToExpect.fr' => ['required_with:whatToExpect.en', 'string', 'nullable'],

            // Always required fields
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
            'changeJustification.required' => ApiErrorEnums::CHANGE_JUSTIFICATION_REQUIRED,
        ];
    }
}
