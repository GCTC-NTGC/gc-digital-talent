<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\Skill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SkillExists implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! Skill::where('id', $value)->exists()) {
            $fail(ErrorCode::SKILL_NOT_FOUND->name);
        }
    }
}
