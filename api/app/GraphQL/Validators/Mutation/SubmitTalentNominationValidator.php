<?php

namespace App\GraphQL\Validators\Mutation;

use App\Models\TalentNomination;
use Nuwave\Lighthouse\Validation\Validator;

final class SubmitTalentNominationValidator extends Validator
{
    private $nomination;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(TalentNomination $nomination)
    {
        $this->nomination = $nomination;
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [

        ];
    }

    public function messages(): array
    {
        return [

        ];
    }
}
