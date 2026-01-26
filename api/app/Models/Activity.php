<?php

namespace App\Models;

use App\Enums\ActivityLog;
use App\Enums\AssessmentStepType;
use Database\Helpers\TeamHelpers;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\Models\Activity as SpatieActivity;

class Activity extends SpatieActivity
{
    protected $keyType = 'string';

    protected function properties(): Attribute
    {
        return Attribute::get(function ($value) {
            $data = is_array($value) ? $value : json_decode($value, true);

            return [
                'attributes' => $data['attributes'] ?? null,
                'old' => $data['old'] ?? null,
            ];
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
                    ->orWhereJsonContains('properties->attributes->pool_id', $poolId);
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
        $escapedPattern = '%'.$escapeLike($searchTerm).'%';
        $ilikeRaw = "ILIKE ? ESCAPE '\\'";

        return $query->where(function (Builder $mainQuery) use ($searchTerm, $escapedPattern, $ilikeRaw) {
            // Search in properties JSON (whole structure)
            self::scopeWherePropertiesLike($mainQuery, $searchTerm);

            // Causer (User) name
            $mainQuery->orWhere(function ($q) use ($escapedPattern, $ilikeRaw) {
                $q->whereExists(function ($subQ) use ($escapedPattern, $ilikeRaw) {
                    $subQ->selectRaw('1')
                        ->from('users as causer_users')
                        ->whereRaw('activity_log.causer_id = causer_users.id')
                        ->whereRaw('activity_log.causer_type = ?', [User::class])
                        ->where(function ($w) use ($escapedPattern, $ilikeRaw) {
                            $w->whereRaw("causer_users.first_name $ilikeRaw", [$escapedPattern])
                                ->orWhereRaw("causer_users.last_name $ilikeRaw", [$escapedPattern]);
                        });
                });
            });

            // Subject (PoolCandidate) user name
            $mainQuery->orWhere(function ($q) use ($escapedPattern, $ilikeRaw) {
                $q->where('activity_log.subject_type', PoolCandidate::class)
                    ->whereExists(function ($subQ) use ($escapedPattern, $ilikeRaw) {
                        $subQ->selectRaw('1')
                            ->from('pool_candidates as pc_subject')
                            ->join('users as pc_users', 'pc_subject.user_id', '=', 'pc_users.id')
                            ->whereRaw('activity_log.subject_id = pc_subject.id')
                            ->where(function ($w) use ($escapedPattern, $ilikeRaw) {
                                $w->whereRaw("pc_users.first_name $ilikeRaw", [$escapedPattern])
                                    ->orWhereRaw("pc_users.last_name $ilikeRaw", [$escapedPattern]);
                            });
                    });
            });

            // Subject (PoolSkill) skill name (localized, en/fr)
            $mainQuery->orWhere(function ($q) use ($escapedPattern, $ilikeRaw) {
                $q->where('activity_log.subject_type', PoolSkill::class)
                    ->whereExists(function ($subQ) use ($escapedPattern, $ilikeRaw) {
                        $subQ->selectRaw('1')
                            ->from('pool_skill as ps_subject')
                            ->join('skills as ps_skills', 'ps_subject.skill_id', '=', 'ps_skills.id')
                            ->whereRaw('activity_log.subject_id = ps_subject.id')
                            ->where(function ($w) use ($escapedPattern, $ilikeRaw) {
                                $w->whereRaw("ps_skills.name->>'en' $ilikeRaw", [$escapedPattern])
                                    ->orWhereRaw("ps_skills.name->>'fr' $ilikeRaw", [$escapedPattern]);
                            });
                    });
            });

            // Subject (AssessmentStep) title (en/fr) & type (enum and localized display)
            $mainQuery->orWhere(function ($q) use ($escapedPattern, $ilikeRaw, $searchTerm) {
                $q->where('activity_log.subject_type', AssessmentStep::class)
                    ->whereExists(function ($subQ) use ($escapedPattern, $ilikeRaw, $searchTerm) {
                        $subQ->selectRaw('1')
                            ->from('assessment_steps as as_subject')
                            ->whereRaw('activity_log.subject_id = as_subject.id')
                            ->where(function ($w) use ($escapedPattern, $ilikeRaw, $searchTerm) {
                                $w->whereRaw("as_subject.title->>'en' $ilikeRaw", [$escapedPattern])
                                    ->orWhereRaw("as_subject.title->>'fr' $ilikeRaw", [$escapedPattern]);
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

        return $query->whereRaw('properties::text ILIKE ?', ["%$searchTerm%"]);
    }

    public function scopeAuthorizedToViewPoolActivity(Builder $query)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('view-any-poolActivityLog')) {
            return $query;
        }

        if ($user?->isAbleTo('view-team-poolActivityLog')) {
            $teamIds = TeamHelpers::getTeamIdsForPermission($user, 'view-team-poolActivityLog');

            return $query->whereHasMorph(
                'subject',
                [Pool::class],
                function ($poolQuery) use ($teamIds) {
                    return $poolQuery->where(function (Builder $query) use ($teamIds) {
                        $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                            return $query->whereIn('id', $teamIds);
                        });
                    });
                }
            );
        }

        return $query->where('id', null);
    }
}
