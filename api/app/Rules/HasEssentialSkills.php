<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Pool;
use App\Models\SkillFamily;
use App\Models\User;
use Database\Helpers\ApiEnums;

class HasEssentialSkills implements Rule
{
    private $pool;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(Pool $pool)
    {
        $this->pool = $pool;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {

        $poolEssentialSkillIds = $this->pool
            ->essentialSkills()
            ->whereHas('families', function ($query) {
                SkillFamily::scopeTechnical($query);
            })->get()->pluck('id');

        if ($poolEssentialSkillIds->isEmpty()) {
            return true;
        }

        $userSkillIds = $this->collectExperiencesSkillIds($value);

        $passes = $poolEssentialSkillIds->every(function ($poolEssentialSkillIds) use ($userSkillIds) {
            return $userSkillIds->contains($poolEssentialSkillIds);
        });

        return $passes;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiEnums::POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS;
    }

    /**
     * Collect all Experiences
     */
    private function collectExperiencesSkillIds($userId)
    {
        $user = User::with([
            'userSkills'
        ])->findOrFail($userId);
        return $user->userSkills()->pluck('skill_id');
    }
}
