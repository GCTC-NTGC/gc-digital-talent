<?php

namespace App\Policies\Concerns;

use App\Models\User;

trait HandlesOwnershipChecks
{
    /**
     * Generic helper to check if this is an "own" resource (ownership).
     *
     * @param  object  $model  The model instance (must have a user_id or id property or $ownerKey)
     * @param  string  $ability  The permission to check (e.g., 'view-own-employeeProfile')
     * @param  string  $ownerKey  The property on model that represents the owner (default 'user_id')
     */
    protected function isOwner(User $user, $model, string $ability, string $ownerKey = 'user_id'): bool
    {
        // For some models (e.g. User/EmployeeProfile), the PK is the owner
        $ownerId = $model->{$ownerKey} ?? $model->id ?? null;

        return $ownerId !== null && $user->id === $ownerId && $user->isAbleTo($ability);
    }
}
