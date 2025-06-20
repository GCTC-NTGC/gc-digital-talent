<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Laratrust\Models\Team as LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $name
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
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

    /** @return HasMany<Pool, $this> */
    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    public function teamable(): MorphTo
    {
        return $this->morphTo();
    }

    /** @return HasMany<RoleAssignment, $this> */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
