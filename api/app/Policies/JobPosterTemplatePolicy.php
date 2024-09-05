<?php

namespace App\Policies;

use App\Models\JobPosterTemplate;
use App\Models\User;

class JobPosterTemplatePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, JobPosterTemplate $jobPosterTemplate): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAbleTo('create-any-jobPosterTemplate');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, JobPosterTemplate $jobPosterTemplate): bool
    {
        return $user->isAbleTo('update-any-jobPosterTemplate');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, JobPosterTemplate $jobPosterTemplate): bool
    {
        return $user->isAbleTo('delete-any-jobPosterTemplate');
    }
}
