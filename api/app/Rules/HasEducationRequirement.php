<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\PoolCandidate;
use Illuminate\Contracts\Validation\Rule;

class HasEducationRequirement implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $poolCandidate = PoolCandidate::findOrFail($value);
        if (! $poolCandidate->education_requirement_option) {
            return false;
        }
        $experiences = $poolCandidate->educationRequirementExperiences;

        return isset($experiences) && (count($experiences) >= 1);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiError::APPLICATION_EDUCATION_REQUIREMENT_INCOMPLETE->localizedMessage();
    }
}
