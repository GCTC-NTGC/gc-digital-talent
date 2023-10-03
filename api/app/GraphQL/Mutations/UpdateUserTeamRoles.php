<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Models\Team;
use Illuminate\Support\Facades\DB;

final class UpdateUserTeamRoles
{
    /**
     * Duplicates a pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $team = Team::find($args['teamId']); // Even if we don't use the whole team object, ensure it exists.
        $user = User::find($args['userId']);

        // Assemble a roleAssignments object which makes sense to User->setRoleAssignmentsInputAttribute
        // Do this by inserting the team id into each attach/detach/sync key of role assignments
        $roleAssignments = $args['roleAssignments'];
        foreach ($roleAssignments as $key => $value) {
            $roleAssignments[$key]['team'] = $team->id;
        }
        $user->setRoleAssignmentsInputAttribute($roleAssignments);

        return $team->fresh();
    }
}
