<?php

namespace App\Policies;

use App\Models\PoolSkill;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PoolSkillPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the model.
     * Simply check if user has permission to update the pool the skill is part of.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PoolSkill $poolSkill)
    {
        return $user->can('updateDraft', $poolSkill->pool);
    }

    /**
     * Determine whether the user can delete the model.
     * Simply check if user has permission to update the pool the skill is part of.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PoolSkill $poolSkill)
    {
        return $user->can('updateDraft', $poolSkill->pool);
    }

    /**
     * Determine whether the user can view assessment steps attached to the pool skill model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAssessmentSteps(User $user, PoolSkill $poolSkill)
    {
        if ($user->isAbleTo('view-any-assessmentPlan')) {
            return true;
        }

        $poolSkill->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolSkill->pool->team) && $user->isAbleTo('view-team-assessmentPlan', $poolSkill->pool->team);
        $communityPermission = ! is_null($poolSkill->pool->community->team) && $user->isAbleTo('view-team-assessmentPlan', $poolSkill->pool->community->team);

        return $teamPermission || $communityPermission;
    }
}
