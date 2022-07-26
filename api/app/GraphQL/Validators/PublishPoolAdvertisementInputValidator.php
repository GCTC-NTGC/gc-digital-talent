<?php

namespace App\GraphQL\Validators;

use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class PublishPoolAdvertisementInputValidator extends Validator
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
            'name.en' => [ 'required', 'string' ],
            'name.fr' => [ 'required', 'string' ],
            'classifications.sync' => [ 'required', 'array', 'min:1' ],
            'classifications.sync.*' => [ 'required', 'uuid', 'exists:classifications,id' ],

            // Closing date (Note: Form should return unzoned datetime.)
            'expiryDate' => [ 'required', /*'date_format:Y-m-d H:i:s',*/ 'after:'.$endOfDay ], // TODO: Fix date_format validation

            // Your Impact and Work tasks
            'yourImpact.en' => [ 'required', 'string' ],
            'yourImpact.fr' => [ 'required', 'string' ],
            'keyTasks.en' => [ 'required', 'string' ],
            'keyTasks.fr' => [ 'required', 'string' ],

            // Essential skills and Asset skills
            'essentialSkills.sync' => [ 'required', 'array', 'min:1' ],
            'essentialSkills.sync.*' => [ 'required', 'uuid', 'exists:skills,id' ],
            'nonessentialSkills.sync' => [ 'required', 'array', 'min:1' ],
            'nonessentialSkills.sync.*' => [ 'required', 'uuid', 'exists:skills,id' ],

            // Other requirements
            'advertisementLanguage' => [ 'required', Rule::in(ApiEnums::poolAdvertisementLanguages()) ],
            'securityClearance' => [ 'required', Rule::in(ApiEnums::poolAdvertisementSecurity()) ],
            'advertisementLocation.en' => [ 'required', 'string' ],
            'advertisementLocation.fr' => [ 'required', 'string' ],
        ];
    }
}
