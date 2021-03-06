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
            'name.en' => [ 'string' ],
            'name.fr' => [ 'string' ],
            'classifications' => [ 'required', 'array', 'size:1' ],
            'classifications.*.id' => [ 'required', 'uuid', 'exists:classifications,id' ],

            // Closing date (Note: Form should return unzoned datetime.)
            'expiry_date' => [ 'required', /*'date_format:Y-m-d H:i:s',*/ 'after:'.$endOfDay ], // TODO: Fix date_format validation

            // Your Impact and Work tasks
            'your_impact.en' => [ 'required', 'string' ],
            'your_impact.fr' => [ 'required', 'string' ],
            'key_tasks.en' => [ 'required', 'string' ],
            'key_tasks.fr' => [ 'required', 'string' ],

            // Essential skills and Asset skills
            'essential_skills' => [ 'required', 'array', 'min:1' ],
            'essential_skills.*.id' => [ 'required', 'uuid', 'exists:skills,id' ],
            'nonessential_skills' => [ 'array' ],
            'nonessential_skills.*.id' => [ 'uuid', 'exists:skills,id' ],

            // Other requirements
            'advertisement_language' => [ 'required', Rule::in(ApiEnums::poolAdvertisementLanguages()) ],
            'security_clearance' => [ 'required', Rule::in(ApiEnums::poolAdvertisementSecurity()) ],
            'advertisement_location.en' => [ 'required_with:advertisement_location.fr', 'string' ],
            'advertisement_location.fr' => [ 'required_with:advertisement_location.en', 'string' ],
        ];
    }

    public function messages(): array
    {
        return [
            'your_impact.en.required' => 'Your Impact" field is required.',
        ];
    }
}
