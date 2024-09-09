<?php

namespace App\Rules;

use App\Models\Pool;
use Closure;
use Database\Helpers\ApiErrorEnums;
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
        $activePoolsUsingSkill = Pool::query()
            ->whereCurrentlyActive()
            ->where(function ($query) use ($skillId) {
                $query->whereHas('poolSkills', function ($query) use ($skillId) {
                    return $query->where('skill_id', $skillId);
                });
            })
            ->get();

        if (isset($activePoolsUsingSkill) && count($activePoolsUsingSkill) > 0) {
            $fail(ApiErrorEnums::SKILL_USED_ACTIVE_POSTER);
        }
    }
}
