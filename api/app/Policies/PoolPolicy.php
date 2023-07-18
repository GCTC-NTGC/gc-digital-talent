<?php

namespace App\Policies;

use App\Models\Pool;
use App\Models\User;
use App\Models\Team;
use Database\Helpers\ApiEnums;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Carbon;

class PoolPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo("view-any-pool");
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(?User $user, Pool $pool)
    {
        // Anyone (even unauthenticated) can see published pools.
        if ($pool->getStatusAttribute() !== ApiEnums::POOL_IS_DRAFT) {
            return true;
        }

        // Otherwise, unauthenticated users shouldn't have access (draft).
        if (is_null($user)) {
            return false;
        }

        // If user has elevated admin, can view all pools.
        if ($user->isAbleTo("view-any-pool")) {
            return true;
        }

        // Load team only when needed to check if team owns draft.
        $pool->loadMissing('team');
        return $user->isAbleTo("view-team-pool", $pool->team);
    }

    /**
     * Determine whether the user can view all published pools.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyPublished(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can create pools.
     *
     * @param  \App\Models\User  $user
     * @param  $request: The arguments included in the request, acquired with the injectArgs lighthouse directive
     *      We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {
        $team_id = null;
        if (array_key_exists('team_id', $request)) {
            $team_id = $request['team_id'];
        }

        // Failed to get the new pools team - reject
        // This should only occur if the mutation structure has changed
        if (is_null($team_id)) {
            return Response::deny("Pool must be associated with a team when it is created.");
        }

        // Get the team to check against
        $team = Team::find($team_id);

        // Confirm the user can create pools for the team
        if ($user->isAbleTo("create-team-pool", $team)) {
            return true;
        } else {
            return Response::deny("Cannot create a pool for that team.");
        }
    }

    /**
     * Determine whether the user can create pools.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function duplicate(User $user, $request)
    {
        $existing = Pool::findOrFail($request["id"]);

        // Confirm the user can create pools for the team
        if ($user->isAbleTo("create-team-pool", $existing->team)) {
            return true;
        } else {
            return Response::deny("Cannot duplicate a pool for that team.");
        }
    }

    /**
     * Determine whether the user can update draft pools.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateDraft(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        return $pool->getStatusAttribute() === ApiEnums::POOL_IS_DRAFT
            && $user->isAbleTo("update-team-draftPool", $pool->team);
    }

    /**
     * Determine whether the user can publish the pool.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function publish(User $user, Pool $pool)
    {
        // The status must be DRAFT to be able to publish it.
        if ($pool->getStatusAttribute() !== ApiEnums::POOL_IS_DRAFT) {
            return Response::deny("Pool has already been published.");
        }

        // The closing date must be greater than today's date at the end of day.
        if ($pool->closing_date && $pool->closing_date < Carbon::now()->endOfDay()) {
            return Response::deny("Expiry date must be a future date.");
        }

        return $user->isAbleTo("publish-any-pool");
    }

    /**
     * Determine whether the user can change the pool's closing date.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function changePoolClosingDate(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        return $user->isAbleTo("update-team-poolClosingDate", $pool->team);
    }

    /**
     * Determine whether the user can close the pool.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function closePool(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        return $user->isAbleTo("update-team-poolClosingDate", $pool->team);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        $poolStatus = $pool->getStatusAttribute();
        if ($poolStatus == ApiEnums::POOL_IS_DRAFT) {
            return $user->isAbleTo("delete-team-draftPool", $pool->team);
        } else if ($poolStatus == ApiEnums::POOL_IS_CLOSED) {
            return $user->isAbleTo("delete-team-closedPool", $pool->team);
        } else {
            return Response::deny("You cannot delete a pool with this status.");
        }
    }
}
