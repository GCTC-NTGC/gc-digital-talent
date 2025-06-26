<?php

namespace App\Builders;

use App\Enums\CandidateExpiryFilter;
use App\Enums\CandidateSuspendedFilter;
use App\Enums\CitizenshipStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\PoolCandidateStatus;
use App\Enums\PriorityWeight;
use App\Enums\PublishingGroup;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PoolCandidateBuilder extends Builder
{
    /**
     * Scopes the query to return PoolCandidates in a specified community via the relation chain candidate->pool->community
     */
    public function whereHasPoolCandidateCommunity(?string $communityId): self
    {
        if (empty($communityId)) {
            return $this;
        }

        return $this->whereHas('pool', function ($query) use ($communityId) {
            $query->where('community_id', $communityId);
        });
    }

    /**
     * Scopes the query to return PoolCandidates in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public function whereAppliedClassificationsIn(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereHas('pool', function ($query) use ($classifications) {
            $query->whereClassifications($classifications);
        });

    }

    /**
     * Scopes the query to only return PoolCandidates who are available in a pool with one of the specified classifications.
     * If $classifications is empty, this scope will be ignored.
     *
     * @param  array|null  $classifications  Each classification is an object with a group and a level field.
     */
    public function whereQualifiedClassificationsIn(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereAvailable()
            ->whereAppliedClassificationsIn($classifications);
    }

    /**
     * Scope Publishing Groups
     *
     * Restrict a query by specific publishing groups
     */
    public function wherePublishingGroupsIn(?array $publishingGroups): self
    {
        if (empty($publishingGroups)) {
            return $this;
        }

        return $this->whereHas('pool', function (Builder $query) use ($publishingGroups) {
            /** @var \App\Builders\PoolBuilder $query */
            $query->publishingGroups($publishingGroups);
        });
    }

    /**
     * Scope is IT & OTHER Publishing Groups
     *
     * Restrict a query by pool candidates that are for pools
     * containing IT and OTHER publishing groups
     */
    public function whereInTalentSearchablePublishingGroup(): self
    {
        return $this->wherePublishingGroupsIn([
            PublishingGroup::IT_JOBS->name,
            PublishingGroup::OTHER->name,
        ]);

    }

    public function whereOperationalRequirementsIn(?array $operationalRequirements): self
    {
        if (empty($operationalRequirements)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($operationalRequirements) {
            $query->whereOperationalRequirementsIn($operationalRequirements);
        });
    }

    public function whereLocationPreferencesIn(?array $workRegions): self
    {
        if (empty($workRegions)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($workRegions) {
            $query->whereLocationPreferencesIn($workRegions);
        });
    }

    public function whereLanguageAbility(?string $languageAbility): self
    {
        if (empty($languageAbility)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($languageAbility) {
            $query->whereLanguageAbility($languageAbility);
        });
    }

    public function whereAvailableInPools(?array $poolIds): self
    {
        if (empty($poolIds)) {
            return $this;
        }

        return $this->whereIn('pool_id', $poolIds);
    }

    public function whereEquityIn(?array $equity): self
    {
        if (empty($equity)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($equity) {
            $query->whereEquityIn($equity);
        });
    }

    public function whereGeneralSearch(?string $searchTerm): self
    {
        if (empty($searchTerm)) {
            return $this;
        }

        return $this->whereHas('user', function ($userQuery) use ($searchTerm) {
            $userQuery->whereGeneralSearch($searchTerm);
        });
    }

    public function whereName(?string $name): self
    {
        if (empty($name)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($name) {
            $query->whereName($name);
        });
    }

    public function whereEmail(?string $email): self
    {
        if (empty($email)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($email) {
            $query->whereEmail($email);
        });
    }

    public function whereIsGovEmployee(?bool $isGovEmployee): self
    {
        if ($isGovEmployee) {
            $this->whereHas('user', function ($query) {
                $query->whereIsGovEmployee(true);
            });
        }

        return $this;
    }

    public function whereNotesLike(?string $notes): self
    {
        if (empty($notes)) {
            return $this;
        }

        return $this->where('notes', 'ilike', "%{$notes}%");

    }

    public function whereStatusIn(?array $poolCandidateStatuses): self
    {
        if (empty($poolCandidateStatuses)) {
            return $this;
        }

        return $this->whereIn('pool_candidate_status', $poolCandidateStatuses);
    }

    public function whereAvailable(): self
    {
        return $this->whereIn('pool_candidate_status', PoolCandidateStatus::qualifiedEquivalentGroup())
            ->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            })->whereExpiryStatus(CandidateExpiryFilter::ACTIVE->name);
    }

    public function whereHasDiploma(?bool $hasDiploma): self
    {
        if (empty($hasDiploma)) {
            return $this;
        }

        return $this->whereHas('user', function ($query) use ($hasDiploma) {
            $query->whereHasDiploma($hasDiploma);
        });
    }

    public function whereExpiryStatus(?string $expiryStatus): self
    {
        $expiryStatus = isset($expiryStatus) ? $expiryStatus : CandidateExpiryFilter::ACTIVE->name;
        if ($expiryStatus == CandidateExpiryFilter::ACTIVE->name) {
            $this->where(function ($query) {
                $query->whereDate('expiry_date', '>=', date('Y-m-d'))
                    ->orWhereNull('expiry_date');
            });
        } elseif ($expiryStatus == CandidateExpiryFilter::EXPIRED->name) {
            $this->whereDate('expiry_date', '<', date('Y-m-d'));
        }

        return $this;
    }

    public function whereSuspendedStatus(?string $suspendedStatus): self
    {
        $suspendedStatus = isset($suspendedStatus) ? $suspendedStatus : CandidateSuspendedFilter::ACTIVE->name;
        if ($suspendedStatus == CandidateSuspendedFilter::ACTIVE->name) {
            $this->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())
                    ->orWhereNull('suspended_at');
            });
        } elseif ($suspendedStatus == CandidateSuspendedFilter::SUSPENDED->name) {
            $this->where('suspended_at', '<', Carbon::now());
        }

        return $this;
    }

    public function whereNotDraft(): self
    {

        return $this->whereNotNull('submitted_at')
            ->where('submitted_at', '<=', now());
    }

    public function wherePriorityWeightIn(?array $priorityWeights): self
    {
        if (empty($priorityWeights)) {
            return $this;
        }

        return $this->whereExists(function ($query) use ($priorityWeights) {
            $query->select('id')
                ->from('users')
                ->whereColumn('users.id', 'pool_candidates.user_id')
                ->where(function ($query) use ($priorityWeights) {
                    foreach ($priorityWeights as $index => $priorityWeight) {
                        if ($index === 0) {
                            // First iteration must use where instead of orWhere, as seen in filterWorkRegions
                            $query->where('priority_weight', PriorityWeight::weight($priorityWeight));
                        } else {
                            $query->orWhere('priority_weight', PriorityWeight::weight($priorityWeight));
                        }
                    }
                });
        });
    }

    public function whereCandidateCategoryIn(?array $priorityWeights): self
    {
        if (empty($priorityWeights)) {
            return $this;
        }

        return $this->whereExists(function ($query) use ($priorityWeights) {
            $query->selectRaw('null')
                ->from('users')
                ->whereColumn('users.id', 'pool_candidates.user_id')
                ->where(function ($query) use ($priorityWeights) {
                    foreach ($priorityWeights as $priorityWeight) {
                        switch ($priorityWeight) {
                            case PriorityWeight::PRIORITY_ENTITLEMENT->name:
                                $query->orWhereIn(
                                    'priority_verification',
                                    [ClaimVerificationResult::ACCEPTED->name, ClaimVerificationResult::UNVERIFIED->name]
                                );
                                break;

                            case PriorityWeight::VETERAN->name:
                                $query->orWhereIn(
                                    'veteran_verification',
                                    [ClaimVerificationResult::ACCEPTED->name, ClaimVerificationResult::UNVERIFIED->name]
                                );
                                break;

                            case PriorityWeight::CITIZEN_OR_PERMANENT_RESIDENT->name:
                                $query->orWhereIn(
                                    'citizenship',
                                    [CitizenshipStatus::CITIZEN->name, CitizenshipStatus::PERMANENT_RESIDENT->name]
                                );
                                break;

                            case PriorityWeight::OTHER->name:
                                $query->orWhere('citizenship', CitizenshipStatus::OTHER->name);
                                break;
                        }
                    }
                });
        });
    }

    public function wherePositionDurationIn(?array $positionDuration): self
    {

        if (empty($positionDuration)) {
            return $this;
        }

        return $this->whereHas('user', function ($userQuery) use ($positionDuration) {
            $userQuery->wherePositionDurationIn($positionDuration);
        });
    }

    public function whereSkillsAdditive(?array $skills): self
    {
        if (empty($skills)) {
            return $this;
        }

        return $this->addSkillCountSelect($skills)
            ->whereHas('user', function ($userQuery) use ($skills) {
                $userQuery->whereSkillsAdditive($skills);
            });
    }

    public function whereSkillsIntersectional(?array $skills): self
    {
        if (empty($skills)) {
            return $this;
        }

        return $this->addSkillCountSelect($skills)
            ->whereHas('user', function ($query) use ($skills) {
                $query->whereSkillsIntersectional($skills);
            });
    }

    private function addSkillCountSelect(?array $skills): self
    {
        return $this->addSelect([
            'skill_count' => Skill::whereIn('skills.id', $skills)
                ->join('users', 'users.id', '=', 'pool_candidates.user_id')
                ->whereHas('userSkills', function (Builder $query) {
                    $query->whereColumn('user_id', 'users.id');
                })
                ->select(DB::raw('count(*) as skills')),
        ]);
    }

    public function whereSkillCount(): self
    {
        // Checks if the query already has a skill_count select and if it does, it skips adding it again
        $columns = $this->getQuery()->columns;
        $normalizedColumns = array_map(function ($column) {
            // Massage the column name to be a string and only return the column name
            return $column instanceof Expression
                ? Str::afterLast($column->getValue(DB::getQueryGrammar()), 'as ')
                : Str::afterLast($column, 'as ');

        }, $columns ?? []);

        // Check if our array of columns contains the skill_count column
        // If it does, we do not need to add it again
        if (in_array('"skill_count"', $normalizedColumns)) {
            return $this;
        }

        return $this->addSelect([
            'skill_count' => Skill::whereIn('skills.id', [])
                ->select(DB::raw('null as skill_count')),
        ]);
    }

    public function whereQualifiedStreamsIn(?array $streams): self
    {
        if (empty($streams)) {
            return $this;
        }

        // Ensure the PoolCandidates are qualified and available.
        return $this->where(function ($query) {
            $query->whereDate('pool_candidates.expiry_date', '>=', Carbon::now())->orWhereNull('expiry_date'); // Where the PoolCandidate is not expired
        })
            ->whereIn('pool_candidates.pool_candidate_status', PoolCandidateStatus::qualifiedEquivalentGroup()) // Where the PoolCandidate is accepted into the pool and not already placed.
            ->where(function ($query) {
                $query->where('suspended_at', '>=', Carbon::now())->orWhereNull('suspended_at'); // Where the candidate has not suspended their candidacy in the pool
            })
            // Now scope for valid pools, according to streams
            ->whereHas('pool', function ($query) use ($streams) {
                $query->whereWorkStreamsIn($streams);
            });
    }

    public function whereProcessNumber(?string $processNumber): self
    {
        // Early return if no process number was supplied
        if (empty($processNumber)) {
            return $this;
        }

        return $this->whereHas('pool', function (Builder $query) use ($processNumber) {
            /** @var \App\Builders\PoolBuilder $query */
            $query->processNumber($processNumber);
        });
    }

    public function orderByClaimVerification(?array $args): self
    {

        if (isset($args['order'])) {
            $orderWithoutDirection = <<<'SQL'
                CASE
                    WHEN
                        (priority_verification = 'ACCEPTED' OR priority_verification = 'UNVERIFIED')
                    THEN
                        40
                    WHEN
                        (veteran_verification = 'ACCEPTED' OR veteran_verification = 'UNVERIFIED')
                        AND
                        (priority_verification IS NULL OR priority_verification = 'REJECTED')
                    THEN
                        30
                    WHEN
                        (users.citizenship = 'CITIZEN' OR users.citizenship = 'PERMANENT_RESIDENT')
                        AND
                        (
                            (priority_verification IS NULL OR priority_verification = 'REJECTED')
                            OR
                            (veteran_verification IS NULL OR veteran_verification = 'REJECTED')
                        )
                    THEN
                        20
                    ELSE
                        10
                    END
            SQL;

            $this
                ->join('users', 'users.id', '=', 'pool_candidates.user_id')
                ->select('users.citizenship', 'pool_candidates.*');

            if (isset($args['useBookmark']) && $args['useBookmark']) {
                $this->orderBy('is_bookmarked', 'DESC');
            }

            $order = sprintf('%s %s', $orderWithoutDirection, $args['order']);

            $this->orderByRaw($order)->orderBy('submitted_at', 'ASC');
        }

        return $this;
    }

    /**
     * Custom sort to handle issues with how laravel aliases
     * aggregate selects and orderBys for json fields in `lighthouse-php`
     *
     * The column used in the orderBy is `table_aggregate_column->property`
     * But is actually aliased to snake case `table_aggregate_columnproperty`
     */
    public function orderByPoolName(?array $args): self
    {
        extract($args);

        if (isset($order) && isset($locale)) {
            return $this->withMax('pool', 'name->'.$locale)->orderBy('pool_max_name'.$locale, $order);
        }

        return $this;
    }

    /**
     * Scope the query to PoolCandidate's the current user can view
     */
    public function whereAuthorizedToView(?array $args = null): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        $now = Carbon::now()->toDateTimeString();

        // we might want to add some filters for some candidates
        $filterCountBefore = count($this->getQuery()->wheres);
        $query = $this->where(function (Builder $query) use ($user, $now) {
            if ($user?->isAbleTo('view-any-submittedApplication')) {
                $query->orWhere('submitted_at', '<=', $now);
            }

            if ($user?->isAbleTo('view-team-submittedApplication')) {
                $allTeam = $user->rolesTeams()->get();
                $teamIds = $allTeam->filter(function ($team) use ($user) {
                    return $user->isAbleTo('view-team-submittedApplication', $team);
                })->pluck('id');

                $query->orWhere(function (Builder $query) use ($teamIds, $now) {
                    $query->where('submitted_at', '<=', $now)
                        ->whereHas('pool', function (Builder $query) use ($teamIds) {
                            return $query->where(function (Builder $query) use ($teamIds) {
                                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                                    return $query->whereIn('id', $teamIds);
                                })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                                    return $query->whereIn('id', $teamIds);
                                });
                            });
                        });
                });
            }

            if ($user?->isAbleTo('view-own-application')) {
                $query->orWhere('user_id', $user->id);
            }
        });
        $filterCountAfter = count($this->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return $query;
        }

        // fall through - query will return nothing
        return $this->where('id', null);
    }

    // main authorization scope for viewing PoolCandidateAdminView
    // calls needed scoping functions
    public function whereAuthorizedToViewPoolCandidateAdminView(): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (! $user) {
            return $this->where('id', null);
        }

        // fetch all roleTeam relations in one place then reuse
        $allRoleTeams = $user->rolesTeams()->get();

        return $this
            ->andAuthorizedToViewCandidate($user, $allRoleTeams)
            ->andAuthorizedToViewRelatedPool($user, $allRoleTeams)
            ->andAuthorizedToViewRelatedUser($user, $allRoleTeams)
            ->andAuthorizedToViewNotes($user, $allRoleTeams)
            ->andAuthorizedToViewStatus($user, $allRoleTeams);
    }

    // represents the functionality of PoolCandidatePolicy::view()
    private function andAuthorizedToViewCandidate(User $user, \Illuminate\Database\Eloquent\Collection $allRoleTeams): self
    {
        if ($user->isAbleTo('view-any-submittedApplication')) {
            return $this->whereNotNull('submitted_at');
        }

        if ($user->isAbleTo('view-team-submittedApplication')) {
            $teamIds = $allRoleTeams->filter(function ($team) use ($user) {
                return $user->isAbleTo('view-team-draftPool', $team);
            })->pluck('id');

            return $this->where(function (Builder $query) use ($teamIds) {
                $query->whereNotNull('submitted_at')
                    ->whereHas('pool', function (Builder $poolQuery) use ($teamIds) {
                        return $poolQuery->where(function (Builder $poolQuery) use ($teamIds) {
                            $poolQuery->orWhereHas('team', function (Builder $poolQuery) use ($teamIds) {
                                return $poolQuery->whereIn('id', $teamIds);
                            })->orWhereHas('community.team', function (Builder $poolQuery) use ($teamIds) {
                                return $poolQuery->whereIn('id', $teamIds);
                            });
                        });
                    });
            });
        }

        // fall through
        return $this->where('id', null);

    }

    // represents the functionality of PoolPolicy::view()
    private function andAuthorizedToViewRelatedPool(User $user, \Illuminate\Database\Eloquent\Collection $allRoleTeams): self
    {
        if ($user->isAbleTo('view-any-pool')) {
            return $this;
        }

        if ($user->isAbleTo('view-team-draftPool')) {
            $teamIds = $allRoleTeams->filter(function ($team) use ($user) {
                return $user->isAbleTo('view-team-draftPool', $team);
            })->pluck('id');

            return $this->whereHas('pool', function ($poolQuery) use ($teamIds) {
                $poolQuery->orWhereNotNull('published_at');
                $poolQuery->orWhere(function (Builder $query) use ($teamIds) {
                    return $query->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                });
            });
        }

        // fall through - this time to published pools rather than return nothing
        return $this->whereHas('pool', function ($poolQuery) {
            $poolQuery->orWhereNotNull('published_at');
        });
    }

    // represents the functionality of UserPolicy::view()
    private function andAuthorizedToViewRelatedUser(User $user, \Illuminate\Database\Eloquent\Collection $allRoleTeams): self
    {
        if ($user->isAbleTo('view-any-user')) {
            return $this;
        }

        if (
            $user->isAbleTo('view-team-applicantProfile') ||
            $user->isAbleTo('view-team-communityTalent')
        ) {
            $teamIds = $allRoleTeams->filter(function ($team) use ($user) {
                return
                $user->isAbleTo('view-team-applicantProfile', $team) ||
                $user->isAbleTo('view-team-communityTalent', $team);
            })->pluck('id');

            return $this->whereHas('pool', function ($poolQuery) use ($teamIds) {
                $poolQuery->orWhere(function (Builder $query) use ($teamIds) {
                    return $query->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                });
            });

        }

        // fall through
        return $this->where('id', null);
    }

    // represents the functionality of PoolCandidatePolicy::viewNotes()
    private function andAuthorizedToViewNotes(User $user, \Illuminate\Database\Eloquent\Collection $allRoleTeams): self
    {
        if ($user->isAbleTo('view-any-applicationAssessment')) {
            return $this;
        }

        if ($user->isAbleTo('view-team-applicationAssessment')) {
            $teamIds = $allRoleTeams->filter(function ($team) use ($user) {
                return $user->isAbleTo('view-team-applicationAssessment', $team);
            })->pluck('id');

            return $this->whereHas('pool', function ($poolQuery) use ($teamIds) {
                $poolQuery->orWhere(function (Builder $query) use ($teamIds) {
                    return $query->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                });
            });
        }

        // fall through
        return $this->where('id', null);
    }

    // represents the functionality of PoolCandidatePolicy::viewStatus()
    private function andAuthorizedToViewStatus(User $user, \Illuminate\Database\Eloquent\Collection $allRoleTeams): self
    {
        if ($user->isAbleTo('view-any-applicationStatus')) {
            return $this;
        }

        if ($user->isAbleTo('view-team-applicationStatus')) {
            $teamIds = $allRoleTeams->filter(function ($team) use ($user) {
                return $user->isAbleTo('view-team-applicationStatus', $team);
            })->pluck('id');

            return $this->whereHas('pool', function ($poolQuery) use ($teamIds) {
                $poolQuery->orWhere(function (Builder $query) use ($teamIds) {
                    return $query->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                });
            });
        }

        // fall through
        return $this->where('id', null);
    }
}
