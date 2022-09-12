<?php

namespace App\GraphQL\Validators\Mutation;

use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class PublishPoolAdvertisementValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $endOfDay = Carbon::now()->endOfDay();
        return [
            // Pool name and classification
            'name.en' => ['string'],
            'name.fr' => ['string'],
            'classifications' => ['required', 'array', 'size:1'],
            'classifications.*.id' => ['required', 'uuid', 'exists:classifications,id'],
            'stream' => ['required', 'string'],

            // Closing date (Note: Form should return unzoned datetime.)
            'expiry_date' => ['required', /*'date_format:Y-m-d H:i:s',*/ 'after:' . $endOfDay], // TODO: Fix date_format validation

            // Your Impact and Work tasks
            'your_impact.en' => ['required', 'string'],
            'your_impact.fr' => ['required', 'string'],
            'key_tasks.en' => ['required', 'string'],
            'key_tasks.fr' => ['required', 'string'],

            // Essential skills and Asset skills
            'essential_skills' => ['required', 'array', 'min:1'],
            'essential_skills.*.id' => ['required', 'uuid', 'exists:skills,id'],
            'nonessential_skills' => ['array'],
            'nonessential_skills.*.id' => ['uuid', 'exists:skills,id'],

            // Other requirements
            'advertisement_language' => ['required', Rule::in(ApiEnums::poolAdvertisementLanguages())],
            'security_clearance' => ['required', Rule::in(ApiEnums::poolAdvertisementSecurity())],
            'is_remote' => ['required', 'boolean'],
            'advertisement_location.en' => ['required_if:is_remote,false', 'required_with:advertisement_location.fr', 'string'],
            'advertisement_location.fr' => ['required_if:is_remote,false', 'required_with:advertisement_location.en', 'string'],
        ];
    }

    public function messages(): array
    {
        return  [
            'required' => ':attribute is required.',
            'exists' => ':attribute does not exist.',
            'expiry_date.after' => 'Expiry Date must be after today.',
            'advertisement_location.*.required_if' => 'You must enter advertisement_location if advertisement is not remote.',
            'advertisement_location.*.required_with' => 'You must enter both french and english fields for the advertisement_location',
            'in' => ':attribute does not contain a valid value.',
            'essential_skills.required' => 'You must have at least 1 one essential skill.'
        ];
    }
}
