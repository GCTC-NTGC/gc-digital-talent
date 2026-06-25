<?php

namespace App\Policies;

use App\Enums\PoolStatus;
use App\Models\Community;
use App\Models\Department;
use App\Models\Pool;
use App\Models\User;
use App\Traits\ChecksTeamPermissions;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class PoolPolicy
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
        return $user->isAbleTo('view-any-pool');
    }

    /**
     * Determine whether the user can view the model.
     *
     * @return Response|bool
     */
    public function view(?User $user, Pool $pool)
    {
        // Anyone (even unauthenticated) can see published pools.
        if ($pool->status !== PoolStatus::DRAFT->name) {
            return true;
        }

        // Otherwise, unauthenticated users shouldn't have access (draft).
        if (is_null($user)) {
            return false;
        }

        // If user has elevated admin, can view all pools.
        if ($user->isAbleTo('view-any-pool')) {
            return true;
        }

        // Check team/community/department permissions for draft pools
        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'view-team-draftPool');
    }

    /**
     * Determine whether the user can view all published pools.
     *
     * @return Response|bool
     */
    public function viewAnyPublished(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can create pools.
     *
     * @param  $request:  The arguments included in the request, acquired with the injectArgs lighthouse directive
     *                   We need to use this because the model hasn't been created yet so we can't read from it
     * @return Response|bool
     */
    public function create(User $user, $request)
    {
        // community could be null, department should not be
        $communityId = isset($request['community_id']) ? $request['community_id'] : null;
        $departmentId = (isset($request['department']) && isset($request['department']['connect'])) ?
            $request['department']['connect']
            : null;

        if (is_null($departmentId)) {
            return false;
        }

        // user can create process through community->team OR department->team
        if ($communityId) {
            $community = Community::with('team')->findOrFail($communityId);
            if (! is_null($community->team) && $user->isAbleTo('create-team-draftPool', $community->team)) {
                // user is a community recruiter or community admin
                return true;
            }
        }

        $department = Department::with('team')->findOrFail($departmentId);
        if (! is_null($department->team) && $user->isAbleTo('create-team-draftPool', $department->team)) {
            // user is a department admin or advisor
            return true;
        }

        return false; // fallback to fail
    }

    /**
     * Determine whether the user can duplicate pools.
     *
     * @param  mixed  $request
     * @return Response|bool
     */
    public function duplicate(User $user, $request)
    {
        /** @var Pool $existing */
        $existing = Pool::with(['team', 'community.team', 'department.team'])->findOrFail($request['id']);

        // Confirm the user can create pools for the team
        if ($this->checkTeamPermission($user, $this->getPoolTeams($existing), 'create-team-draftPool')) {
            return true;
        } else {
            return Response::deny('Cannot duplicate a pool for that team.');
        }
    }

    /**
     * Determine whether the user can update draft pools.
     *
     * @return Response|bool
     */
    public function updateDraft(User $user, Pool $pool)
    {
        return $pool->status === PoolStatus::DRAFT->name
            && $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'update-team-draftPool');
    }

    /**
     * Determine whether the user can update published pools.
     *
     * @return Response|bool
     */
    public function updatePublished(User $user, Pool $pool)
    {
        if (! ($pool->status === PoolStatus::PUBLISHED->name)) {
            return false;
        }

        if ($user->isAbleTo('update-any-publishedPool')) {
            return true;
        }

        // For updatePublished, only community team permission is checked
        return ! is_null($pool->community?->team) && $user->isAbleTo('update-team-publishedPool', $pool->community->team);
    }

    /**
     * Determine whether the user can publish the pool.
     *
     * @return Response|bool
     */
    public function publish(User $user, Pool $pool)
    {
        if ($pool->status !== PoolStatus::DRAFT->name) {
            return Response::deny('Pool has already been published.');
        }

        if ($user->isAbleTo('publish-any-draftPool')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'publish-team-draftPool');
    }

    /**
     * Determine whether the user can change the pool's closing date.
     *
     * @return Response|bool
     */
    public function changePoolClosingDate(User $user, Pool $pool)
    {
        if ($user->isAbleTo('update-any-publishedPool')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'update-team-publishedPool');
    }

    /**
     * Determine whether the user can close the pool.
     *
     * @return Response|bool
     */
    public function closePool(User $user, Pool $pool)
    {
        if ($user->isAbleTo('update-any-publishedPool')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'update-team-publishedPool');
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @return Response|bool
     */
    public function deleteDraft(User $user, Pool $pool)
    {
        if ($pool->status === PoolStatus::DRAFT->name) {
            if ($this->checkTeamPermission($user, $this->getPoolTeams($pool), 'delete-team-draftPool')) {
                return true;
            }
        } else {
            return Response::deny("You cannot delete a Pool once it's been published.");
        }

        return Response::deny('You cannot delete that pool.');
    }

    /**
     * Determine whether the user can archive and un-archive the pool.
     *
     * @return Response|bool
     */
    public function archiveAndUnarchive(User $user, Pool $pool)
    {
        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'archive-team-publishedPool');
    }

    /**
     * Determine whether the user can view pool's assessment plan
     *
     * @return Response|bool
     */
    public function viewAssessmentPlan(User $user, Pool $pool)
    {
        if ($user->isAbleTo('view-any-assessmentPlan')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'view-team-assessmentPlan');
    }

    /**
     * Determine whether the user can view the team members of a specific pools team
     *
     * @return Response|bool
     */
    public function viewTeamMembers(User $user, Pool $pool)
    {
        if ($user->isAbleTo('view-any-poolTeamMembers')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'view-team-poolTeamMembers');
    }

    /**
     * Determine whether the user can view pool's assorted notes
     *
     * @return Response|bool
     */
    public function viewPoolNotes(User $user, Pool $pool)
    {
        if ($user->isAbleTo('view-any-poolNotes')) {
            return true;
        }

        return $this->checkTeamPermission($user, $this->getPoolTeams($pool), 'view-team-poolNotes');
    }
}
