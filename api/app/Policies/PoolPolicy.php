<?php

namespace App\Policies;

use App\Models\Pool;
use App\Models\User;
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
        return $user->isAdmin();
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
        return $user->isAdmin();
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
        if ($pool->advertisement_status != ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT) {
            return true;
        }
        // check if a user is logged in or anonymous, anonymous may never look at DRAFT
        if ($user) {
            return $user->isAdmin();
        }
        return false;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Pool $pool)
    {
        return $user->isAdmin();
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

        return $user->isAdmin();
    }

    /**
     * Determine whether the user can change the pool's closing date.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function changePoolClosingDate(User $user)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can close the pool advertisement.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function closePoolAdvertisement(User $user)
    {
        return $user->isAdmin();
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
        if ($pool->getAdvertisementStatusAttribute() !== ApiEnums::POOL_ADVERTISEMENT_IS_DRAFT) {
            return Response::deny("You cannot delete a Pool Advertisement once it's been published.");
        }
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Pool $pool)
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Pool  $pool
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Pool $pool)
    {
        return false;
    }
}
