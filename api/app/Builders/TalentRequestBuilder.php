<?php

namespace App\Builders;

use App\Models\Department;
use App\Models\User;
use Database\Helpers\TeamHelpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class TalentRequestBuilder extends Builder
{
    public function whereId(?string $id): self
    {
        return $this->when($id, fn ($q) => $q->whereRaw('id::text ILIKE ?', ["%{$id}%"]));
    }

    public function whereFullName(?string $fullName): self
    {
        return $this->when($fullName, fn ($q) => $q->where('full_name', 'ilike', "%{$fullName}%"));
    }

    public function whereEmail(?string $email): self
    {
        return $this->when($email, fn ($q) => $q->where('email', 'ilike', "%{$email}%"));
    }

    public function whereJobTitle(?string $jobTitle): self
    {
        return $this->when($jobTitle, fn ($q) => $q->where('job_title', 'ilike', "%{$jobTitle}%"));
    }

    public function whereAdditionalComments(?string $additionalComments): self
    {
        return $this->when($additionalComments, fn ($q) => $q->where('additional_comments', 'ilike', "%{$additionalComments}%"));
    }

    public function whereAdminNotes(?string $adminNotes): self
    {
        return $this->when($adminNotes, fn ($q) => $q->where('admin_notes', 'ilike', "%{$adminNotes}%"));
    }

    public function whereGeneralSearch(?string $search): self
    {
        return $this->when($search, fn ($q) => $q->where(function ($q) use ($search): void {
            $q->where('full_name', 'ilike', "%{$search}%")
                ->orWhereRaw('id::text ILIKE ?', ["%{$search}%"])
                ->orWhere('email', 'ilike', "%{$search}%")
                ->orWhere('job_title', 'ilike', "%{$search}%")
                ->orWhere('additional_comments', 'ilike', "%{$search}%")
                ->orWhere('admin_notes', 'ilike', "%{$search}%");
        }));
    }

    public function whereTalentRequestStatus(?array $statuses): self
    {
        return $this->when(! empty($statuses), fn ($q) => $q->whereIn('status', $statuses));
    }

    public function whereWorkStreams(?array $streamIds): self
    {
        return $this->when(! empty($streamIds), fn ($q) => $q->whereHas('applicantFilter', fn ($q) => $q
            ->whereHas('qualifiedInWorkStreams', fn ($q) => $q
                ->whereIn('applicant_filter_work_stream.work_stream_id', $streamIds)
            )
        ));
    }

    public function whereDepartments(?array $departmentIds): self
    {
        return $this->when(! empty($departmentIds), fn ($q) => $q->whereHas('department', fn (Builder $q) => Department::scopeDepartmentsByIds($q, $departmentIds)
        ));
    }

    public function whereClassifications(?array $classificationIds): self
    {
        return $this->when(! empty($classificationIds), fn ($q) => $q->whereHas('applicantFilter', fn ($q) => $q
            ->whereHas('qualifiedInClassifications', fn ($q) => $q
                ->whereIn('classifications.id', $classificationIds)
            )
        ));
    }

    public function whereAuthorizedToView(): self
    {
        /** @var User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('view-any-talentRequest')) {
            return $this;
        }

        $filterCountBefore = count($this->getQuery()->wheres);
        $query = $this->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-talentRequest')) {
                $teamIds = TeamHelpers::getTeamIdsForPermission($user, 'view-team-talentRequest');

                $query->orWhereHas('community.team', fn (Builder $q) => $q->whereIn('id', $teamIds));
            }

            if ($user?->isAbleTo('view-own-talentRequest')) {
                $query->orWhere('user_id', $user->id);
            }
        });

        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return $query;
        }

        return $this->where('id', null);
    }

    public function withPolicyEagerLoads(): self
    {
        return $this->with(['community.team']);
    }
}
