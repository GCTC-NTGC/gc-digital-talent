<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserSkillPolicy
{
    use HandlesAuthorization;

    /**
     * The ability to create UserSkill models is the ability to update the User.
     *
     * @param  \App\Models\User  $user
     * @param  $request: The arguments included in the request, acquired with the injectArgs lighthouse directive
     *      We need to use this because the model hasn't been created yet so we can't read from it
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $request)
    {
        $userModel = User::find($request['user_id']);
        return $user->can('update', $userModel);
    }

    /**
     * The ability to update UserSkill models is the ability to update the User.
     *
     * @param  \App\Models\User  $user     *
     * @param  \App\Models\UserSkill  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, $model)
    {
        return $user->can('update', $model->user);
    }

    /**
     * The ability to delete UserSkill models is the ability to update the User.
     *
     * @param  \App\Models\User  $user     *
     * @param  \App\Models\UserSkill  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, $model)
    {
        return $user->can('update', $model->user);
    }
}
