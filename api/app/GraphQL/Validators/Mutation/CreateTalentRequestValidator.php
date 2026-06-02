<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\TalentRequestPositionType;
use App\Enums\TalentRequestReason;
use App\Rules\GovernmentEmailRegex;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateTalentRequestValidator extends Validator
{
    public function rules(): array
    {
        return [
            'talentRequest.fullName' => ['required', 'string', 'max:255'],
            'talentRequest.email' => ['required', 'email', new GovernmentEmailRegex(), 'max:255'],
            'talentRequest.jobTitle' => ['required', 'string', 'max:255'],
            'talentRequest.additionalComments' => ['nullable', 'string'],
            'talentRequest.hrAdvisorEmail' => ['nullable', 'email', 'max:255'],
            'talentRequest.managerJobTitle' => ['required', 'string', 'max:255'],
            'talentRequest.positionType' => [
                'required',
                Rule::in(array_column(TalentRequestPositionType::cases(), 'name')),
            ],
            'talentRequest.reason' => [
                'required',
                Rule::in(array_column(TalentRequestReason::cases(), 'name')),
            ],
            'talentRequest.initialResultCount' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'talentRequest.positionType.in' => 'The selected position type is invalid.',
            'talentRequest.reason.in' => 'The selected reason is invalid.',
        ];
    }
}
