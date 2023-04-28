<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\PoolCandidate;

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
     * @param  string $attribute
     * @param  mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // short-circuit check off feature flag
        $flagBoolean = config('feature.application_revamp');
        if (!$flagBoolean) {
            return true;
        }

        $poolCandidate = PoolCandidate::findOrFail($value);
        if (!$poolCandidate->education_requirement_option) {
            return false;
        }
        $experiences = $poolCandidate->getEducationRequirementExperiencesAttribute();
        return isset($experiences) && (count($experiences) >= 1);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'EducationRequirementIncomplete';
    }
}
