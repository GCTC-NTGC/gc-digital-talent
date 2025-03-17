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
    public function scopeGeneralSearch(Builder $query, ?string $searchTerm): Builder
    {
        if (empty($searchTerm)) {
            return $query;
        }

        $query->where(function ($query) use ($searchTerm) {
            $query->whereHas('user', function ($query) use ($searchTerm) {
                User::scopeGeneralSearch($query, $searchTerm);
            });
        });

        return $query;
    }

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

    public static function scopeCommunities(Builder $query, ?array $communityIds): Builder
    {
        if (empty($communityIds)) {
            return $query;
        }

        $query->whereHas('community', function ($query) use ($communityIds) {
            Community::scopeCommunitiesByIds($query, $communityIds);
        });

        return $query;
    }

    public static function scopeWorkStreams(Builder $query, ?array $workStreamIds): Builder
    {
        if (empty($workStreamIds)) {
            return $query;
        }

        $query->whereHas('workStreams', function ($query) use ($workStreamIds) {
            $query->whereIn('community_interest_work_stream.work_stream_id', $workStreamIds);
        });

        return $query;
    }

    public function scopePoolFilters(Builder $query, ?array $poolFilters): Builder
    {
        if (empty($poolFilters)) {
            return $query;
        }

        // call the poolFilter off connected user
        $query->whereHas('user', function (Builder $userQuery) use ($poolFilters) {
            User::scopePoolFilters($userQuery, $poolFilters);
        });

        return $query;
    }

    public static function scopeJobInterest(Builder $query, ?bool $jobInterest): Builder
    {
        if ($jobInterest) {
            $query->where('job_interest', true);
        }

        return $query;
    }

    public static function scopeTrainingInterest(Builder $query, ?bool $trainingInterest): Builder
    {
        if ($trainingInterest) {
            $query->where('training_interest', true);
        }

        return $query;
    }

    public static function scopeLateralMoveInterest(Builder $query, ?bool $lateralMoveInterest): Builder
    {
        if ($lateralMoveInterest) {
            $query->whereHas('user', function ($query) {
                $query->where('career_planning_lateral_move_interest', true);
            });
        }

        return $query;
    }

    public static function scopePromotionMoveInterest(Builder $query, ?bool $promotionMoveInterest): Builder
    {
        if ($promotionMoveInterest) {
            $query->whereHas('user', function ($query) {
                $query->where('career_planning_promotion_move_interest', true);
            });
        }

        return $query;
    }

    public function scopeLanguageAbility(Builder $query, ?string $languageAbility): Builder
    {
        if (empty($languageAbility)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($languageAbility) {
            User::scopeLanguageAbility($query, $languageAbility);
        });

        return $query;
    }

    public static function scopePositionDuration(Builder $query, ?array $positionDuration): Builder
    {
        if (empty($positionDuration)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($positionDuration) {
            User::scopePositionDuration($query, $positionDuration);
        });

        return $query;
    }

    public function scopeLocationPreferences(Builder $query, ?array $workRegions): Builder
    {
        if (empty($workRegions)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($workRegions) {
            User::scopeLocationPreferences($query, $workRegions);
        });

        return $query;
    }

    public function scopeOperationalRequirements(Builder $query, ?array $operationalRequirements): Builder
    {
        if (empty($operationalRequirements)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($operationalRequirements) {
            User::scopeOperationalRequirements($query, $operationalRequirements);
        });

        return $query;
    }

    public static function scopeSkills(Builder $query, ?array $skillIds): Builder
    {
        if (empty($skillIds)) {
            return $query;
        }

        // point at filter on User
        $query->whereHas('user', function ($query) use ($skillIds) {
            User::scopeSkillsIntersectional($query, $skillIds);
        });

        return $query;
    }
}
