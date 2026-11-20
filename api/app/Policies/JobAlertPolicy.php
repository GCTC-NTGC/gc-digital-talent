<?php

namespace App\Policies;

use App\Models\JobAlert;
use App\Models\User;

class JobAlertPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAbleTo('update-own-user');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobAlert $jobAlert): bool
    {
        return $user->isAbleTo('update-own-user') && $user->id === $jobAlert->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobAlert $jobAlert): bool
    {
        return $user->isAbleTo('update-own-user') && $user->id === $jobAlert->user_id;
    }
}
