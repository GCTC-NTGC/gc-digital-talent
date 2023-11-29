<?php

namespace App\Rules;

use App\Models\PoolSkill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolSkillIsAssessed implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $flagBoolean = config('feature.record_of_decision');

        if ($flagBoolean) {
            $poolSkill = PoolSkill::find($value)->load('assessmentSteps');

            // check pool skill has at least one assessment connected
            if (count($poolSkill->assessmentSteps) === 0) {
                $fail('PoolSkillsWithoutAssessments');
            }
        }
    }
}
