<?php

namespace App\Policies;

use App\Enums\PoolStatus;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class AssessmentStepPolicy
{
    use ChecksTeamPermissions;
    use HandlesAuthorization;

    /**
     * Determine whether the user can create assessments. Same permission as being able to update assessments.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return Response|bool
     */
    public function create(User $user, $request)
    {
        if (array_key_exists('pool_id', $request)) {
            $poolId = $request['pool_id'];
            /** @var ?Pool $pool */
            $pool = Pool::with(['team', 'community.team', 'department.team'])->find($poolId);

            if (! is_null($pool)) {
                $isDraft = $pool->status === PoolStatus::DRAFT->name;
                if ($isDraft && $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'update-team-draftPool')) {
                    return true;
                }
            } else {
                return Response::deny('Cannot find a pool matching pool_id.');
            }
        } else {
            return Response::deny('Assessment step must be associated with a pool when it is created.');
        }

        return Response::deny('Cannot create that assessment step');
    }

    /**
     * Determine whether the user can update or delete the assessment step
     *
     * @return Response|bool
     */
    public function update(User $user, AssessmentStep $assessmentStep)
    {
        return $assessmentStep->pool->status === PoolStatus::DRAFT->name
            && $this->checkTeamPermission($user, $this->getPoolTeams($assessmentStep->pool), 'update-team-draftPool');
    }

    /**
     * Determine whether the user can view assessment step
     *
     * @return Response|bool
     */
    public function view(User $user, AssessmentStep $assessmentStep)
    {
        if ($user->isAbleTo('view-any-assessmentPlan')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($assessmentStep->pool), 'view-team-assessmentPlan');
    }

    /**
     * Determine whether the user can view attached assessment results
     *
     * @return Response|bool
     */
    public function viewAssessmentResults(User $user, AssessmentStep $assessmentStep)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($assessmentStep->pool), 'view-team-applicationAssessment');
    }
}
