<?php

namespace App\Policies;

use App\Models\ExperienceSkill;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExperienceSkillPolicy
{
    use HandlesAuthorization;

    public function viewTrashed(User $user, ?ExperienceSkill $experienceSkill)
    {
        // If no model was resolved, there's nothing to authorize.
        if ($experienceSkill === null) {
            return true;
        }

        // Only allow owners view trashed skills
        return $user->id === $experienceSkill->userSkill->user_id;
    }

    public function restore(User $user, ExperienceSkill $experienceSkill)
    {
        return $user->id === $experienceSkill->userSkill->user_id;
    }
}
