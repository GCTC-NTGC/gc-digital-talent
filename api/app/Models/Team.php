<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Laratrust\Models\Team as LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $name
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class Team extends LaratrustTeam
{
    use HasFactory;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'teamable_id',
        'teamable_type',
    ];

    public $guarded = [];

    protected $with = ['teamable'];

    /** @return HasMany<Pool, $this> */
    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    public function teamable(): MorphTo
    {
        // Eager load what PoolPolicy::view reads (via getPoolTeams). without('teamable') breaks the
        // teamable -> team -> teamable cycle caused by $with = ['teamable'].
        $withoutTeamable = fn ($query) => $query->without('teamable');

        return $this->morphTo()->morphWith([
            Pool::class => [
                'team' => $withoutTeamable,
                'community.team' => $withoutTeamable,
                'department.team' => $withoutTeamable,
            ],
        ]);
    }

    /** @return HasMany<RoleAssignment, $this> */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
