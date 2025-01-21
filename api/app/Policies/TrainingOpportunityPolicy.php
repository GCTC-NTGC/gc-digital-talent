<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TrainingOpportunityPolicy
{
    use HandlesAuthorization;

    /**
     * Can view the model
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view()
    {
        return true;
    }

    /**
     * Determine whether the user can create training opportunities.
     */
    public function create(User $user)
    {
        return $user->isAbleTo('create-any-trainingOpportunity');
    }

    /**
     * Determine whether the user can update training opportunities, same as creation.
     */
    public function update(User $user)
    {
        return $user->isAbleTo('create-any-trainingOpportunity');
    }
}
