<?php

namespace App\GraphQL\Validators;

use Nuwave\Lighthouse\Validation\Validator;

class AdvancedOrderByInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            // Ensure exactly one of these is present
            'column' => ['required_without_all:scope,relation', 'prohibits:scope,relation'],
            'scope' => ['required_without_all:column,relation', 'prohibits:column,relation'],
            'relation' => ['required_without_all:column,scope', 'prohibits:column,scope'],

            // Validate the nested relation object if present
            'relation.name' => ['required_with:relation', 'string'],
            'relation.column' => ['required_with:relation', 'string'],

            'direction' => ['in:ASC,DESC'],
            'nulls' => ['nullable', 'in:FIRST,LAST'],
        ];
    }

    public function messages(): array
    {
        return [
            'column.required_without_all' => 'You must provide a column, scope, or relation.',
            'column.prohibits' => 'Column, scope and relation keys are mutually exclusive.',
        ];
    }
}
