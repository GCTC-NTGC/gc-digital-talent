<?php

namespace App\Policies;

use App\Enums\PoolStatus;
use App\Models\Community;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Carbon;

class PoolPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-pool');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user, Pool $pool)
    {
        // Anyone (even unauthenticated) can see published pools.
        if ($pool->getStatusAttribute() !== PoolStatus::DRAFT->name) {
            return true;
        }

        // Otherwise, unauthenticated users shouldn't have access (draft).
        if (! is_null($user)) {
            // If user has elevated admin, can view all pools.
            if ($user->isAbleTo('view-any-pool')) {
                return true;
            }

            // Load team only when needed to check if team owns draft.
            $pool->loadMissing(['team', 'legacyTeam']);
            $teamPermission = ! is_null($pool->team) && $user->isAbleTo('view-team-draftPool', $pool->team);
            $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('view-team-draftPool', $pool->legacyTeam);

            if ($teamPermission || $legacyTeamPermission) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can view all published pools.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyPublished(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can create pools.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {

        $teamId = isset($request['team_id']) ? $request['team_id'] : null;
        $communityId = isset($request['community_id']) ? $request['community_id'] : null;

        if (is_null($teamId) || is_null($communityId)) {
            return false;
        }

        if ($user->isAbleTo('create-any-pool')) {
            return true; // return early, permission does not exist at the moment
        }

        $team = Team::findOrFail($teamId);
        $community = Community::with('team')->findOrFail($communityId);

        if ($user->isAbleTo('create-team-draftPool', $team)) {
            // user is a legacy pool operator
            return true;
        }

        if (! is_null($community->team) && $user->isAbleTo('create-team-draftPool', $community->team)) {
            // user is a community recruiter or community admin
            return true;
        }

        return false; // fallback to fail
    }

    /**
     * Determine whether the user can duplicate pools.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function duplicate(User $user, $request)
    {
        $existing = Pool::with(['team', 'community.team'])->findOrFail($request['id']);

        // Confirm the user can create pools for the team
        $teamPermission = ! is_null($existing->team) && $user->isAbleTo('create-team-draftPool', $existing->team);
        $legacyTeamPermission = ! is_null($existing->legacyTeam) && $user->isAbleTo('create-team-draftPool', $existing->legacyTeam);
        $communityPermission = ! is_null($existing->community->team) && $user->isAbleTo('create-team-draftPool', $existing->community->team);
        if ($teamPermission || $legacyTeamPermission || $communityPermission) {
            return true;
        } else {
            return Response::deny('Cannot duplicate a pool for that team.');
        }
    }

    /**
     * Determine whether the user can update draft pools.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateDraft(User $user, Pool $pool)
    {
        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('update-team-draftPool', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('update-team-draftPool', $pool->legacyTeam);

        return $pool->getStatusAttribute() === PoolStatus::DRAFT->name
            && ($teamPermission || $legacyTeamPermission);
    }

    /**
     * Determine whether the user can update published pools.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updatePublished(User $user, Pool $pool)
    {
        return $pool->getStatusAttribute() === PoolStatus::PUBLISHED->name
            && $user->isAbleTo('update-any-publishedPool');
    }

    /**
     * Determine whether the user can publish the pool.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function publish(User $user, Pool $pool)
    {
        // The status must be DRAFT to be able to publish it.
        if ($pool->getStatusAttribute() === PoolStatus::DRAFT->name) {
            // The closing date must be greater than today's date at the end of day.
            if ($pool->closing_date && $pool->closing_date > Carbon::now()->endOfDay()) {
                if ($user->isAbleTo('publish-any-draftPool')) {
                    return true;
                }
            } else {
                return Response::deny('Expiry date must be a future date.');
            }
        } else {
            return Response::deny('Pool has already been published.');
        }

        return Response::deny('Cannot publish that pool.');
    }

    /**
     * Determine whether the user can change the pool's closing date.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function changePoolClosingDate(User $user, Pool $pool)
    {
        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('update-team-publishedPool', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('update-team-publishedPool', $pool->legacyTeam);

        return $user->isAbleTo('update-any-publishedPool') || $teamPermission || $legacyTeamPermission;
    }

    /**
     * Determine whether the user can close the pool.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function closePool(User $user, Pool $pool)
    {
        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('update-team-publishedPool', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('update-team-publishedPool', $pool->legacyTeam);

        return $user->isAbleTo('update-any-publishedPool') || $teamPermission || $legacyTeamPermission;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function deleteDraft(User $user, Pool $pool)
    {
        if ($pool->getStatusAttribute() === PoolStatus::DRAFT->name) {
            $pool->loadMissing(['team', 'legacyTeam']);
            $teamPermission = ! is_null($pool->team) && $user->isAbleTo('delete-team-draftPool', $pool->team);
            $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('delete-team-draftPool', $pool->legacyTeam);

            if ($teamPermission || $legacyTeamPermission) {
                return true;
            }
        } else {
            return Response::deny("You cannot delete a Pool once it's been published.");
        }

        return Response::deny('You cannot delete that pool.');
    }

    /**
     * Determine whether the user can archive and un-archive the pool.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function archiveAndUnarchive(User $user, Pool $pool)
    {
        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('archive-team-publishedPool', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('archive-team-publishedPool', $pool->legacyTeam);

        return $teamPermission || $legacyTeamPermission;
    }

    /**
     * Determine whether the user can view pool's assessment plan
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAssessmentPlan(User $user, Pool $pool)
    {
        if ($user->isAbleTo('view-any-assessmentPlan')) {
            return true;
        }

        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('view-team-assessmentPlan', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('view-team-assessmentPlan', $pool->legacyTeam);

        return $teamPermission || $legacyTeamPermission;
    }

    /**
     * Determine whether the user can view the team members of a specific pools team
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewTeamMembers(User $user, Pool $pool)
    {
        $pool->loadMissing(['team', 'legacyTeam']);
        $teamPermission = ! is_null($pool->team) && $user->isAbleTo('view-team-teamMembers', $pool->team);
        $legacyTeamPermission = ! is_null($pool->legacyTeam) && $user->isAbleTo('view-team-teamMembers', $pool->legacyTeam);

        return $user->isAbleTo('view-any-teamMembers') || $teamPermission || $legacyTeamPermission;
    }
}
