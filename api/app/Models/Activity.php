<?php

namespace App\Models;

use App\Enums\ActivityLog;
use App\Enums\AssessmentStepType;
use Database\Helpers\TeamHelpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity as SpatieActivity;

class Activity extends SpatieActivity
{
    protected $keyType = 'string';

    protected function properties(): Attribute
    {
        return Attribute::get(function () {
            $changes = $this->attribute_changes;

            return collect([
                'attributes' => $changes?->get('attributes'),
                'old' => $changes?->get('old'),
            ]);
        });
    }

    protected function event(): Attribute
    {
        return Attribute::get(function ($value) {
            return ! is_null($value) ? strtoupper($value) : $value;
        });
    }

    public function scopeWhereIsAggregatePoolActivity(Builder $query, array $args, Pool $pool)
    {
        $poolId = $pool->id;
        if (! $poolId) {
            return $query->whereRaw('0 = 1');
        }

        return $query->where('log_name', ActivityLog::PROCESS->value)
            ->where(function (Builder $subQuery) use ($poolId) {
                $subQuery->where(function (Builder $poolQuery) use ($poolId) {
                    $poolQuery->where('subject_type', Pool::class)
                        ->where('subject_id', $poolId);
                })
                    ->orWhereJsonContains('attribute_changes->attributes->pool_id', $poolId);
            });

    }

    public function scopeWhereDate(Builder $query, array $args)
    {
        $start = $args['from'] ?? null;
        $end = $args['to'] ?? null;

        if (! $start && ! $end) {
            return $query;
        }

        return $query
            ->when($start, function ($q) use ($start) {
                $q->where('created_at', '>=', Carbon::parse($start));
            })
            ->when($end, function ($q) use ($end) {
                $q->where('created_at', '<=', Carbon::parse($end));
            });
    }

    public function scopeWhereCauserIn(Builder $query, ?array $ids)
    {
        return $query->when(! empty($ids), function ($q) use ($ids) {
            $q->whereIn('causer_id', $ids)
                ->where('causer_type', User::class);
        });
    }

    public function scopeWherePoolCandidateIn(Builder $query, ?array $ids)
    {
        return $query->when(! empty($ids), function ($q) use ($ids) {
            $q->whereIn('subject_id', $ids)
                ->where('subject_type', PoolCandidate::class);
        });
    }

    public function scopeWhereEventIn(Builder $query, ?array $events)
    {
        return $query->when(! empty($events), function ($q) use ($events) {
            $normalizedEvents = array_map(fn ($e) => strtolower($e), $events);
            $q->whereIn('event', $normalizedEvents);
        });
    }

    /**
     * Apply a comprehensive search to activity logs by:
     * - JSON properties (loose match)
     * - Causer user names
     * - PoolCandidate subject user names
     * - PoolSkill subject skill names (en/fr)
     * - AssessmentStep subject titles (en/fr) and type display names (en/fr).
     *
     * Comprehensive search with joined tables must use whereExists-scoped joins
     * because in Postgres, join aliases (like causer_users) are only valid inside
     * their specific query branch. This prevents "missing FROM-clause entry" errors
     * when searching across multiple relations in OR branches.
     *
     * Always scope each join inside its closure for compatibility.
     */
    public function scopeWhereProcessGeneralSearch(Builder $query, ?string $searchTerm): Builder
    {
        if (! $searchTerm) {
            return $query;
        }

        // Sanitize the input from the user
        $escapeLike = function ($value) {
            return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $value);
        };
        // Backslash is Postgres's default LIKE escape character, so the escaped
        // pattern keeps treating % and _ literally without an explicit ESCAPE clause.
        $escapedPattern = '%'.$escapeLike($searchTerm).'%';

