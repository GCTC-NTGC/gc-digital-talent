<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\Skill;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolSkillsNotDeleted implements ValidationRule
{
    public function __construct(private array $skillsIds) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // fail if the input id is a deleted skill
        $deletedSkillsIds = Skill::onlyTrashed()
            ->whereIn('id', $this->skillsIds)
            ->get();

        if ($deletedSkillsIds->count() > 0) {
            $fail(ApiError::PROCESS_CANNOT_REOPEN_DELETED_SKILL);
        }

    }
}
