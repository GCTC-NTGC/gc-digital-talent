<?php

namespace App\Services;

use App\Interfaces\PermissionResourceInterface;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PermissionCheckService
{
    private $user;

    public function __construct(User $user = null)
    {
    $this->user = $user;
    }

    public function userCan(string $action, PermissionResourceInterface $resource, string $overrideResourceName = null): bool
    {
        // If the user is not authenticated, they cannot perform any actions.
        if ($this->user === null) {
            // TODO: this is not strictly true! Instead, we should check the Guest user role.
            return false;
        }

        $resourceName = $overrideResourceName ?? $resource->resourceName();

        // If the user has the ability to perform the action on any resource, return true.
        if ($this->user->isAbleTo($action . '-any-' . $resourceName)) {
            return true;
        }
        // If the user has the ability to perform the action on their own resources, and owns this resource, return true.
        if ($resource->ownerId() !== null && $this->user->isAbleTo($action . '-own-' . $resourceName) && $this->user->id === $resource->ownerId()) {
            return true;
        }
        // If the user has the ability to perform the action on a team's resources, and this resource is owned by a team they are a member of, return true.
        foreach ($resource->teams() as $team) {
            if ($this->user->isAbleTo($action . '-team-' . $resourceName, $team)) {
                return true;
            }
        }

        return false;
    }
}
