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

        $poolEssentialSkills = $this->pool
            ->essentialSkills()
            ->whereHas('families', function($query) {
                SkillFamily::scopeTechnical($query);
            })->get()->pluck('id')->toArray();

        if(!count($poolEssentialSkills)) {
            return true;
        }

        $userSkills = [];
        $experiences = $this->collectExperiences($value);

        foreach($experiences as $experience) {
            $userSkills = array_merge($userSkills, $experience->skills()->pluck('skills.id')->toArray());
        }

        if(!count($userSkills)) {
            return false;
        }

        $passes = true;
        foreach($poolEssentialSkills as $skillId) {
            $passes = in_array($skillId, $userSkills);
            if(!$passes) {
                break;
            }
        }

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
    private function collectExperiences($userId)
    {
        $user = User::with([
            'awardExperiences',
            'communityExperiences',
            'educationExperiences',
            'personalExperiences',
            'workExperiences'
        ])->findOrFail($userId);

        $collection = collect();
        $collection = $collection->merge($user->awardExperiences);
        $collection = $collection->merge($user->communityExperiences);
        $collection = $collection->merge($user->educationExperiences);
        $collection = $collection->merge($user->personalExperiences);
        $collection = $collection->merge($user->workExperiences);

        return $collection;
    }
}
