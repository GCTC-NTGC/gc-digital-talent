<?php

namespace App\Policies;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PoolCandidatePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny()
    {
        // We don't want anyone to view any application
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
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

            $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
            $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-submittedApplication', $poolCandidate->pool->team);
            $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-submittedApplication', $poolCandidate->pool->community->team);
            if ($teamPermission || $communityPermission) {
                return true;
            }
        }

        // Noting passed for deny access
        return false;
    }

    /**
     * Determine whether the user can create draft models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function createDraft(User $user)
    {
        return $user->isAbleTo('create-own-draftApplication');
    }

    /**
     * Determine whether the user can create models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAbleTo('create-any-application');
    }

    /**
     * Determine whether a user can update the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
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
     * @return \Illuminate\Auth\Access\Response|bool
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
     * @return \Illuminate\Auth\Access\Response|bool
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
     * @return \Illuminate\Auth\Access\Response|bool
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
     * @return \Illuminate\Auth\Access\Response|bool
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
     * @return \Illuminate\Auth\Access\Response|bool
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

        // Use helper method to check team/community permissions
        return $this->hasTeamOrCommunityPermission($user, $poolCandidate, 'view-team-applicationStatus');
    }

    /**
     * Determine whether the user can update status fields for a pool candidate
     * Note: this refers to a pool candidate's status and expiry fields together
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateStatusLegacy(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationStatus')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationStatus', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationStatus', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    // flagging and notes share permissions
    public function updateFlag(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function viewNotes(User $user, PoolCandidate $poolCandidate)
    {
        // Global permissions
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        // Use helper method to check team/community permissions
        return $this->hasTeamOrCommunityPermission($user, $poolCandidate, 'view-team-applicationAssessment');
    }

    public function updateNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function viewAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        // Use helper method to check team/community permissions
        return $this->hasTeamOrCommunityPermission($user, $poolCandidate, 'view-team-applicationAssessment');
    }

    public function updateAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function viewDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationDecision')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationDecision', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationDecision', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function updateDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationDecision')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationDecision', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationDecision', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function viewPlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationPlacement')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationPlacement', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationPlacement', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    public function updatePlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationPlacement')) {
            return true;
        }

        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationPlacement', $poolCandidate->pool->team);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationPlacement', $poolCandidate->pool->community->team);

        return $teamPermission || $communityPermission;
    }

    /**
     * Parent function to handle assessing status update authorization
     * Branches depending on input status
     *
     * @param  array{id: ?string, expiry_date: ?string, application_status: ?string }  $args
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateStatus(User $user, PoolCandidate $poolCandidate, $args)
    {
        $inputStatus = $args['application_status'] ?? null;

        if ($inputStatus) {

            $placedStatuses = PoolCandidateStatus::placedGroup();
            $draftOrExpired = [
                PoolCandidateStatus::DRAFT->name,
                PoolCandidateStatus::DRAFT_EXPIRED->name,
                PoolCandidateStatus::EXPIRED->name,
            ];

            if (in_array($inputStatus, $placedStatuses)) {
                return $this->updatePlacement($user, $poolCandidate);
            }

            if (in_array($inputStatus, $draftOrExpired)) {
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

    /**
     * Helper method to check permissions for team/community.
     */
    protected function hasTeamOrCommunityPermission(User $user, PoolCandidate $poolCandidate, string $permission): bool
    {
        // Ensure relationships are eager-loaded to avoid N+1 queries
        $poolCandidate->loadMissing(['pool.team', 'pool.community.team']);
        $pool = $poolCandidate->pool;

        return ($pool->team && $user->isAbleTo($permission, $pool->team))
            || ($pool->community?->team && $user->isAbleTo($permission, $pool->community->team));
    }
}
