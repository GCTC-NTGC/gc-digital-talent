<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\Pool;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SkillNotUsedByActivePool implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // validation fails if skill is in use by an active pool
        $skillId = $value;
        $activePoolsUsingSkill = Pool::where((function ($query) {
            Pool::scopeCurrentlyActive($query);
        }))
            ->where(function ($query) use ($skillId) {
                $query->whereHas('poolSkills', function ($query) use ($skillId) {
                    return $query->where('skill_id', $skillId);
                });
            })
            ->get();

        if (isset($activePoolsUsingSkill) && count($activePoolsUsingSkill) > 0) {
            $fail(ApiError::SKILL_DELETE_IN_USE->localizedErrorMessage());
        }
    }
}
