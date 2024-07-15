<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * Class Community
 *
 * @property string $id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property string $key
 * @property array $name
 * @property array $description
 */
class Community extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
        'description',
    ];

    public $guarded = [];

    /**
     * Search requests
     */
    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }

    /**
     * ApplicationFilters
     */
    public function applicantFilters(): HasMany
    {
        return $this->hasMany(ApplicantFilter::class);
    }

    public function team(): MorphOne
    {
        return $this->morphOne(Team::class, 'teamable');
    }

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
    public function getThroughTeamableTeamIdAttribute()
    {
        return $this->team?->id;
    }
}
