<?php

namespace App\Models;

use App\Enums\ActivityLog;
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
