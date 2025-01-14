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

            $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
            $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-submittedApplication', $poolCandidate->pool->team);
            $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-submittedApplication', $poolCandidate->pool->legacyTeam);
            $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-submittedApplication', $poolCandidate->pool->community->team);
            if ($teamPermission || $legacyTeamPermission || $communityPermission) {
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
        if ($user->id === $poolCandidate->user_id && $user->isAbleTo('view-own-applicationStatus')) {
            return true;
        }
        if ($user->isAbleTo('view-any-applicationStatus')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationStatus', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-applicationStatus', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationStatus', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    /**
     * Determine whether the user can update status fields for a pool candidate
     * Note: this refers to a pool candidate's status and expiry fields together
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateStatus(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationStatus')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationStatus', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationStatus', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationStatus', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    // bookmarking and notes share permissions
    public function updateBookmark(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function viewNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function updateNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function viewAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function updateAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationAssessment', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function viewDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationDecision')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationDecision', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-applicationDecision', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationDecision', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function updateDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationDecision')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationDecision', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationDecision', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationDecision', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function viewPlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationPlacement')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('view-team-applicationPlacement', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('view-team-applicationPlacement', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('view-team-applicationPlacement', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    public function updatePlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationPlacement')) {
            return true;
        }
        $poolCandidate->loadMissing(['pool.team', 'pool.legacyTeam', 'pool.community.team']);
        $teamPermission = ! is_null($poolCandidate->pool->team) && $user->isAbleTo('update-team-applicationPlacement', $poolCandidate->pool->team);
        $legacyTeamPermission = ! is_null($poolCandidate->pool->legacyTeam) && $user->isAbleTo('update-team-applicationPlacement', $poolCandidate->pool->legacyTeam);
        $communityPermission = ! is_null($poolCandidate->pool?->community?->team) && $user->isAbleTo('update-team-applicationPlacement', $poolCandidate->pool->community->team);

        return $teamPermission || $legacyTeamPermission || $communityPermission;
    }

    /**
     * Parent function to handle assessing status update authorization
     * Branches depending on input status
     *
     * @param  array{id: ?string, expiry_date: ?string, pool_candidate_status: ?string }  $args
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updatePoolCandidateStatusParent(User $user, PoolCandidate $poolCandidate, $args)
    {
        $inputStatus = $args['pool_candidate_status'] ?? null;

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
                return $this->updateStatus($user, $poolCandidate);
            }

            return $this->updateDecision($user, $poolCandidate);
        }

        $inputExpiryDate = $args['expiry_date'] ?? null;

        // attempting to update just the expiry date, which falls to updateStatus()
        if ($inputExpiryDate) {

            return $this->updateStatus($user, $poolCandidate);

        }

        return false;
    }
}
