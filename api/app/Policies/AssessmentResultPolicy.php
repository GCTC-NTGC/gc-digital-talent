<?php

namespace App\Policies;

use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssessmentResultPolicy
{
    use HandlesAuthorization;

    /**
     * NOTE: the logic for PoolCandidatePolicy->viewAssessmentResults should be kept in sync with this function.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, AssessmentResult $assessmentResult)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        $assessmentResult->loadMissing(['assessmentStep.pool.team', 'assessmentStep.pool.community.team']);

        $teamPermission = ! is_null($assessmentResult->assessmentStep->pool->team)
            && $user->isAbleTo('view-team-applicationAssessment', $assessmentResult->assessmentStep->pool->team);
        $communityPermission = ! is_null($assessmentResult->assessmentStep->pool->community->team)
        && $user->isAbleTo('view-team-applicationAssessment', $assessmentResult->assessmentStep->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    /**
     * Determine whether the user can create assessment results.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {
        if (array_key_exists('assessment_step_id', $request)) {
            $parentAssessmentStep = AssessmentStep::with(['pool.team', 'pool.community.team'])->find($request['assessment_step_id']);

            $teamPermission = ! is_null($parentAssessmentStep->pool->team)
                && $user->isAbleTo('update-team-applicationAssessment', $parentAssessmentStep->pool->team);
            $communityPermission = ! is_null($parentAssessmentStep->pool->community->team)
            && $user->isAbleTo('update-team-applicationAssessment', $parentAssessmentStep->pool->community->team);

            return $teamPermission || $communityPermission;
        }

        return false;
    }

    /**
     * Determine whether the user can update and/or delete the assessment result
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, AssessmentResult $assessmentResult)
    {
        $assessmentResult->loadMissing(['assessmentStep.pool.team', 'assessmentStep.pool.community.team']);

        $teamPermission = ! is_null($assessmentResult->assessmentStep->pool->team)
            && $user->isAbleTo('update-team-applicationAssessment', $assessmentResult->assessmentStep->pool->team);
        $communityPermission = ! is_null($assessmentResult->assessmentStep->pool->community->team)
        && $user->isAbleTo('update-team-applicationAssessment', $assessmentResult->assessmentStep->pool->community->team);

        return $teamPermission || $communityPermission;
    }
}
