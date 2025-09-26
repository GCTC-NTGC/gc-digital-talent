<?php

namespace App\GraphQL\Validators;

use App\Enums\DevelopmentProgramParticipationStatus;
use App\Enums\ErrorCode;
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
            'completionDate.required' => ErrorCode::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED->name,
            'completionDate.date' => ErrorCode::DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED->name,
            'completionDate.prohibited' => ErrorCode::DEVELOPMENT_PROGRAM_COMPLETION_DATE_PROHIBITED->name,
        ];
    }
}
