<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * Class Community
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property string $key
 * @property array $name
 * @property array $description
 * @property array $mandate_authority
 */
class Community extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'name' => LocalizedString::class,
        'description' => LocalizedString::class,
        'mandate_authority' => LocalizedString::class,
    ];

    protected $fillable = [
        'name',
        'description',
        'mandate_authority',
    ];

    public $guarded = [];

    /**
     * Boot function for using with Community
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
        static::created(function (Community $community) {
            $community->team()->firstOrCreate([], [
                'name' => 'community-'.$community->id,
            ]);
        });
    }

    /** @return HasMany<PoolCandidateSearchRequest, $this> */
    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }

    /** @return HasMany<ApplicantFilter, $this> */
    public function applicantFilters(): HasMany
    {
        return $this->hasMany(ApplicantFilter::class);
    }

    /** @return MorphOne<Team, $this> */
    public function team(): MorphOne
    {
        return $this->morphOne(Team::class, 'teamable');
    }

    /** @return HasMany<Pool, $this> */
    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    /** @return HasMany<WorkStream, $this> */
    public function workStreams(): HasMany
    {
        return $this->hasMany(WorkStream::class);
    }

    /** @return HasManyThrough<RoleAssignment, Team, $this> */
    public function roleAssignments(): HasManyThrough
    {
        // I think this only works because we use UUIDs
        // There might be a better way to do this
        return $this->hasManyThrough(RoleAssignment::class, Team::class, 'teamable_id');
    }

    /**
     * Attach the users to the related team creating one if there isn't already
     *
     * @param  string|array  $userId  - Id of the user or users to attach the role to
     * @return void
     */
    public function addCommunityRecruiters(string|array $userId)
    {
        $team = $this->team()->firstOrCreate([], [
            'name' => 'community-'.$this->id,
        ]);

        if (is_array($userId)) {
            foreach ($userId as $singleUserId) {
                $user = User::find($singleUserId);
                $user->addRole('community_recruiter', $team->name);
            }
        } else {
            $user = User::find($userId);
            $user->addRole('community_recruiter', $team->name);
        }
    }

    /**
     * Attach the users to the related team creating one if there isn't already
     *
     * @param  string|array  $userId  - Id of the user or users to attach the role to
     * @return void
     */
    public function addCommunityAdmins(string|array $userId)
    {
        $team = $this->team()->firstOrCreate([], [
            'name' => 'community-'.$this->id,
        ]);

        if (is_array($userId)) {
            foreach ($userId as $singleUserId) {
                $user = User::find($singleUserId);
                $user->addRole('community_admin', $team->name);
            }
        } else {
            $user = User::find($userId);
            $user->addRole('community_admin', $team->name);
        }
    }

    /* accessor to retrieve id from teams table */
    public function getTeamIdForRoleAssignmentAttribute()
    {
        return $this->team?->id;
    }

    /** A community has 0..* associated development programs
     *
     * @return HasMany<DevelopmentProgram, $this>
     */
    public function developmentPrograms(): HasMany
    {
        return $this->hasMany(DevelopmentProgram::class);
    }

    /**
     * Re-useable scope to filter by an array of community ids
     *
     * @param  array<string>|null  $communityIds  An array of community ids
     */
    public static function scopeCommunitiesByIds(Builder $query, ?array $communityIds): Builder
    {
        if (empty($communityIds)) {
            return $query;
        }

        $query->whereIn('id', $communityIds);

        return $query;
    }
}
