<?php

namespace App\GraphQL\Validators;

use App\Enums\HiringPlatform;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateOffPlatformRecruitmentProcessInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'userId' => [
                'required',
                'uuid',
            ],
            'platform' => [
                'required',
                Rule::in(array_column(HiringPlatform::cases(), 'name')),
            ],
            'platformOther' => [
                'string',
                'nullable',
                Rule::requiredIf(
                    (
                        $this->arg('platform') === HiringPlatform::OTHER->name
                    )
                ),
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
