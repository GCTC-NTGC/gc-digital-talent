<?php

namespace App\Policies;

use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class TalentRequestPolicy
{
    use ChecksTeamPermissions;
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @return Response|bool
     */
    public function viewAny(User $user)
    {
        return $user->isAbleTo('view-any-talentRequest');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return Response|bool
     */
    public function view(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('view-any-talentRequest')) {
            return true;
        }

        if ($user->isAbleTo('view-own-talentRequest') && $talentRequest->user_id == $user->id) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('view-team-talentRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     * Note: This action is possible for everyone, including anonymous users
     *
     * @return Response|bool
     */
    public function create(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @return Response|bool
     */
    public function update(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('update-any-talentRequest')) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('update-team-talentRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can update tracked users for one or more talent requests.
     *
     * @param  array{ids?: array<int, string>}  $args
     * @return Response|bool
     */
    public function updateTrackedUsers(User $user, array $args)
    {
        if ($user->isAbleTo('update-any-talentRequest')) {
            return true;
        }

        $ids = $args['ids'] ?? (isset($args['id']) ? [$args['id']] : null);

        if (! is_array($ids) || empty($ids)) {
            return false;
        }

        $uniqueIds = array_values(array_unique($ids));

        if (empty($uniqueIds)) {
            return false;
        }

        $trackedUsers = TalentRequestTrackedUser::query()
            ->whereIn('id', $uniqueIds)
            ->with('talentRequest.community.team')
            ->get();

        // Deny when any requested tracked user id cannot be resolved.
        if ($trackedUsers->count() !== count($uniqueIds)) {
            return false;
        }

        $teams = $trackedUsers
            ->pluck('talentRequest.community.team')
            ->filter()
            ->unique('id');

        return $teams->isNotEmpty() && $teams->every(fn ($team) => $this->checkTeamPermission($user, [$team], 'update-team-talentRequest'));
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return Response|bool
     */
    public function delete(User $user, TalentRequest $talentRequest)
    {
        if ($user->isAbleTo('delete-any-talentRequest')) {
            return true;
        }

        if (isset($talentRequest->community->team)) {
            return $user->isAbleTo('delete-team-talentRequest', $talentRequest->community->team);
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @return Response|bool
     */
    public function restore(User $user, TalentRequest $talentRequest)
    {
        return $user->isAbleTo('delete-any-talentRequest');
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @return Response|bool
     */
    public function forceDelete(User $user, TalentRequest $talentRequest)
    {
        return false;
    }
}
