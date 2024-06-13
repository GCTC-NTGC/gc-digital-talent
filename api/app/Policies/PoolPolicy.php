<?php

namespace App\Policies;

use App\Enums\PoolStatus;
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
            $pool->loadMissing('legacyTeam');
            if ($user->isAbleTo('view-team-pool', $pool->legacyTeam)) {
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
        if (array_key_exists('team_id', $request)) {
            $team_id = $request['team_id'];

            // Get the team to check against
            $team = Team::find($team_id);

            // Confirm the user can create pools for the team
            if (! is_null($team)) {
                if ($user->isAbleTo('create-team-pool', $team)) {
                    return true;
                }
            } else {
                return Response::deny('Cannot find a team matching team_id.');
            }
        } else {
            Response::deny('Pool must be associated with a team when it is created.');
        }

        return Response::deny('Cannot create a pool for that team.');
    }

    /**
     * Determine whether the user can create pools.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function duplicate(User $user, $request)
    {
        $existing = Pool::findOrFail($request['id']);

        // Confirm the user can create pools for the team
        if ($user->isAbleTo('create-team-pool', $existing->team)) {
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
        $pool->loadMissing('legacyTeam');

        return $pool->getStatusAttribute() === PoolStatus::DRAFT->name
            && $user->isAbleTo('update-team-draftPool', $pool->legacyTeam);
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
                if ($user->isAbleTo('publish-any-pool')) {
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
        $pool->loadMissing('legacyTeam');

        return $user->isAbleTo('update-team-poolClosingDate', $pool->legacyTeam);
    }

    /**
     * Determine whether the user can close the pool.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function closePool(User $user, Pool $pool)
    {
        $pool->loadMissing('legacyTeam');

        return $user->isAbleTo('update-team-poolClosingDate', $pool->legacyTeam);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function deleteDraft(User $user, Pool $pool)
    {
        if ($pool->getStatusAttribute() === PoolStatus::DRAFT->name) {
            $pool->loadMissing('legacyTeam');

            if ($user->isAbleTo('delete-team-draftPool', $pool->legacyTeam)) {
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
        $pool->loadMissing('legacyTeam');

        return $user->isAbleTo('archive-team-pool', $pool->legacyTeam);
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

        $pool->loadMissing('legacyTeam');

        return $user->isAbleTo('view-team-assessmentPlan', $pool->legacyTeam);
    }

    /**
     * Determine whether the user can view the team members of a specific pools team
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewTeamMembers(User $user, Pool $pool)
    {
        $pool->loadMissing('team');

        return $user->isAbleTo('view-any-teamMembers') || $user->isAbleTo('view-team-teamMembers', $pool->team);
    }
}
