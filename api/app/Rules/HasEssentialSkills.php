<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\ExperienceSkill;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class HasEssentialSkills implements Rule
{
    private $application;

    private $pool;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(PoolCandidate $application)
    {
        $this->application = $application;
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
        $this->application = PoolCandidate::find($value) ?? $this->application;
        $this->pool = $this->application->pool;

        $poolEssentialSkillIds = $this->pool
            ->essentialSkills()->where(function ($query) {
                Skill::scopeTechnical($query);
            })->get()->pluck('id');

        if ($poolEssentialSkillIds->isEmpty()) {
            return true;
        }

        $experienceSkills = $this->collectExperiencesSkills($this->application->user_id);

        $passes = $poolEssentialSkillIds->every(function ($poolEssentialSkillIds) use ($experienceSkills) {
            return $experienceSkills->firstWhere('userSkill.skill_id', $poolEssentialSkillIds);
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
        return ApiError::APPLICATION_MISSING_ESSENTIAL_SKILLS->localizedMessage();
    }

    /**
     * Collect all ExperiencesSkills
     */
    private function collectExperiencesSkills($userId)
    {
        $userSkillIds = User::with([
            'userSkills',
        ])
            ->findOrFail($userId)
            ->userSkills()
            ->pluck('id');

        $experienceSkills = ExperienceSkill::whereHas('userSkill', function ($query) use ($userSkillIds) {
            $query->whereIn('id', $userSkillIds);
        })->with('userSkill')->get();

        return $experienceSkills;
    }
}
