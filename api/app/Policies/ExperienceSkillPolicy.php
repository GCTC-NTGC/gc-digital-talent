<?php

namespace App\Policies;

use App\Models\ExperienceSkill;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExperienceSkillPolicy
{
    use HandlesAuthorization;

    public function viewTrashed(User $user, ExperienceSkill $experienceSkill)
    {
        // Only allow owners view trashed skills
        return $user->id === $experienceSkill->userSkill->user_id;
    }
}
