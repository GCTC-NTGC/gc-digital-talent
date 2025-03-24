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
            'participationStatus' => ['nullable', Rule::in(array_column(DevelopmentProgramParticipationStatus::cases(), 'name'))],
            'completionDate' => [
                Rule::when(
                    fn (): bool => $this->arg('participationStatus') === DevelopmentProgramParticipationStatus::COMPLETED->name,
                    ['required', 'date']
                ),
                Rule::when(
                    fn (): bool => $this->arg('participationStatus') !== DevelopmentProgramParticipationStatus::COMPLETED->name,
                    ['prohibited']
                ),

            ],
        ];
    }

    public function messages(): array
    {
        return [
            'completionDate.required' => ApiErrorEnums::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED,
            'completionDate.date' => ApiErrorEnums::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED,
            'completionDate.prohibited' => ApiErrorEnums::DEVELOPMENT_PROGRAM_COMPLETION_DATE_PROHIBITED,
        ];
    }
}
