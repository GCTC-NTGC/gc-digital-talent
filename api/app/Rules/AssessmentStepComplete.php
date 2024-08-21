<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Enums\AssessmentStepType;
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

        $assessmentStep = AssessmentStep::find($value)->load('poolSkills');

        // check step has at least one pool skill
        if (count($assessmentStep->poolSkills) === 0 && $assessmentStep->type !== AssessmentStepType::APPLICATION_SCREENING->name) {
            $fail(ApiError::ASSESSMENT_STEP_MISSING_SKILLS->localizedErrorMessage());
        }
    }
}
