<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Models\Pool;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class ChangePoolClosingDateValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        $id = $this->arg('id');
        $pool = Pool::find($id);

        return [
            'id' => ['uuid', 'required'],
            'newClosingDate' => [
                'after:today',
                Rule::when(! is_null($pool) && $pool->closing_date, ['after_or_equal:'.$pool?->closing_date]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'closingDate.after' => ApiErrorEnums::PROCESS_CLOSING_DATE,
            'closingDate.after_or_equal' => ApiErrorEnums::PROCESS_CLOSING_DATE,
        ];
    }
}
