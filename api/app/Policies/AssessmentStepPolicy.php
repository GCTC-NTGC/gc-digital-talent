<?php

namespace App\Policies;

use App\Enums\PoolStatus;
use App\Models\AssessmentStep;
use App\Models\Pool;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class AssessmentStepPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create assessments. Same permission as being able to update assessments.
     *
     * @param    $request: The arguments included in the request, acquired with the injectArgs lighthouse directive
     *      We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {
        if (array_key_exists('pool_id', $request)) {
            $poolId = $request['pool_id'];
            $pool = Pool::with('team')->find($poolId);

            if (! is_null($pool)) {
                if ($pool->getStatusAttribute() === PoolStatus::DRAFT->name
                    && $user->isAbleTo('update-team-draftPool', $pool->team))
                {
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
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, AssessmentStep $assessmentStep)
    {
        $assessmentStep->loadMissing('pool.team');

        return $assessmentStep->pool->getStatusAttribute() === PoolStatus::DRAFT->name
        && $user->isAbleTo('update-team-draftPool', $assessmentStep->pool->team);
    }
}
