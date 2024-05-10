<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\PoolStatus;
use App\Models\Pool;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePublishedPoolInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        $pool = Pool::find($this->arg('id'));

        return [
            'changeJustification' => [
                Rule::when($pool->status === PoolStatus::PUBLISHED->name, [
                    'required',
                ]),
            ],
        ];
    }

    /**
     * Return the messages
     */
    public function messages(): array
    {
        return [
            'changeJustification.required' => ApiErrorEnums::CHANGE_JUSTIFICATION_REQUIRED,
        ];
    }
}
