<?php

namespace App\GraphQL\Validators;

use App\Enums\DevelopmentProgramParticipationStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateDevelopmentProgramInterestInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'participationStatus' => ['required', Rule::in(array_column(DevelopmentProgramParticipationStatus::cases(), 'name'))],
            'completionDate' => [
                'present', // when updating, must specify either date or null
                Rule::when(
                    fn (): bool => $this->arg('participationStatus') === DevelopmentProgramParticipationStatus::COMPLETED->name,
                    ['date']
                ),
                Rule::when(
                    fn (): bool => $this->arg('participationStatus') !== DevelopmentProgramParticipationStatus::COMPLETED->name,
                    ['prohibited']
                ),
            ],
        ];
    }
}
