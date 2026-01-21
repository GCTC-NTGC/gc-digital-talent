<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
 * @property bool $finance_is_chief
 * @property array $finance_additional_duties
 * @property array $finance_other_roles
 * @property string $finance_other_roles_other
 * @property bool $consent_to_share_profile
 */
class CommunityInterest extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $touches = ['user'];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'finance_additional_duties' => 'array',
        'finance_other_roles' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'consent_to_share_profile',
    ];

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
                $query->whereGeneralSearch($searchTerm);
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
            $query->whereName($name);
        });

        return $query;
    }

    public static function scopeOrderByClassification(Builder $query, ?string $order)
    {
        if (! $order) {
            return $query;
        }

        return $query->leftJoin('users', 'community_interests.user_id', '=', 'users.id')
            ->leftJoin('classifications', 'users.computed_classification', '=', 'classifications.id')
            ->orderBy('group', $order)
            ->orderBy('level', $order);
    }

    // scope the query to CommunityInterests the current user can view
    // own interest or belongs to your community and consentToShareProfile is TRUE
    public function scopeAuthorizedToView(Builder $query, ?array $args = null)
    {
        /** @var \App\Models\User | null */
        $user = Auth::user();

        if (isset($args['userId'])) {
            $user = User::findOrFail($args['userId']);
        }

        // can see any community interest - return with no filters added
        if ($user?->isAbleTo('view-any-communityInterest')) {
            return $this;
        }

        // we might want to add some filters for some candidates
        $filterCountBefore = count($query->getQuery()->wheres);
        $query->where(function (Builder $query) use ($user) {

            // the user might be able to view their own interests
            if ($user?->isAbleTo('view-own-employeeProfile')) {
                $query->orWhere('user_id', $user->id);
            }

            // the user might be able to view their communities' interests
            if ($user?->isAbleTo('view-team-communityInterest')) {
                $query->orWhere(function (Builder $query) use ($user) {

                    // all community teams that the user is a member in
                    $allCommunityTeams = $user->rolesTeams()
                        ->where('teamable_type', "App\Models\Community")
                        ->get();

                    // filter community teams down to those where the user also has permission to see the interests
                    $viewPermissionCommunityTeams = $allCommunityTeams
                        ->filter(fn ($team) => $user->isAbleTo('view-team-communityInterest', $team));

                    $query->whereIn('community_id', $viewPermissionCommunityTeams->pluck('teamable_id')->toArray());
                    $query->where('consent_to_share_profile', true);
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
        $query->whereHas('user', function ($userQuery) use ($poolFilters) {
            $userQuery->wherePoolExists($poolFilters);
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
            $query->whereLanguageAbility($languageAbility);
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
            $query->wherePositionDurationIn($positionDuration);
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
            $query->whereLocationPreferencesIn($workRegions);
        });

        return $query;
    }

    public function scopeFlexibleWorkLocations(Builder $query, ?array $workLocations): Builder
    {
        if (empty($workLocations)) {
            return $query;
        }

        $query->whereHas('user', function ($query) use ($workLocations) {
            $query->whereFlexibleWorkLocationsIn($workLocations);
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
            $query->whereOperationalRequirementsIn($operationalRequirements);
        });

        return $query;
    }

    public function scopeSkills(Builder $query, ?array $skillIds): Builder
    {
        if (empty($skillIds)) {
            return $query;
        }

        $query = $this->addSkillCountSelect($query, $skillIds);

        // point at filter on User
        $query->whereHas('user', function ($query) use ($skillIds) {
            $query->whereSkillsAdditive($skillIds);
        });

        return $query;
    }

    public static function scopeIsVerifiedGovEmployee(Builder $query): Builder
    {
        $query->whereHas('user', function ($query) {
            $query->whereIsVerifiedGovEmployee();
        });

        return $query;
    }

    private function addSkillCountSelect(Builder $query, ?array $skillIds): Builder
    {
        return $query->addSelect([
            'skill_count' => Skill::whereIn('skills.id', $skillIds)
                ->join('users', 'users.id', '=', 'community_interests.user_id')
                ->whereHas('userSkills', function (Builder $query) {
                    $query->whereColumn('user_id', 'users.id');
                })
                ->select(DB::raw('count(*) as skills')),
        ]);
    }

    public function scopeWithSkillCount(Builder $query)
    {
        // Checks if the query already has a skill_count select and if it does, it skips adding it again
        $columns = $query->getQuery()->columns;
        $normalizedColumns = array_map(function ($column) {
            // Massage the column name to be a string and only return the column name
            return $column instanceof Expression
                ? Str::afterLast($column->getValue(DB::getQueryGrammar()), 'as ')
                : Str::afterLast($column, 'as ');
        }, $columns ?? []);

        // Check if our array of columns contains the skill_count column
        // If it does, we do not need to add it again
        if (in_array('"skill_count"', $normalizedColumns)) {
            return $query;
        }

        return $query->addSelect([
            'skill_count' => Skill::whereIn('skills.id', [])
                ->select(DB::raw('null as skill_count')),
        ]);
    }
}
