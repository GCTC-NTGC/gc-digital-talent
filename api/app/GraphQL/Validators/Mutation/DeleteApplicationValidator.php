<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ApplicationStatus;
use App\Enums\ErrorCode;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DeleteApplicationValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // application status check, must be one of these to be deleted
            'application_status' => [Rule::in([
                ApplicationStatus::DRAFT->name,
            ])],
        ];
    }

    public function messages(): array
    {
        return [
            'in' => ErrorCode::APPLICATION_NOT_DRAFT->name,
        ];
    }
}
