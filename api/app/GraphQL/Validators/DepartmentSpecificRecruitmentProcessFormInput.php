<?php

namespace App\GraphQL\Validators;

use App\Rules\ArrayConsistentWithDetail;
use Database\Helpers\DirectiveFormsApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DepartmentSpecificRecruitmentProcessFormInput extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'departmentOther' => [
                'required_without:department',
                Rule::prohibitedIf(! empty($this->arg('department'))),
            ],
            'recruitmentProcessLeadEmail' => ['email'],
            'advertisingPlatforms' => [
                new ArrayConsistentWithDetail(DirectiveFormsApiEnums::ADVERTISING_PLATFORM_OTHER, 'advertisingPlatformsOther'),
            ],
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
