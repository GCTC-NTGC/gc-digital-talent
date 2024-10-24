<?php

namespace App\Builders;

use App\Enums\PoolStatus;
use App\Models\Team;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class PoolBuilder extends Builder
{
    public function wherePublished(): self
    {
        return $this->where('published_at', '<=', now());
    }

    public function whereNotClosed(): self
    {
        return $this->where(function ($query) {
            $query->whereNull('closing_date')
                ->orWhere('closing_date', '>', now());
        });
    }

    public function whereClosed(): self
    {
        return $this->where('closing_date', '<=', now());
    }

    public function whereCurrentlyActive(): self
    {
        return $this->wherePublished()->whereNotClosed();
    }

    public function whereNotArchived(): self
    {
        return $this->where(function ($query) {
            $query->whereNull('archived_at')
                ->orWhere('archived_at', '>', now());
        });
    }

    public function name(?string $name): self
    {

        if (! $name) {
            return $this;
        }

        return $this->where(function ($query) use ($name) {
            $term = sprintf('%%%s%%', $name);

            return $query->where('name->en', 'ilike', $term)
                ->orWhere('name->fr', 'ilike', $term);
        });
    }

    public function processNumber(?string $number): self
    {
        if (! $number) {
            return $this;
        }

        return $this->where('process_number', 'ilike', sprintf('%%%s%%', $number));
    }

    public function team(?string $team): self
    {
        if (! $team) {
            return $this;
        }

        return $this->whereHas('legacyTeam', function ($query) use ($team) {
            Team::scopeDisplayName($query, $team);
        });
    }

    public function statuses(?array $statuses): self
    {
        if (! empty($statuses)) {

            $this->where(function ($query) use ($statuses) {

                if (in_array(PoolStatus::ARCHIVED->name, $statuses)) {
                    $query->orWhere('archived_at', '<=', now());
                }

                if (in_array(PoolStatus::CLOSED->name, $statuses)) {
                    $query->orWhere(function ($query) {
                        $query->whereClosed()
                            ->whereNotArchived();
                    });
                }

                if (in_array(PoolStatus::PUBLISHED->name, $statuses)) {
                    $query->orWhere(function ($query) {
                        $query->wherePublished()
                            ->whereNotClosed()
                            ->whereNotArchived();
                    });
                }

                if (in_array(PoolStatus::DRAFT->name, $statuses)) {
                    $query->orWhereNull('published_at');
                }
            });

            return $this;
        }

        // empty defaults to all but archived
        return $this->whereNotArchived();
    }

    public function generalSearch(?string $term): self
    {
        if (! $term) {
            return $this;
        }

        return $this->where(function ($query) use ($term) {
            $query->name($term)
                ->orWhere(function ($query) use ($term) {
                    $query->team($term);
                })->orWhere(function ($query) use ($term) {
                    $query->processNumber($term);
                });
        });
    }

    public function publishingGroups(?array $publishingGroups): self
    {
        if (empty($publishingGroups)) {
            return $this;
        }

        return $this->whereIn('publishing_group', $publishingGroups);
    }

    public function streams(?array $streams): self
    {

        if (empty($streams)) {
            return $this;
        }

        return $this->whereIn('stream', $streams);
    }

    public function whereClassifications(?array $classifications): self
    {
        if (empty($classifications)) {
            return $this;
        }

        return $this->whereHas('classification', function ($query) use ($classifications) {
            $query->where(function ($query) use ($classifications) {
                foreach ($classifications as $classification) {
                    $query->orWhere(function ($query) use ($classification) {
                        $query->where('group', $classification['group'])->where('level', $classification['level']);
                    });
                }
            });
        });

    }

    /**
     * Custom sort to handle issues with how laravel aliases
     * aggregate selects and orderBys for json fields in `lighthouse-php`
     *
     * The column used in the orderBy is `table_aggregate_column->property`
     * But is actually aliased to snake case `table_aggregate_columnproperty`
     */
    public function orderByTeamDisplayName(?array $args): self
    {
        $order = $args['order'] ?? null;
        $locale = $args['locale'] ?? null;

        if ($order && $locale) {
            return $this->withMax('legacyTeam', 'display_name->'.$locale)->orderBy('legacy_team_max_display_name'.$locale, $order);
        }

        return $this;
    }

    public function orderByPoolBookmarks(?array $args): self
    {
        /** @var \App\Models\User|null */
        $user = Auth::user();
        $order = $args['order'] ?? null;

        // order the pools so that the bookmarks connected to current user sticks to the top
        if ($order && $user) {
            return $this->orderBy(
                $user->selectRaw('1')
                    ->join('pool_user_bookmarks', 'pool_user_bookmarks.user_id', '=', 'users.id')
                    ->where('pool_user_bookmarks.user_id', $user->id)
                    ->whereColumn('pool_user_bookmarks.pool_id', 'pools.id')
            );
        }

        return $this;
    }

    /**
     * Filter for pools the user is allowed to admin, based on scopeAuthorizedToAdmin
     */
    public function canAdmin(?bool $canAdmin): self
    {
        if ($canAdmin) {
            return $this->authorizedToAdmin();
        }

        return $this;
    }

    public function authorizedToAdmin(): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        // if they can view any, then nothing filtered out
        if ($user?->isAbleTo('view-any-assessmentPlan')) {
            return $this;
        }

        // if they can view team plans, then filter by teams
        if ($user?->isAbleTo('view-team-assessmentPlan')) {
            return $this->where(function (Builder $query) use ($user) {
                /** Only add teams the user can view pools in to the query for `whereHas`
                 * @var array<\App\Models\Team> $teams
                 */
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-assessmentPlan', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('legacyTeam', function (Builder $query) use ($teamIds) {
                    $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            });
        }

        // the user can't see any assessment plans
        return $this->where('id', null);
    }

    public function authorizedToView(): self
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        // can view any pool - return query with no filters added
        if ($user?->isAbleTo('view-any-pool')) {
            return $this;
        }

        // we might want to add some filters for some pools
        $filterCountBefore = count($this->getQuery()->wheres);
        $this->where(function (Builder $query) use ($user) {
            if ($user?->isAbleTo('view-team-draftPool')) {
                /** Only add teams the user can view pools in to the query for `whereHas`
                 * @var array<\App\Models\Team> $teams
                 */
                $teams = $user->rolesTeams()->get();
                $teamIds = [];
                foreach ($teams as $team) {
                    if ($user->isAbleTo('view-team-draftPool', $team)) {
                        $teamIds[] = $team->id;
                    }
                }

                $query->orWhereHas('legacyTeam', function (Builder $query) use ($teamIds) {
                    $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
                $query->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                    return $query->whereIn('id', $teamIds);
                });
            }

            if ($user?->isAbleTo('view-any-publishedPool')) {
                $query->orWhere('published_at', '<=', now());
            }
        });
        $filterCountAfter = count($this->getQuery()->wheres); // will not increment if an empty "where" subquery above
        if ($filterCountAfter > $filterCountBefore) {
            return $this;
        }

        // fall through - anyone can view a published pool
        return $this->wherePublished();
    }
}
