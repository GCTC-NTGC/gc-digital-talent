<?php

namespace App\Policies;

use App\Enums\PoolCandidateStatus;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Policies\Concerns\HandlesOwnershipChecks;
use App\Policies\Concerns\HandlesTeamChecks;
use Illuminate\Auth\Access\HandlesAuthorization;

class PoolCandidatePolicy
{
    use HandlesAuthorization;
    use HandlesOwnershipChecks;
    use HandlesTeamChecks;

    protected array $teamRelations = ['pool.team', 'pool.community.team'];

    public function viewAny()
    {
        // We don't want anyone to view any application
        return false;
    }

    public function view(User $user, PoolCandidate $poolCandidate)
    {
        // If the user owns the application, we do not care about status
        if ($this->isOwner($user, $poolCandidate, 'view-own-application')) {
            return true;
        }

        $isDraft = $poolCandidate->isDraft();

        // Exit early if user can view any draft application
        if ($isDraft) {
            return $user->isAbleTo('view-any-draftApplication');
        }

        if ($user->isAbleTo('view-any-submittedApplication')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-team-submittedApplication',
            $this->teamRelations
        );
    }

    public function createDraft(User $user)
    {
        return $user->isAbleTo('create-own-draftApplication');
    }

    public function create(User $user)
    {
        return $user->isAbleTo('create-any-application');
    }

    public function update(User $user, PoolCandidate $poolCandidate)
    {
        return $this->isOwner($user, $poolCandidate, 'update-own-draftApplication');
    }

    public function submit(User $user, PoolCandidate $poolCandidate)
    {
        return $this->isOwner($user, $poolCandidate, 'submit-own-draftApplication');
    }

    public function archive(User $user, PoolCandidate $poolCandidate)
    {
        return $this->isOwner($user, $poolCandidate, 'archive-own-submittedApplication');
    }

    public function suspend(User $user, PoolCandidate $poolCandidate)
    {
        return $this->isOwner($user, $poolCandidate, 'suspend-own-submittedApplication');
    }

    public function count()
    {
        return true;
    }

    public function delete(User $user, PoolCandidate $poolCandidate)
    {
        return $this->isOwner($user, $poolCandidate, 'delete-own-draftApplication');
    }

    public function viewStatus(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationStatus')) {
            return true;
        }

        if ($this->isOwner($user, $poolCandidate, 'view-any-applicationStatus')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-any-applicationStatus',
            $this->teamRelations
        );
    }

    public function updateStatusLegacy(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationStatus')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationStatus',
            $this->teamRelations
        );
    }

    public function updateBookmark(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationAssessment',
            $this->teamRelations
        );
    }

    public function viewNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-team-applicationAssessment',
            $this->teamRelations
        );
    }

    public function updateNotes(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationAssessment',
            $this->teamRelations
        );
    }

    public function viewAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-team-applicationAssessment',
            $this->teamRelations
        );
    }

    public function updateAssessment(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationAssessment')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationAssessment',
            $this->teamRelations
        );
    }

    public function viewDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationDecision')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-team-applicationDecision',
            $this->teamRelations
        );
    }

    public function updateDecision(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationDecision')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationDecision',
            $this->teamRelations
        );
    }

    public function viewPlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('view-any-applicationPlacement')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'view-team-applicationPlacement',
            $this->teamRelations
        );
    }

    public function updatePlacement(User $user, PoolCandidate $poolCandidate)
    {
        if ($user->isAbleTo('update-any-applicationPlacement')) {
            return true;
        }

        return $this->isInTeam(
            $user,
            $poolCandidate,
            'update-team-applicationPlacement',
            $this->teamRelations
        );
    }

    public function updateStatus(User $user, PoolCandidate $poolCandidate, $args)
    {
        $inputStatus = $args['pool_candidate_status'] ?? null;

        if ($inputStatus) {

            $placedStatuses = PoolCandidateStatus::placedGroup();
            $draftOrExpired = [
                PoolCandidateStatus::DRAFT->name,
                PoolCandidateStatus::DRAFT_EXPIRED->name,
                PoolCandidateStatus::EXPIRED->name,
            ];

            if (in_array($inputStatus, $placedStatuses)) {
                return $this->updatePlacement($user, $poolCandidate);
            }

            if (in_array($inputStatus, $draftOrExpired)) {
                return $this->updateStatusLegacy($user, $poolCandidate);
            }

            return $this->updateDecision($user, $poolCandidate);
        }

        $inputExpiryDate = $args['expiry_date'] ?? null;

        // attempting to update just the expiry date, which falls to updateStatusLegacy()
        if ($inputExpiryDate) {

            return $this->updateStatusLegacy($user, $poolCandidate);

        }

        return false;
    }
}
