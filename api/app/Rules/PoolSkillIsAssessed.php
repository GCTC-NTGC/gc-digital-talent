<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Enums\PoolSkillType;
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

        $poolSkill = PoolSkill::find($value)->load('assessmentSteps');

        // check essential pool skills have at least one assessment connected
        if (count($poolSkill->assessmentSteps) === 0 && $poolSkill->type === PoolSkillType::ESSENTIAL->name) {
            $fail(ApiError::POOL_SKILL_NOT_ASSESSED->localizedMessage());
        }
    }
}
