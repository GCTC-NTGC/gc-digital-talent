<?php

namespace App\Models;

use App\Observers\EmployeeWFAObserver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

/**
 * Class EmployeeWFA
 *
 * @property string $id
 * @property ?string $wfa_interest
 * @property ?\Illuminate\Support\Carbon $wfa_date
 * @property ?\Illuminate\Support\Carbon $wfa_updated_at
 */
class EmployeeWFA extends Model
{
    protected $table = 'users';

    protected $keyType = 'string';

    protected $casts = [
        'wfa_date' => 'datetime',
        'wfa_updated_at' => 'datetime',
    ];

    protected $fillable = [
        'wfa_interest',
        'wfa_date',
    ];

    protected static function booted(): void
    {
        EmployeeWFA::observe(EmployeeWFAObserver::class);
    }

    /** @return HasOne<User, $this> */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id')->select([
            'id',
            'first_name',
            'last_name',
            'computed_classification',
            'computed_department',
            'is_woman',
            'is_visible_minority',
            'has_disability',
            'indigenous_communities',
            'has_priority_entitlement',
            'priority_number',
            'priority_weight',
            'citizenship',
            'armed_forces_status',
            'estimated_language_ability',
            'preferred_language_for_interview',
            'preferred_language_for_exam',
            'first_official_language',
            'second_language_exam_completed',
            'second_language_exam_validity',
            'location_preferences',
            'location_exemptions',
            'work_email',
        ]);
    }

    public function scopeWhereAuthorizedToView(Builder $query, ?array $args)
    {

        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        if ($user->isAbleTo('view-any-employeeWFA')) {
            return $query;
        }

        $filterCountBefore = count($query->getQuery()->wheres);
        $query->where(function (Builder $query) use ($user) {
            if ($user->isAbleTo('view-own-employeeWFA')) {
                $query->orWhere('user_id', $user->id);
            }

            if ($user->isAbleTo('view-team-employeeWFA')) {
                $query->orWhere(function (Builder $query) use ($user) {
                    $allCommunityTeams = $user->rolesTeams()
                        ->where('teamable_type', "App\Models\Community")
                        ->get();

                    $teamIds = $allCommunityTeams
                        ->filter(fn ($team) => $user->isAbleTo('view-team-employeeWFA', $team))->pluck('teamable_id');

                    print_r($teamIds);

                    $query->whereHas('user', function (Builder $userQuery) use ($teamIds) {
                        $userQuery->orWhereHas('communityInterests', function (Builder $commInterestQuery) use ($teamIds) {
                            // User has expressed interest in community
                            $commInterestQuery->whereIn('community_id', $teamIds);
                        })->orWhereHas('poolCandidates', function (Builder $candidateQuery) use ($teamIds) {
                            // User has applied to a process in community
                            $candidateQuery->whereHas('pool', function ($poolQuery) use ($teamIds) {
                                $poolQuery->where(function (Builder $query) use ($teamIds) {
                                    $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('id', $teamIds);
                                    })->orWhereHas('community.team', function (Builder $query) use ($teamIds) {
                                        return $query->whereIn('id', $teamIds);
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });

        $filterCountAfter = count($query->getQuery()->wheres);
        if ($filterCountAfter > $filterCountBefore) {
            return;
        }

        // fall through - query will return nothing
        $query->where('id', null);
    }
}
