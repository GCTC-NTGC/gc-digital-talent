<?php

namespace App\GraphQL\Validators;

use App\Enums\DevelopmentProgramParticipationStatus;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateDevelopmentProgramInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // developmentProgramId validated in the Create/UpdateCommunityInterestInputValidator
            'participationStatus' => [Rule::in(array_column(DevelopmentProgramParticipationStatus::cases(), 'name'))],
            'completionDate' => [
                'date',
                'required_if:participationStatus,'.DevelopmentProgramParticipationStatus::COMPLETED->name,
                'prohibited_unless:participationStatus,'.DevelopmentProgramParticipationStatus::COMPLETED->name,
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'completionDate.required_if' => ApiErrorEnums::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED,
            'completionDate.prohibited_unless' => ApiErrorEnums::DEVELOPMENT_PROGRAM_COMPLETION_DATE_PROHIBITED,
        ];
    }
}