        return $query->where(function (Builder $mainQuery) use ($searchTerm, $escapedPattern) {
            // Search in properties JSON (whole structure)
            self::scopeWherePropertiesLike($mainQuery, $searchTerm);

            // Causer (User) name
            $mainQuery->orWhere(function ($q) use ($escapedPattern) {
                $q->whereExists(function ($subQ) use ($escapedPattern) {
                    $subQ->selectRaw('1')
                        ->from('users as causer_users')
                        ->whereColumn('activity_log.causer_id', 'causer_users.id')
                        ->where('activity_log.causer_type', User::class)
                        ->where(function ($w) use ($escapedPattern) {
                            $w->where('causer_users.first_name', 'ilike', $escapedPattern)
                                ->orWhere('causer_users.last_name', 'ilike', $escapedPattern);
                        });
                });
            });

            // Subject (PoolCandidate) user name
            $mainQuery->orWhere(function ($q) use ($escapedPattern) {
                $q->where('activity_log.subject_type', PoolCandidate::class)
                    ->whereExists(function ($subQ) use ($escapedPattern) {
                        $subQ->selectRaw('1')
                            ->from('pool_candidates as pc_subject')
                            ->join('users as pc_users', 'pc_subject.user_id', '=', 'pc_users.id')
                            ->whereColumn('activity_log.subject_id', 'pc_subject.id')
                            ->where(function ($w) use ($escapedPattern) {
                                $w->where('pc_users.first_name', 'ilike', $escapedPattern)
                                    ->orWhere('pc_users.last_name', 'ilike', $escapedPattern);
                            });
                    });
            });

            // Subject (PoolSkill) skill name (localized, en/fr)
            $mainQuery->orWhere(function ($q) use ($escapedPattern) {
                $q->where('activity_log.subject_type', PoolSkill::class)
                    ->whereExists(function ($subQ) use ($escapedPattern) {
                        $subQ->selectRaw('1')
                            ->from('pool_skill as ps_subject')
                            ->join('skills as ps_skills', 'ps_subject.skill_id', '=', 'ps_skills.id')
                            ->whereColumn('activity_log.subject_id', 'ps_subject.id')
                            ->where(function ($w) use ($escapedPattern) {
                                $w->where('ps_skills.name->en', 'ilike', $escapedPattern)
                                    ->orWhere('ps_skills.name->fr', 'ilike', $escapedPattern);
                            });
                    });
            });

            // Subject (AssessmentStep) title (en/fr) & type (enum and localized display)
            $mainQuery->orWhere(function ($q) use ($escapedPattern, $searchTerm) {
                $q->where('activity_log.subject_type', AssessmentStep::class)
                    ->whereExists(function ($subQ) use ($escapedPattern, $searchTerm) {
                        $subQ->selectRaw('1')
                            ->from('assessment_steps as as_subject')
                            ->whereColumn('activity_log.subject_id', 'as_subject.id')
                            ->where(function ($w) use ($escapedPattern, $searchTerm) {
                                $w->where('as_subject.title->en', 'ilike', $escapedPattern)
                                    ->orWhere('as_subject.title->fr', 'ilike', $escapedPattern);
                                $matchingEnumNames = collect(AssessmentStepType::cases())->filter(function ($enum) use ($searchTerm) {
                                    $display = AssessmentStepType::localizedString($enum->name);

                                    return str_contains(strtolower($display['en'] ?? ''), strtolower($searchTerm))
                                        || str_contains(strtolower($display['fr'] ?? ''), strtolower($searchTerm));
                                })->pluck('name')->values();
                                if ($matchingEnumNames->isNotEmpty()) {
                                    $w->orWhereIn('as_subject.type', $matchingEnumNames);
                                }
                            });
                    });
            });
        });
    }

    public static function scopeWherePropertiesLike(Builder $query, ?string $searchTerm): Builder
    {
        if (! $searchTerm) {
            return $query;
        }

        return $query->where(function (Builder $subQuery) use ($searchTerm) {
            $subQuery->where('properties', 'ilike', "%$searchTerm%")
                ->orWhere('attribute_changes', 'ilike', "%$searchTerm%");
        });
    }

    public function scopeAuthorizedToViewPoolActivity(Builder $query)
    {
        /** @var ?User $user */
        $user = Auth::user();

        if ($user?->isAbleTo('view-any-poolActivityLog')) {
            return $query;
        }

        if ($user?->isAbleTo('view-team-poolActivityLog')) {
            $teamIds = TeamHelpers::getTeamIdsForPermission($user, 'view-team-poolActivityLog');

            $authorizedPoolIds = Pool::query()
                ->where(function ($q) use ($teamIds) {
                    $q->whereHas('team', fn ($sub) => $sub->whereIn('id', $teamIds))
                        ->orWhereHas('community.team', fn ($sub) => $sub->whereIn('id', $teamIds))
                        ->orWhereHas('department.team', fn ($sub) => $sub->whereIn('id', $teamIds));
                })
                ->select('id');

            return $query->where(function (Builder $authQuery) use ($authorizedPoolIds) {
                $authQuery->where(function ($q) use ($authorizedPoolIds) {
                    $q->where('subject_type', (new Pool())->getMorphClass())
                        ->whereIn('subject_id', $authorizedPoolIds);
                })
                    ->orWhere(function ($q) use ($authorizedPoolIds) {
                        foreach ($authorizedPoolIds->get() as $pool) {
                            $q->orWhereJsonContains('attribute_changes->attributes', ['pool_id' => $pool->id]);
                        }
                    });
            });
        }

        return $query->whereRaw('1 = 0');
    }
}
