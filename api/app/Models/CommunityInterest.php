<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

/**
 * Class CommunityInterest
 *
 * @property string $id
 * @property string $user_id
 * @property string $community_id
 * @property bool $job_interest
 * @property bool $training_interest
 * @property string $additional_information
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class CommunityInterest extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsToMany<WorkStream, $this> */
    public function workStreams(): BelongsToMany
    {
        return $this->belongsToMany(WorkStream::class);
    }

    /** @return HasMany<DevelopmentProgramInterest, $this> */
    public function interestInDevelopmentPrograms(): HasMany
    {
        return $this->hasMany(DevelopmentProgramInterest::class);
    }

    /**
     * Scopes/filters
     */

    // scope to search records by name of attached user
    public static function scopeUserName(Builder $query, ?string $name): Builder
    {
        if (empty($name)) {
            return $query;
        }

        $query->whereHas('user', function ($query) use ($name) {
            User::scopeName($query, $name);
        });

        return $query;
    }

    // scope the query to CommunityInterests the current user can view
    // belongs to your community and one or more of jobInterest or trainingInterest is TRUE
    public function scopeAuthorizedToView(Builder $query)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if ($user?->isAbleTo('view-team-communityInterest')) {

            $query->where(function (Builder $query) use ($user) {
                $communityIds = $user->rolesTeams()
                    ->where('teamable_type', "App\Models\Community")
                    ->pluck('teamable_id')
                    ->toArray();

                return $query->whereIn('community_id', $communityIds);
            });

            $query->where(function (Builder $query) {
                $query->orWhere('job_interest', true);
                $query->orWhere('training_interest', true);

                return $query;
            });

            return $query;
        }

        // fallback
        return $query->where('id', null);
    }
}
