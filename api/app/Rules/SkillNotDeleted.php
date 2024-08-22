<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\Skill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SkillNotDeleted implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // fail if the input id is a deleted skill
        $deletedSkillsIds = Skill::onlyTrashed()->get()->pluck('id')->toArray();
        $inputSkillId = $value;

        if (in_array($inputSkillId, $deletedSkillsIds)) {
            $fail(ApiError::SKILL_DELETED->localizedMessage());
        }
    }
}
