<?php

namespace App\GraphQL\Validators;

use App\Enums\DirectiveForms\AdvertisingPlatform;
use App\Rules\ArrayConsistentWithDetail;
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
                new ArrayConsistentWithDetail(AdvertisingPlatform::OTHER->name, 'advertisingPlatformsOther'),
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
