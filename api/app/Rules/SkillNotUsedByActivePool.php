<?php

namespace App\Rules;

use App\Models\Pool;
use Carbon\Carbon;
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
        $activePools = Pool::where('published_at', '<=', Carbon::now()->toDateTimeString())
            ->where('closing_date', '>', Carbon::now()->toDateTimeString())
            ->get()
            ->load(['essentialSkills', 'nonessentialSkills']);

        foreach ($activePools as $pool) {
            $essentialSkillsIds = $pool->essentialSkills->pluck('id')->toArray();
            $nonessentialSkillsIds = $pool->nonessentialSkills->pluck('id')->toArray();
            $poolSkillsIds = array_merge($essentialSkillsIds, $nonessentialSkillsIds);

            if (in_array($skillId, $poolSkillsIds)) {
                $fail(ApiErrorEnums::SKILL_USED_ACTIVE_POSTER);
            }
        }
    }
}
