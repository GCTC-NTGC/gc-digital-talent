<?php

namespace App\Rules;

use App\Models\AssessmentStep;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AssessmentStepComplete implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $flagBoolean = config('feature.record_of_decision');

        if ($flagBoolean) {
            $assessmentStep = AssessmentStep::find($value)->load('poolSkills');

            // check step has at least one pool skill
            if (count($assessmentStep->poolSkills) === 0) {
                $fail('AssessmentStepMissingSkills');
            }
        }
    }
}
