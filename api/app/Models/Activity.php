<?php

namespace App\Models;

use App\Enums\ActivityEvent;
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

    public function scopeWhereIsPoolActivity(Builder $query)
    {
        return $query->where('subject_type', Pool::class);
    }

    public function scopeWhereIsAggregatePoolActivity(Builder $query, array $args, Pool $pool)
    {
        $relationMap = [
            AssessmentStep::class => 'assessment_steps',
            PoolCandidate::class => 'pool_candidates',
            PoolSkill::class => 'pool_skill',
        ];

        $poolId = $pool?->id;
        if (! $poolId) {
            return $query->whereRaw('0 = 1');
        }

        return $query->where(function (Builder $subQuery) use ($poolId, $relationMap) {
            $subQuery->where(function ($poolQuery) use ($poolId) {
                $poolQuery->where('subject_type', Pool::class)
                    ->where('subject_id', $poolId);
            });

            foreach ($relationMap as $subjectType => $table) {
                $subQuery->orWhere(function ($relationQuery) use ($poolId, $subjectType, $table) {
                    $relationQuery->where('subject_type', $subjectType)
                        ->whereIn('subject_id', function ($q) use ($poolId, $table) {
                            $q->select('id')->from($table)->where('pool_id', $poolId);
                        });

                    // We only want custom events for pool candidates
                    if ($subjectType === PoolCandidate::class) {
                        $relationQuery->whereNotIn('event', ActivityEvent::coreEvents());
                    }
                });
            }
        });

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
