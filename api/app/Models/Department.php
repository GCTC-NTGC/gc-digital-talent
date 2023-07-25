<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class Department
 *
 * @property int $id
 * @property int $department_number
 * @property array $name
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 */

class Department extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be case.
     *
     * @var array
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
     * @param Builder $query
     * @param array<string>|null $departmentIds An array of department ids
     * @return Builder
     */
    public static function scopeDepartmentsByIds(Builder $query, ?array $departmentIds): Builder
    {
        if (empty($departmentIds)) {
            return $query;
        }

        $query->whereIn('id', $departmentIds);
        return $query;
    }
}
