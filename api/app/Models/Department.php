<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Department
 *
 * @property int $id
 * @property int $department_number
 * @property array $name
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 */
class Department extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be case.
     */
    protected $casts = [
        'name' => 'array',
    ];

    /**
     * Model relations
     */
    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_department');
    }

    /**
     * Scopes/filters
     */

    /**
     * Re-useable scope to filter by an array of department ids
     *
     * @param  array<string>|null  $departmentIds  An array of department ids
     */
    public static function scopeDepartmentsByIds(Builder $query, ?array $departmentIds): Builder
    {
        if (empty($departmentIds)) {
            return $query;
        }

        $query->whereIn('id', $departmentIds);

        return $query;
    }

    /**
     * Get the pools for the department.
     */
    public function pools()
    {
        return $this->hasMany(Pool::class);
    }
}
