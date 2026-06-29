<?php

namespace App\Policies;

use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class AssessmentResultPolicy
{
    use ChecksTeamPermissions;
    use HandlesAuthorization;

    /**
     * @return Response|bool
     */
    public function view(User $user, AssessmentResult $assessmentResult)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($assessmentResult->assessmentStep->pool), 'view-team-applicationAssessment');
    }

    /**
     * Determine whether the user can create assessment results.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return Response|bool
     */
    public function create(User $user, $request)
    {
        if (array_key_exists('assessment_step_id', $request)) {
            $parentAssessmentStep = AssessmentStep::with(['pool.team', 'pool.community.team', 'pool.department.team'])->find($request['assessment_step_id']);

            return $this->checkTeamPermission($user, $this->getPoolTeams($parentAssessmentStep->pool), 'update-team-applicationAssessment');
        }

        return false;
    }

    /**
     * Determine whether the user can update and/or delete the assessment result
     *
     * @return Response|bool
     */
    public function update(User $user, AssessmentResult $assessmentResult)
    {
        return $this->checkTeamPermission($user, $this->getPoolTeams($assessmentResult->assessmentStep->pool), 'update-team-applicationAssessment');
    }
}
