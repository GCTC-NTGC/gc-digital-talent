<?php

namespace App\Listeners;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Laratrust\Events\RoleAdded;
use Laratrust\Events\RoleRemoved;

/**
 * Logs roles added to or removed from a user.
 *
 * Laratrust writes the pivot directly, so the user's own activity logging misses these.
 *  - Subject is the user being affected
 *  - Properties are the user id, role id and, for a team based role, the team id
 */
class LogRoleChange
{
    public function added(RoleAdded $event): void
    {
        $this->log('roleAdded', $event->model, $event->role, $event->team);
    }

    public function removed(RoleRemoved $event): void
    {
        $this->log('roleRemoved', $event->model, $event->role, $event->team);
    }

    private function log(string $eventName, Model $user, int|string $roleId, int|string|null $teamId): void
    {
        $properties = [
            'user_id' => $user->getKey(),
            'role_id' => $roleId,
        ];
        if ($teamId) {
            $properties['team_id'] = $teamId;
        }

        activity()
            ->causedBy(Auth::user())
            ->performedOn($user)
            ->withChanges(['attributes' => $properties])
            ->event($eventName)
            ->log($eventName);
    }
}
