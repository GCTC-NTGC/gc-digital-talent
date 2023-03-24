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
    public function view(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        return $user->isAbleTo("view-any-pool") || $user->isAbleTo("view-team-pool", $pool->team);
    }

    /**
     * Determine whether the user can view a poolAdvertisement. All except DRAFT are viewable to all
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAdvertisement(User $user = null, Pool $pool)
    {
        // Guests and Base Users both have permission to view-any-publishedPoolAdvertisement
        if ($pool->getAdvertisementStatusAttribute() !== ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT) {
            return true;
        }

        if (is_null($user)) {
            return false;
        }

        // PoolAdvertisement is a subset of Pool, so if a user can view the pool, they can view the pool Advertisement.
        return $this->view($user, $pool);
    }

    /**
     * Determine whether the user can view all published poolAdvertisements.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAnyPublishedAdvertisement(User $user = null)
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
        // The team id will be located in a different location depending on if this is called by
        // the createPool or createPoolAdvertisement mutation
        $team_id = null;
        if (array_key_exists('team_id', $request)) {
            $team_id = $request['team_id'];
        } else if (array_key_exists('team', $request) && array_key_exists('connect', $request['team'])) {
            $team_id = $request['team']['connect'];
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
     * Determine whether the user can update draft pools.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function updateDraft(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        return $pool->getAdvertisementStatusAttribute() === ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT
            && $user->isAbleTo("update-team-draftPool", $pool->team);
    }

    /**
     * Determine whether the user can publish the pool advertisement.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function publish(User $user, Pool $pool)
    {
        // The status must be DRAFT to be able to publish it.
        if ($pool->getAdvertisementStatusAttribute() !== ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT) {
            return Response::deny("Pool Advertisement has already been published.");
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
     * Determine whether the user can close the pool advertisement.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function closePoolAdvertisement(User $user, Pool $pool)
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
    public function deleteDraft(User $user, Pool $pool)
    {
        $pool->loadMissing('team');
        if ($pool->getAdvertisementStatusAttribute() !== ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT) {
            return Response::deny("You cannot delete a Pool Advertisement once it's been published.");
        }
        return $user->isAbleTo("delete-team-draftPool", $pool->team);
    }
}
