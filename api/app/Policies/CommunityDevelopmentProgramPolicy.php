<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class CommunityDevelopmentProgramPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a record.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return Response|bool
     */
    public function create(User $user, $request)
    {
        $communityId = isset($request['community_id']) ? $request['community_id'] : null;

        if ($communityId) {
            $community = Community::with('team')->findOrFail($communityId);
            if (! is_null($community->team) && $user->isAbleTo('create-team-communityDevelopmentProgram', $community->team)) {
                return true;
            }
        }

        return false; // fallback to fail
    }

    /**
     * Determine whether the user can update the record.
     *
     * @return Response|bool
     */
    public function update(User $user, CommunityDevelopmentProgram $communityDevelopmentProgram)
    {
        $community = Community::with('team')->findOrFail($communityDevelopmentProgram->community_id);

        return $user->isAbleTo('update-team-communityDevelopmentProgram', $community->team);
    }

    /**
     * Determine whether the user can delete the record.
     *
     * @return Response|bool
     */
    public function delete(User $user, CommunityDevelopmentProgram $communityDevelopmentProgram)
    {
        $community = Community::with('team')->findOrFail($communityDevelopmentProgram->community_id);

        return $user->isAbleTo('delete-team-communityDevelopmentProgram', $community->team);
    }
}
