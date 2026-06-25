<?php

namespace App\Policies;

use App\Enums\ApplicationStatus;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PoolCandidatePolicy
{
    use ChecksTeamPermissions;
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return Response|bool
     */
    public function viewAny()
    {
        // We don't want anyone to view any application
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return Response|bool
     */
    public function view(User $user, PoolCandidate $poolCandidate)
    {

        // If the user owns the application, we do not care about status
        if ($user->id === $poolCandidate->user_id && $user->isAbleTo('view-own-application')) {
            return true;
        }

        $isDraft = $poolCandidate->isDraft();

        // Exit early if user can view any draft application
        if ($isDraft) {
            return $user->isAbleTo('view-any-draftApplication');
        } else {
            if ($user->isAbleTo('view-any-submittedApplication')) {
                return true;
            }

            if ($this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-submittedApplication')) {
                return true;
            }
        }

        // Noting passed for deny access
        return false;
    }

    /**
     * Determine whether the user can create draft models.
     *
     * @return Response|bool
     */
    public function createDraft(User $user)
    {
        return $user->isAbleTo('create-own-draftApplication');
    }

    /**
     * Determine whether the user can create special applications.
     *
     * @return Response|bool
     */
    public function createSpecialApplication(User $user)
    {
        return $user->isAbleTo('create-any-specialApplication');
    }

    /**
     * Determine whether the user can create models.
     *
     * @return Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo('create-any-application');
    }

    /**
     * Determine whether a user can update the model.
     *
     * @return Response|bool
     */
    public function update(User $user, PoolCandidate $poolCandidate)
    {
        $isOwn = $user->id == $poolCandidate->user_id;
        $isDraft = $poolCandidate->isDraft();
        if ($user->isAbleTo('update-own-draftApplication') && $isOwn && $isDraft) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can submit the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be submitted is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @return Response|bool
     */
    public function submit(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo('submit-own-draftApplication');
    }

    /**
     * Determine whether the user can archive the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be archived is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @return Response|bool
     */
    public function archive(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo('archive-own-submittedApplication');
    }

    /**
     * Determine whether the user can suspend the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be suspended is done during data validation.
     *
     * If using this  policy method, please validate all data as well.
     *
     * @return Response|bool
     */
    public function suspend(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo('suspend-own-submittedApplication');
    }

    /**
     * Determine whether the user can count the number of items in the model.
     *
     * Note: Everyone needs to be able to count applicants
     * for now
     *
     * @return Response|bool
     */
    public function count()
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * Note: This is checking authorization, checking if the application
     * is in a state to be deleted is done during data validation
     *
     * If using this  policy method, please validate all data as well.
     *
     * @return Response|bool
     */
    public function delete(User $user, PoolCandidate $poolCandidate)
    {
        return $user->id === $poolCandidate->user_id && $user->isAbleTo('delete-own-draftApplication');
    }

    public function viewStatus(User $user, PoolCandidate $poolCandidate)
    {
        // Ownership check
        if ($user->id === $poolCandidate->user_id && $user->isAbleTo('view-own-applicationStatus')) {
            return true;
        }

        // Global permissions
        if ($user->isAbleTo('view-any-applicationStatus')) {
            return true;
        }

        // Check team/community/department permissions
        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-applicationStatus');
    }

    /**
     * Determine whether the user can update status fields for a pool candidate
     * Note: this refers to a pool candidate's status and expiry fields together
     *
     * @return Response|bool
     */
    public function updateStatusLegacy(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationStatus')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationStatus');
    }

    // flagging and notes share permissions
    public function updateFlag(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationAssessment');
    }

    public function viewNotes(User $user, PoolCandidate $poolCandidate)
    {
        // Global permissions
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        // Check team/community/department permissions
        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-applicationAssessment');
    }

    public function updateNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationAssessment');
    }

    public function viewAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        // Check team/community/department permissions
        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-applicationAssessment');
    }

    public function updateAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationAssessment');
    }

    public function viewDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationDecision')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-applicationDecision');
    }

    public function updateDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationDecision')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationDecision');
    }

    public function viewPlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationPlacement')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'view-team-applicationPlacement');
    }

    public function updatePlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationPlacement')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationPlacement');
    }

    /**
     * Parent function to handle assessing status update authorization
     * Branches depending on input status
     *
     * @param  array{id: ?string, expiry_date: ?string, application_status: ?string }  $args
     * @return Response|bool
     */
    public function updateStatus(User $user, PoolCandidate $poolCandidate, $args)
    {
        $inputStatus = $args['application_status'] ?? null;
        $inputPlacementType = $args['placement_type'] ?? null;

        if ($inputPlacementType) {
            return $this->updatePlacement($user, $poolCandidate);
        }

        if ($inputStatus) {
            if ($inputStatus === ApplicationStatus::DRAFT->name) {
                return $this->updateStatusLegacy($user, $poolCandidate);
            }

            return $this->updateDecision($user, $poolCandidate);
        }

        $inputExpiryDate = $args['expiry_date'] ?? null;

        // Attempting to update just the expiry date, which falls to updateDecision()
        // For now, expiry date permission should follow the same permission as
        // setting "qualified/unqualified" final decision.
        if ($inputExpiryDate) {
            return $this->updateDecision($user, $poolCandidate);
        }

        return false;
    }

    public function updateReferrals(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationDecision')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team', 'pool.department.team']);

        return $this->checkTeamPermission($user, $this->getPoolTeams($poolCandidate->pool), 'update-team-applicationDecision');
    }
}
