<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApiError;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateDepartmentValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'department.departmentNumber' => [
                'sometimes',
                Rule::unique('departments', 'department_number')->ignore($this->arg('id'), 'id'),
            ],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'department.departmentNumber.unique' => ApiError::DEPARTMENT_NUMBER_IN_USE->localizedErrorMessage(),
        ];
    }
}
