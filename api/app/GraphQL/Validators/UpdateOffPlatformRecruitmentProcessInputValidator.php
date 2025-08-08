<?php

namespace App\GraphQL\Validators;

use App\Enums\HiringPlatform;
use App\Models\OffPlatformRecruitmentProcess;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateOffPlatformRecruitmentProcessInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $existingModel = OffPlatformRecruitmentProcess::find($this->arg('id'));

        // new arguments take priority, otherwise fallback to model value
        $platform = $this->arg('platform') ?? $existingModel->platform;

        return [
            'platform' => [
                Rule::in(array_column(HiringPlatform::cases(), 'name')),
            ],
            'platformOther' => [
                'string',
                'nullable',
                Rule::requiredIf(
                    (
                        $platform === HiringPlatform::OTHER->name
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
